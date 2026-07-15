/**
 * Mehrere Gutscheine gebündelt als ZIP ausliefern (Bulk-Export). Jede Karte als
 * eigene PDF. Zugriff nur mit Admin-Session (nicht über den Käufer-Token).
 * Aufruf: /api/giftcards/bulk?ids=<id1,id2,...>
 */
import { cookies } from 'next/headers';
import { zipSync } from 'fflate';
import { createAdminClient } from '@/lib/supabase/admin';
import { supabaseAdminConfigured } from '@/lib/supabase/env';
import { ADMIN_COOKIE, verifyAdminToken } from '@/lib/admin/session';
import { loadGiftCard } from '@/lib/giftcards/db';
import { renderGiftCardPdf } from '@/lib/giftcards/pdf';

const MAX_IDS = 500;

export async function GET(request: Request) {
  if (!supabaseAdminConfigured()) return new Response('Not configured', { status: 503 });

  const store = await cookies();
  if (!(await verifyAdminToken(store.get(ADMIN_COOKIE)?.value))) {
    return new Response('Unauthorized', { status: 401 });
  }

  const ids = (new URL(request.url).searchParams.get('ids') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, MAX_IDS);
  if (ids.length === 0) return new Response('Keine Gutscheine ausgewählt', { status: 400 });

  const sb = createAdminClient();
  const files: Record<string, Uint8Array> = {};
  const used = new Set<string>();

  await Promise.all(
    ids.map(async (id) => {
      const card = await loadGiftCard(sb, id);
      // Nur Karten mit PDF (aktiv/eingelöst) exportieren; Rest still überspringen.
      if (!card || (card.status !== 'active' && card.status !== 'redeemed')) return;
      const pdf = await renderGiftCardPdf(card);
      let name = `${card.code}.pdf`;
      let n = 2;
      while (used.has(name)) name = `${card.code}-${n++}.pdf`;
      used.add(name);
      files[name] = new Uint8Array(pdf);
    }),
  );

  if (Object.keys(files).length === 0) {
    return new Response('Keine exportierbaren Gutscheine', { status: 404 });
  }

  const zip = zipSync(files, { level: 0 });
  const stamp = new Date().toISOString().slice(0, 10);

  return new Response(new Uint8Array(zip), {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="gutscheine-${stamp}.zip"`,
    },
  });
}
