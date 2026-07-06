"use client";

/**
 * Gemeinsames Codefeld im Preis-Panel: Rabattcodes (Prozent-Aktion) UND
 * Gutschein-Codes (Wertguthaben). Der Server probiert beide Prüfungen;
 * eingelöste Codes liegen in getrennten Cookies und können gleichzeitig
 * aktiv sein — je ein Chip mit eigenem Entfernen-Link.
 */
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useStrings } from "@/lib/i18n/I18nProvider";
import { fmtEur, fmtNum } from "@/lib/i18n/format";
import { applyPromoCode, removePromoCode } from "@/lib/booking/promo";
import { applyGiftCode, removeGiftCode } from "@/lib/giftcards/redeem";

interface Props {
  /** Aktuell eingelöster, gültiger Rabattcode (aus dem Cookie, serverseitig validiert). */
  activeCode: string | null;
  percent: number;
  /** Ob die Rabattcode-Aktion überhaupt aktiv ist (steuert nur den Versuch, nicht das Feld). */
  promoAvailable: boolean;
  /** Aktuell eingelöster Gutschein (serverseitig aufgelöst). */
  activeGift: { code: string; balanceCents: number } | null;
}

export function PromoCodeField({ activeCode, percent, promoAvailable, activeGift }: Props) {
  const t = useStrings().bookingFlow.promo;
  const locale = useLocale();
  const router = useRouter();
  const [value, setValue] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [isPending, startTransition] = useTransition();

  const pct = String(percent).replace(".", locale === "de" ? "," : ".");

  const apply = () => {
    if (!value.trim()) return;
    setInvalid(false);
    startTransition(async () => {
      // Erst Rabattcode, dann Gutschein — die Codes sind disjunkt.
      if (promoAvailable) {
        const promo = await applyPromoCode(value);
        if (promo.ok) {
          setValue("");
          router.refresh();
          return;
        }
      }
      const gift = await applyGiftCode(value);
      if (gift.ok) {
        setValue("");
        router.refresh();
      } else {
        setInvalid(true);
      }
    });
  };

  const removePromo = () =>
    startTransition(async () => {
      await removePromoCode();
      router.refresh();
    });

  const removeGift = () =>
    startTransition(async () => {
      await removeGiftCode();
      router.refresh();
    });

  const chip =
    "flex items-center justify-between gap-3 rounded-[6px] border border-forest-500/30 bg-forest-50 px-4 py-3";
  const removeBtn =
    "shrink-0 font-body text-xs font-semibold text-forest-700/70 underline underline-offset-2 transition-colors hover:text-forest-900 disabled:opacity-40";

  return (
    <div className="space-y-3">
      {activeCode && (
        <div className={chip}>
          <p className="font-body text-xs leading-relaxed text-forest-700">
            {fmtNum(t.applied(activeCode, pct), locale)}
          </p>
          <button type="button" disabled={isPending} onClick={removePromo} className={removeBtn}>
            {t.remove}
          </button>
        </div>
      )}

      {activeGift && (
        <div className={chip}>
          <p className="font-body text-xs leading-relaxed text-forest-700">
            {fmtNum(t.giftApplied(activeGift.code, fmtEur(activeGift.balanceCents, locale)), locale)}
          </p>
          <button type="button" disabled={isPending} onClick={removeGift} className={removeBtn}>
            {t.remove}
          </button>
        </div>
      )}

      {/* Eingabe bleibt sichtbar, solange noch nicht beide Code-Arten aktiv sind. */}
      {(!activeCode || !activeGift) && (
        <div>
          <div className="flex gap-2">
            <input
              className="w-full rounded-[4px] border border-forest-900/20 bg-white px-3.5 py-2.5 font-body text-sm text-forest-900 uppercase placeholder:normal-case outline-none transition-colors focus:border-forest-900"
              placeholder={t.placeholder}
              aria-label={t.title}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setInvalid(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && apply()}
            />
            <button
              type="button"
              disabled={isPending || !value.trim()}
              onClick={apply}
              className="shrink-0 rounded-[3px] border border-forest-900/25 px-4 py-2 font-body text-xs font-semibold uppercase tracking-wider text-forest-900 transition-colors hover:border-forest-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t.apply}
            </button>
          </div>
          {invalid && <p className="mt-2 font-body text-xs text-red-800">{t.invalid}</p>}
        </div>
      )}
    </div>
  );
}
