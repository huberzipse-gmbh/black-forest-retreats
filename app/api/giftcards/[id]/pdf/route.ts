/**
 * Öffentliche Gutschein-PDF-Route, gated über den download_token der Karte
 * (kein Admin-Cookie — der Käufer lädt sein PDF selbst). Das PDF wird
 * deterministisch aus der Row regeneriert.
 */
import { type NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { supabaseAdminConfigured } from '@/lib/supabase/env';
import { loadGiftCard } from '@/lib/giftcards/db';
import { renderGiftCardPdf } from '@/lib/giftcards/pdf';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!supabaseAdminConfigured()) {
    return new Response('Nicht konfiguriert', { status: 501 });
  }

  const { id } = await params;
  const token = req.nextUrl.searchParams.get('token') ?? '';
  if (!token) return new Response('Token fehlt', { status: 401 });

  const card = await loadGiftCard(createAdminClient(), id);
  if (!card || card.downloadToken !== token) {
    return new Response('Nicht gefunden', { status: 404 });
  }
  if (card.status !== 'active' && card.status !== 'redeemed') {
    return new Response('Gutschein nicht aktiv', { status: 409 });
  }

  const pdf = await renderGiftCardPdf(card);
  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${card.code}.pdf"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
