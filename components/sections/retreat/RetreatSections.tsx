"use client";

import type { RetreatCard } from "@/data/retreats";
import { useLocale, useStrings } from "@/lib/i18n/I18nProvider";
import { fmtNum } from "@/lib/i18n/format";
import { Type } from "@/components/ui/Type";
import { Reveal } from "@/components/ui/Reveal";
import { UspIcon } from "./UspIcons";

/** Fünf gefüllte Messing-Sterne. */
export function Stars({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <span aria-hidden className="inline-flex items-center gap-0.5 text-brass-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12 2.5 14.85 8.6l6.65.75-4.9 4.55 1.3 6.55L12 17.6 6.1 20.45l1.3-6.55L2.5 9.35 9.15 8.6z" />
        </svg>
      ))}
    </span>
  );
}

/** USP-Highlight-Leiste: was die Unterkunft besonders macht. */
export function RetreatHighlights({ usps }: { usps: NonNullable<RetreatCard["usps"]> }) {
  const t = useStrings().apartments.detail;
  if (!usps?.length) return null;
  return (
    <section className="bg-cream-50 px-6 pt-20 md:px-10 md:pt-28">
      <div className="mx-auto max-w-7xl">
        <Type role="eyebrow" className="text-brass-600">
          {t.highlights}
        </Type>
        <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {usps.map((u, i) => (
            <Reveal key={u.title} delay={(i % 4) * 80}>
              <div className="flex flex-col items-start">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-brass-400/40 text-brass-600">
                  <UspIcon name={u.icon} className="h-6 w-6" />
                </span>
                <Type role="h3" as="h3" className="mt-5 text-forest-900">
                  {u.title}
                </Type>
                {u.text && (
                  <p className="mt-2 font-body text-sm leading-relaxed text-forest-700/80">
                    {u.text}
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Bewertungs-Bereich: Wertungs-Zusammenfassung + Gäste-Stimmen. */
export function RetreatReviews({ retreat }: { retreat: RetreatCard }) {
  const t = useStrings().apartments.detail;
  const locale = useLocale();
  if (!retreat.rating || !retreat.reviews?.length) return null;
  const count = retreat.reviewCount ?? retreat.reviews.length;

  return (
    <section className="bg-cream-100 px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        {/* Zusammenfassung */}
        <Reveal className="flex flex-col items-center text-center">
          <Type role="eyebrow" className="text-brass-600">
            {t.reviewsTitle}
          </Type>
          <div className="mt-6 flex items-center gap-4">
            <span className="font-display text-[clamp(2.5rem,6vw,4rem)] leading-none text-forest-900">
              {fmtNum(retreat.rating, locale)}
            </span>
            <span className="flex flex-col items-start">
              <Stars className="h-4 w-4" />
              <span className="mt-1 font-body text-sm text-forest-700/80">
                {fmtNum(t.reviewsCount(count), locale)}
              </span>
            </span>
          </div>
          {retreat.guestFavorite && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-full border border-brass-400/50 px-3 py-1 font-body text-xs font-semibold uppercase tracking-[0.16em] text-brass-600">
                {t.guestFavorite}
              </span>
            </div>
          )}
        </Reveal>

        {/* Gäste-Stimmen */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {retreat.reviews.map((r, i) => (
            <Reveal key={r.author + i} delay={(i % 3) * 90}>
              <figure className="flex h-full flex-col rounded-[6px] border border-forest-900/10 bg-cream-50 p-7">
                <Stars />
                <blockquote className="mt-4 flex-1 font-body text-sm leading-relaxed text-forest-700/90">
                  „{r.text}"
                </blockquote>
                <figcaption className="mt-5 font-body text-sm">
                  <span className="font-semibold text-forest-900">{r.author}</span>
                  <span className="text-forest-700/60"> · {fmtNum(r.date, locale)}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
