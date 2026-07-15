"use client";

/**
 * Rechnungsliste mit Mehrfachauswahl und Bulk-PDF-Export (ZIP).
 * Für die Buchhaltung: mehrere Rechnungen ankreuzen, einmal exportieren.
 */
import { useState } from "react";
import Link from "next/link";
import { dateDe, eur } from "@/lib/admin/format";

export interface InvoiceListRow {
  id: string;
  invoiceNumber: string;
  kind: string;
  issuedAt: string;
  recipientName: string;
  reference: string;
  grossCents: number;
}

export function InvoiceExportList({ rows }: { rows: InvoiceListRow[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allSelected = rows.length > 0 && selected.size === rows.length;
  const toggle = (id: string) =>
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.id)));

  const exportZip = () => {
    if (selected.size === 0) return;
    const ids = rows.filter((r) => selected.has(r.id)).map((r) => r.id);
    // GET-Download: löst den Datei-Download im Browser aus.
    window.location.href = `/api/invoices/bulk?ids=${encodeURIComponent(ids.join(","))}`;
  };

  return (
    <div>
      <div className="mb-3 flex min-h-9 items-center gap-3">
        {selected.size > 0 ? (
          <>
            <button
              type="button"
              onClick={exportZip}
              className="rounded-[3px] bg-forest-900 px-4 py-2 font-body text-xs font-semibold uppercase tracking-wider text-cream-50 transition-colors hover:bg-forest-800"
            >
              {selected.size} als ZIP exportieren
            </button>
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="font-body text-xs text-forest-700/60 underline-offset-2 hover:underline"
            >
              Auswahl aufheben
            </button>
          </>
        ) : (
          <span className="font-body text-xs text-forest-700/50">
            Rechnungen ankreuzen, um sie gebündelt als ZIP zu exportieren.
          </span>
        )}
      </div>

      <div className="overflow-x-auto rounded-[8px] border border-forest-900/10 bg-white">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-forest-900/10">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  aria-label="Alle auswählen"
                  className="h-4 w-4 accent-forest-900"
                />
              </th>
              {["Nummer", "Art", "Datum", "Empfänger", "Buchung / Gutschein", "Brutto", ""].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-start font-body text-[0.65rem] font-semibold uppercase tracking-wider text-forest-700/55"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center font-body text-sm text-forest-700/60">
                  Noch keine Rechnungen. Die erste entsteht automatisch mit der ersten Zahlung.
                </td>
              </tr>
            )}
            {rows.map((inv) => (
              <tr
                key={inv.id}
                className={`border-b border-forest-900/5 last:border-0 hover:bg-cream-50 ${
                  selected.has(inv.id) ? "bg-brass-400/10" : ""
                }`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(inv.id)}
                    onChange={() => toggle(inv.id)}
                    aria-label={`${inv.invoiceNumber} auswählen`}
                    className="h-4 w-4 accent-forest-900"
                  />
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/rechnungen/${inv.id}`}
                    className="font-body text-sm font-semibold text-forest-900 underline-offset-2 hover:underline"
                  >
                    {inv.invoiceNumber}
                  </Link>
                </td>
                <td className="px-4 py-3 font-body text-sm text-forest-700/80">
                  {inv.kind === "storno" ? "Stornorechnung" : "Rechnung"}
                </td>
                <td className="px-4 py-3 font-body text-sm text-forest-700/80">{dateDe(inv.issuedAt)}</td>
                <td className="px-4 py-3 font-body text-sm text-forest-900">{inv.recipientName}</td>
                <td className="px-4 py-3 font-body text-sm text-forest-700/80">{inv.reference}</td>
                <td className="px-4 py-3 font-body text-sm font-semibold text-forest-900">
                  {eur(inv.grossCents)}
                </td>
                <td className="px-4 py-3 text-end">
                  <a
                    href={`/api/invoices/${inv.id}/pdf`}
                    className="font-body text-xs font-semibold text-brass-600 underline-offset-2 hover:underline"
                  >
                    PDF
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
