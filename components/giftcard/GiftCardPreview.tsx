"use client";

/**
 * Gutschein-Karte im Holz-Look — Live-Vorschau im Wizard (Code maskiert)
 * und echte Karte auf der Erfolgsseite. Spiegelbild des PDF-Layouts.
 */
import Image from "next/image";
import { useLocale, useStrings } from "@/lib/i18n/I18nProvider";
import { fmtDate, fmtEur, fmtNum } from "@/lib/i18n/format";
import { woodStyle } from "@/lib/theme/wood";
import type { GiftElementIcon } from "@/lib/giftcards/types";

interface Props {
  amountCents: number;
  recipientName: string;
  buyerName: string;
  message: string;
  elementIcon: GiftElementIcon;
  /** null = Vorschau vor der Zahlung → maskierter Platzhalter. */
  code: string | null;
  /** ISO-Datum; null = generischer „3 Jahre gültig"-Hinweis. */
  expiresAt: string | null;
}

export function GiftCardPreview({
  amountCents,
  recipientName,
  buyerName,
  message,
  elementIcon,
  code,
  expiresAt,
}: Props) {
  const t = useStrings().giftFlow.card;
  const locale = useLocale();

  return (
    // Mobil wächst die Karte mit dem Inhalt, ab sm gilt das 3:2-Kartenformat.
    <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-[10px] text-cream-50 shadow-[0_20px_60px_rgba(15,24,19,0.35)] sm:aspect-[3/2]">
      {/* Holz-Hintergrund + Lesbarkeits-Verlauf (wie GiftVoucher-Sektion) */}
      <div aria-hidden className="absolute inset-0" style={woodStyle} />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-night/55 via-night/35 to-night/65" />

      <div className="relative z-10 flex h-full flex-col items-center px-6 py-5 text-center sm:px-10 sm:py-7">
        <div className="font-display text-lg text-cream-50 sm:text-xl">Black Forest Retreats</div>
        <div className="mt-0.5 font-body text-[0.55rem] font-semibold uppercase tracking-[0.42em] text-cream-100/80">
          Neuenbürg
        </div>

        <div className="relative mt-2 h-10 w-10 sm:mt-3 sm:h-12 sm:w-12">
          <Image src={`/images/giftcard/${elementIcon}.png`} alt="" fill sizes="48px" className="rounded-full object-cover" />
        </div>

        <div className="mt-1.5 font-body text-[0.6rem] font-bold uppercase tracking-[0.3em] text-brass-300 sm:mt-2">
          {t.eyebrow}
        </div>
        <div className="mt-1 font-display text-4xl text-cream-50 sm:text-5xl">
          {fmtNum(fmtEur(amountCents, locale), locale)}
        </div>

        <div className="mt-1.5 font-body text-xs text-cream-100/90 sm:text-sm">
          {t.forLabel} {recipientName || "…"} · {t.fromLabel} {buyerName || "…"}
        </div>
        {message && (
          <p className="mt-1.5 line-clamp-2 max-w-sm font-display text-xs italic leading-relaxed text-cream-100/90 sm:text-sm">
            „{message}“
          </p>
        )}

        <div className="mt-5 sm:mt-auto">
          <div className="rounded-[5px] border border-brass-400 bg-night/35 px-5 py-2">
            <div className="font-body text-[0.5rem] font-semibold uppercase tracking-[0.28em] text-brass-300">
              {t.codeLabel}
            </div>
            <div className="mt-0.5 font-body text-sm font-bold tracking-[0.22em] text-cream-50 sm:text-base">
              {code ?? "GIFT-••••-••••"}
            </div>
          </div>
          <div className="mt-2.5 font-body text-[0.6rem] leading-relaxed text-cream-100/75">
            {expiresAt ? t.validUntil(fmtNum(fmtDate(expiresAt, locale), locale)) : t.validity}
            <br />
            {t.redeemHint}
          </div>
        </div>
      </div>
    </div>
  );
}
