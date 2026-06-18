"use client";

import Image from "next/image";
import { Type } from "@/components/ui/Type";
import { Chip } from "@/components/ui/Chip";
import { GradientPanel } from "@/components/ui/GradientPanel";
import { PlaceIcon } from "@/components/sections/umgebung/PlaceIcons";
import { bandOf, type Place } from "@/data/surroundings";
import { useLocale, useStrings } from "@/lib/i18n/I18nProvider";
import { fmtNum } from "@/lib/i18n/format";

const StarIcon = ({ className = "h-3 w-3 text-brass-300" }: { className?: string }) => (
  <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.5 14.85 8.6l6.65.75-4.9 4.55 1.3 6.55L12 17.6 6.1 20.45l1.3-6.55L2.5 9.35 9.15 8.6z" />
  </svg>
);

/** Eine Karte für einen Ort/ein Erlebnis. Bild-Mockup oder Icon-geführt. */
export function PlaceCard({ place }: { place: Place }) {
  const s = useStrings().surroundings.card;
  const locale = useLocale();
  const isDay = bandOf(place.distanceKm) === "day";
  const isIcon = Boolean(place.icon);
  const hasImage = Boolean(place.image);
  const isRecommended = Boolean(place.recommended);
  const meta = [place.town, `${fmtNum(place.distanceKm, locale)} km`]
    .filter(Boolean)
    .join(" · ");

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-[6px] bg-cream-50/[0.03] transition-all duration-500 hover:-translate-y-1.5 ${
        isRecommended
          ? "border border-brass-400/70 shadow-[0_0_0_1px_rgba(193,150,80,0.30),0_20px_45px_-26px_rgba(193,150,80,0.55)] hover:border-brass-300"
          : "border border-cream-50/10 hover:border-brass-400/40"
      }`}
    >
      {/* Medien-/Icon-Bereich */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {hasImage ? (
          <Image
            src={place.image!}
            alt={place.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <GradientPanel
            variant={place.variant}
            pattern
            monogram={isIcon ? undefined : place.monogram}
            zoomOnHover={!isIcon}
            className="absolute inset-0"
          >
            {isIcon && place.icon && (
              <div className="flex h-full items-center justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-brass-300/50 bg-night/30 text-brass-300 transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-110">
                  <PlaceIcon name={place.icon} className="h-8 w-8" />
                </span>
              </div>
            )}
          </GradientPanel>
        )}

        {/* Lesbarkeits-Verlauf unten */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-transparent" />

        {/* Empfehlungs-Plakette: unsere klare Empfehlung der Kategorie */}
        {isRecommended && (
          <span className="absolute start-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-brass-400 px-3 py-1 font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-night shadow-[0_4px_14px_-4px_rgba(0,0,0,0.5)]">
            <StarIcon className="h-3 w-3 text-night" />
            {s.recommended}
          </span>
        )}

        {/* Aktivitäts-Icon als kleine Plakette auf dem Foto (Erlebnisse) */}
        {hasImage && place.icon && !isRecommended && (
          <span className="absolute start-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-brass-300/50 bg-night/45 text-brass-300 backdrop-blur-sm transition-transform duration-500 ease-out group-hover:scale-110">
            <PlaceIcon name={place.icon} className="h-[18px] w-[18px]" />
          </span>
        )}

        {/* Michelin-Badge */}
        {place.michelin && (
          <span className="absolute end-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-brass-300/60 bg-night/45 px-3 py-1 font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-brass-300 backdrop-blur-sm">
            <StarIcon />
            {s.michelin}
          </span>
        )}

        {/* Tagesausflug-Badge */}
        {isDay && (
          <span className="absolute start-3 top-3 rounded-full bg-night/55 px-3 py-1 font-body text-[11px] font-medium uppercase tracking-[0.14em] text-cream-100/90 backdrop-blur-sm">
            {s.dayTrip}
          </span>
        )}

        {/* Dezente Foto-Quellenangabe (urheberrechtskonform) */}
        {hasImage && place.imageCredit && (
          <span className="pointer-events-none absolute bottom-1.5 end-2 font-body text-[9px] tracking-wide text-cream-50/45 [text-shadow:_0_1px_2px_rgba(0,0,0,0.55)]">
            {s.photo} {place.imageCredit}
          </span>
        )}
      </div>

      {/* Textkörper */}
      <div className="flex flex-1 flex-col p-6">
        {meta && (
          <Type role="eyebrow" className="text-brass-300/90">
            {meta}
          </Type>
        )}
        <Type role="h3" as="h3" className="mt-3 text-cream-50">
          {place.name}
        </Type>
        <p className="mt-2.5 font-body text-sm leading-relaxed text-cream-100/75">
          {place.blurb}
        </p>

        {place.features.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {place.features.map((f) => (
              <Chip key={f} tone={place.michelin ? "brass" : "light"}>
                {f}
              </Chip>
            ))}
          </div>
        )}

        {place.tbd && (
          <p className="mt-4 font-body text-xs italic text-cream-100/45">
            {s.soon}
          </p>
        )}

        {/* Akzent-Unterstrich (wächst bei Hover) */}
        <span className="mt-5 h-px w-8 bg-brass-400 transition-all duration-500 group-hover:w-16" />
      </div>
    </article>
  );
}
