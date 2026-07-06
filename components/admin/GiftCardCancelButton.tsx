"use client";

/** Storno-Button in der Gutschein-Liste (nur bei unangetastetem Guthaben). */
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelGiftCard } from "@/app/admin/actions";

export function GiftCardCancelButton({ giftCardId }: { giftCardId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const cancel = () => {
    if (!window.confirm("Gutschein wirklich stornieren? Eine Stripe-Erstattung läuft manuell über das Dashboard.")) return;
    startTransition(async () => {
      const res = await cancelGiftCard(giftCardId);
      if (!res.ok) setError(res.error ?? "Storno fehlgeschlagen.");
      else router.refresh();
    });
  };

  return (
    <span>
      <button
        type="button"
        disabled={isPending}
        onClick={cancel}
        className="font-body text-xs font-semibold text-red-800/80 underline-offset-2 hover:underline disabled:opacity-40"
      >
        Stornieren
      </button>
      {error && <span className="ms-2 font-body text-xs text-red-800">{error}</span>}
    </span>
  );
}
