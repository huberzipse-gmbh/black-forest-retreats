"use client";

/**
 * Gutschein-Liste mit Mehrfachauswahl und Bulk-PDF-Export (ZIP).
 * Auswählbar sind nur Gutscheine mit PDF (Status aktiv oder eingelöst).
 */
import { useState } from "react";
import { dateDe, eur } from "@/lib/admin/format";
import { GiftCardCancelButton } from "@/components/admin/GiftCardCancelButton";

const STATUS_LABEL: Record<string, string> = {
  pending: "Offen (unbezahlt)",
  active: "Aktiv",
  redeemed: "Eingelöst",
  expired: "Abgelaufen",
  cancelled: "Storniert",
};

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-cream-100 text-forest-700/70",
  active: "bg-forest-50 text-forest-700",
  redeemed: "bg-brass-400/15 text-brass-600",
  expired: "bg-cream-100 text-forest-700/50",
  cancelled: "bg-red-50 text-red-800",
};

export interface GiftCardListRow {
  id: string;
  code: string;
  demo: boolean;
  source: string | null;
  status: string;
  amountCents: number;
  balanceCents: number;
  buyerName: string;
  buyerEmail: string;
  recipientName: string;
  createdAt: string;
  expiresAt: string | null;
  downloadToken: string;
}

export function GiftCardExportList({ rows }: { rows: GiftCardListRow[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const exportable = rows.filter((r) => r.status === "active" || r.status === "redeemed");
  const allSelected = exportable.length > 0 && selected.size === exportable.length;

  const toggle = (id: string) =>
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(exportable.map((r) => r.id)));

  const exportZip = () => {
    if (selected.size === 0) return;
    const ids = exportable.filter((r) => selected.has(r.id)).map((r) => r.id);
    window.location.href = `/api/giftcards/bulk?ids=${encodeURIComponent(ids.join(","))}`;
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
            Aktive Gutscheine ankreuzen, um ihre PDFs gebündelt als ZIP zu exportieren.
          </span>
        )}
      </div>

      <div className="overflow-x-auto rounded-[8px] border border-forest-900/10 bg-white">
        <table className="w-full min-w-[940px]">
          <thead>
            <tr className="border-b border-forest-900/10">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  aria-label="Alle exportierbaren auswählen"
                  className="h-4 w-4 accent-forest-900"
                  disabled={exportable.length === 0}
                />
              </th>
              {["Code", "Status", "Wert", "Restguthaben", "Käufer", "Für", "Gekauft", "Gültig bis", ""].map(
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
                <td colSpan={10} className="px-4 py-10 text-center font-body text-sm text-forest-700/60">
                  Noch keine Gutscheine verkauft.
                </td>
              </tr>
            )}
            {rows.map((c) => {
              const canExport = c.status === "active" || c.status === "redeemed";
              return (
                <tr
                  key={c.id}
                  className={`border-b border-forest-900/5 last:border-0 hover:bg-cream-50 ${
                    selected.has(c.id) ? "bg-brass-400/10" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    {canExport && (
                      <input
                        type="checkbox"
                        checked={selected.has(c.id)}
                        onChange={() => toggle(c.id)}
                        aria-label={`${c.code} auswählen`}
                        className="h-4 w-4 accent-forest-900"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 font-body text-sm font-semibold tracking-wide text-forest-900">
                    {c.code}
                    {c.demo && (
                      <span className="ms-2 rounded-[3px] bg-cream-100 px-1.5 py-0.5 font-body text-[0.6rem] font-semibold uppercase text-forest-700/60">
                        Demo
                      </span>
                    )}
                    {c.source === "admin" && (
                      <span className="ms-2 rounded-[3px] bg-brass-400/15 px-1.5 py-0.5 font-body text-[0.6rem] font-semibold uppercase text-brass-600">
                        Manuell
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-[4px] px-2 py-1 font-body text-xs font-semibold ${
                        STATUS_STYLE[c.status] ?? ""
                      }`}
                    >
                      {STATUS_LABEL[c.status] ?? c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-forest-900">{eur(c.amountCents)}</td>
                  <td className="px-4 py-3 font-body text-sm font-semibold text-forest-900">
                    {eur(c.balanceCents)}
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-forest-700/80">
                    {c.buyerName}
                    <div className="font-body text-xs text-forest-700/55">{c.buyerEmail}</div>
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-forest-700/80">{c.recipientName}</td>
                  <td className="px-4 py-3 font-body text-sm text-forest-700/80">{dateDe(c.createdAt)}</td>
                  <td className="px-4 py-3 font-body text-sm text-forest-700/80">
                    {c.expiresAt ? dateDe(c.expiresAt) : "—"}
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="flex items-center justify-end gap-3">
                      {canExport && (
                        <a
                          href={`/api/giftcards/${c.id}/pdf?token=${c.downloadToken}`}
                          target="_blank"
                          rel="noopener"
                          className="font-body text-xs font-semibold text-brass-600 underline-offset-2 hover:underline"
                        >
                          PDF
                        </a>
                      )}
                      {(c.status === "pending" || c.status === "active") &&
                        c.balanceCents === c.amountCents && <GiftCardCancelButton giftCardId={c.id} />}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
