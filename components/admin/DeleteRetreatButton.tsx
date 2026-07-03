"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteRetreat } from "@/app/admin/actions";

/**
 * Wohnung endgültig löschen — mit Bestätigungsdialog. Wohnungen mit Buchungen
 * werden serverseitig abgelehnt (GoBD); die Fehlermeldung erscheint im Dialog.
 */
export function DeleteRetreatButton({ retreatId, name }: { retreatId: string; name: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const confirm = () => {
    startTransition(async () => {
      const res = await deleteRetreat(retreatId);
      if (!res.ok) {
        setError(res.error ?? "Löschen fehlgeschlagen.");
        return;
      }
      setOpen(false);
      router.push("/admin/wohnungen");
      router.refresh();
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => { setError(null); setOpen(true); }}
        className="rounded-[3px] border border-red-800/40 px-5 py-2.5 font-body text-xs font-semibold uppercase tracking-wider text-red-800 transition-colors hover:bg-red-800 hover:text-white"
      >
        Wohnung löschen
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-night/60 px-6">
          <div className="w-full max-w-md rounded-[8px] bg-white p-6">
            <h3 className="font-display text-xl text-forest-900">„{name}“ endgültig löschen?</h3>
            <p className="mt-2 font-body text-sm text-forest-700/80">
              Preisregeln, Kalender-Sperren und Fotos werden mitgelöscht. Die Wohnung
              verschwindet sofort von der Website. Das lässt sich nicht rückgängig machen.
              Wohnungen mit Buchungen können nicht gelöscht werden — dort stattdessen
              „Nicht buchbar“ setzen.
            </p>
            {error && <p className="mt-3 font-body text-sm text-red-800">{error}</p>}
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-[3px] border border-forest-900/25 px-5 py-2.5 font-body text-xs font-semibold uppercase tracking-wider text-forest-900"
              >
                Abbrechen
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={confirm}
                className="rounded-[3px] bg-red-800 px-5 py-2.5 font-body text-xs font-semibold uppercase tracking-wider text-white disabled:opacity-50"
              >
                {isPending ? "Lösche …" : "Endgültig löschen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
