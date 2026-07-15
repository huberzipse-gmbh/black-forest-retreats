/**
 * Mehrere Rechnungen gebündelt als ZIP ausliefern (Bulk-Export für die
 * Buchhaltung). Jede Rechnung als eigene PDF in der ZIP. Zugriff nur mit
 * Admin-Session. Aufruf: /api/invoices/bulk?ids=<id1,id2,...>
 */
import { cookies } from 'next/headers';
import { zipSync } from 'fflate';
import { createAdminClient } from '@/lib/supabase/admin';
import { supabaseAdminConfigured } from '@/lib/supabase/env';
import { ADMIN_COOKIE, verifyAdminToken } from '@/lib/admin/session';
import { getInvoicePdf, mapInvoice } from '@/lib/invoices/create';

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
  if (ids.length === 0) return new Response('Keine Rechnungen ausgewählt', { status: 400 });

  const sb = createAdminClient();
  const { data: rows, error } = await sb
    .from('invoices')
    .select('*, bookings(booking_number)')
    .in('id', ids);
  if (error) return new Response('Fehler beim Laden', { status: 500 });
  if (!rows || rows.length === 0) return new Response('Not found', { status: 404 });

  // PDFs rendern (parallel), Dateinamen bei Duplikaten eindeutig halten.
  const files: Record<string, Uint8Array> = {};
  const used = new Set<string>();
  await Promise.all(
    rows.map(async (row) => {
      const invoice = mapInvoice(
        row,
        (row as { bookings?: { booking_number?: string } }).bookings?.booking_number,
      );
      const pdf = await getInvoicePdf(invoice);
      let name = `${invoice.invoiceNumber}.pdf`;
      let n = 2;
      while (used.has(name)) name = `${invoice.invoiceNumber}-${n++}.pdf`;
      used.add(name);
      files[name] = new Uint8Array(pdf);
    }),
  );

  // PDFs sind bereits komprimiert → ZIP im Speicher-Modus (level 0), schnell.
  const zip = zipSync(files, { level: 0 });
  const stamp = new Date().toISOString().slice(0, 10);

  return new Response(new Uint8Array(zip), {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="rechnungen-${stamp}.zip"`,
    },
  });
}
