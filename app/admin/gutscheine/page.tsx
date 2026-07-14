import { createAdminClient } from "@/lib/supabase/admin";
import { supabaseAdminConfigured } from "@/lib/supabase/env";
import { dateDe, eur } from "@/lib/admin/format";
import { AdminNotConfigured } from "@/components/admin/AdminNotConfigured";
import { GiftCardCancelButton } from "@/components/admin/GiftCardCancelButton";
import { GiftCardCreateForm } from "@/components/admin/GiftCardCreateForm";

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

export default async function AdminGiftCardsPage() {
  if (!supabaseAdminConfigured()) return <AdminNotConfigured />;
  const sb = createAdminClient();
  const { data: cards } = await sb
    .from("gift_cards")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  return (
    <div>
      <h1 className="font-display text-3xl text-forest-900">Gutscheine</h1>
      <p className="mt-2 font-body text-sm text-forest-700/70">
        Wertgutscheine aus dem Kaufflow und selbst ausgestellte Gutscheine. Restguthaben bleibt auf
        dem Code; Storno nur bei unangetastetem Guthaben (Stripe-Erstattung manuell im Dashboard).
      </p>

      <GiftCardCreateForm />

      <div className="mt-6 overflow-x-auto rounded-[8px] border border-forest-900/10 bg-white">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-forest-900/10">
              {["Code", "Status", "Wert", "Restguthaben", "Käufer:in", "Für", "Gekauft", "Gültig bis", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-start font-body text-[0.65rem] font-semibold uppercase tracking-wider text-forest-700/55">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(cards ?? []).length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center font-body text-sm text-forest-700/60">
                  Noch keine Gutscheine verkauft.
                </td>
              </tr>
            )}
            {(cards ?? []).map((c) => (
              <tr key={c.id} className="border-b border-forest-900/5 last:border-0 hover:bg-cream-50">
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
                  <span className={`rounded-[4px] px-2 py-1 font-body text-xs font-semibold ${STATUS_STYLE[c.status] ?? ""}`}>
                    {STATUS_LABEL[c.status] ?? c.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-body text-sm text-forest-900">{eur(c.amount_cents)}</td>
                <td className="px-4 py-3 font-body text-sm font-semibold text-forest-900">{eur(c.balance_cents)}</td>
                <td className="px-4 py-3 font-body text-sm text-forest-700/80">
                  {c.buyer_name}
                  <div className="font-body text-xs text-forest-700/55">{c.buyer_email}</div>
                </td>
                <td className="px-4 py-3 font-body text-sm text-forest-700/80">{c.recipient_name}</td>
                <td className="px-4 py-3 font-body text-sm text-forest-700/80">{dateDe(c.created_at)}</td>
                <td className="px-4 py-3 font-body text-sm text-forest-700/80">
                  {c.expires_at ? dateDe(c.expires_at) : "—"}
                </td>
                <td className="px-4 py-3 text-end">
                  <div className="flex items-center justify-end gap-3">
                    {(c.status === "active" || c.status === "redeemed") && (
                      <a
                        href={`/api/giftcards/${c.id}/pdf?token=${c.download_token}`}
                        target="_blank"
                        rel="noopener"
                        className="font-body text-xs font-semibold text-brass-600 underline-offset-2 hover:underline"
                      >
                        PDF
                      </a>
                    )}
                    {(c.status === "pending" || c.status === "active") &&
                      c.balance_cents === c.amount_cents && <GiftCardCancelButton giftCardId={c.id} />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
