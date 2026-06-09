"use client";

import { useRef } from "react";
import { retreats } from "@/data/retreats";
import { useStrings } from "@/lib/i18n/useStrings";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { GradientPanel, type GradientVariant } from "@/components/ui/GradientPanel";
import { ApartmentCard } from "./ApartmentCard";

const TEASERS: GradientVariant[] = ["moss", "night", "bark"];

export function ApartmentsShowcase() {
  const t = useStrings();
  const scroller = useRef<HTMLDivElement>(null);

  const scrollByCards = (dir: number) => {
    scroller.current?.scrollBy({ left: dir * 364, behavior: "smooth" });
  };

  const arrowClass =
    "flex h-12 w-12 items-center justify-center rounded-full border border-forest-900/20 font-display text-xl text-forest-900 transition-colors hover:border-forest-900 hover:bg-forest-900 hover:text-cream-50";

  return (
    <section id="apartments" className="bg-cream-100 px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionIntro
            eyebrow={t.apartments.eyebrow}
            title={t.apartments.title}
            text={t.apartments.text}
            align="left"
            tone="dark"
          />
          <div className="hidden shrink-0 gap-3 md:flex">
            <button
              type="button"
              aria-label={t.apartments.prev}
              onClick={() => scrollByCards(-1)}
              className={arrowClass}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label={t.apartments.next}
              onClick={() => scrollByCards(1)}
              className={arrowClass}
            >
              ›
            </button>
          </div>
        </div>

        <div
          ref={scroller}
          className="mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {retreats.map((r) => (
            <ApartmentCard
              key={r.id}
              retreat={r}
              ctaLabel={t.apartments.cta}
              exclusiveLabel={t.apartments.exclusive}
            />
          ))}

          {/* Verschwommene Teaser — weitere Wohnungen in Kürze */}
          {TEASERS.map((g, i) => (
            <div
              key={`soon-${i}`}
              aria-hidden
              className="relative h-[470px] w-[80vw] max-w-[340px] shrink-0 snap-start overflow-hidden rounded-[4px] sm:w-[340px]"
            >
              <GradientPanel
                variant={g}
                className="absolute inset-0 scale-110 blur-[7px]"
              />
              <div className="absolute inset-0 bg-night/45" />
              <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4 text-cream-50/85">
                <svg
                  viewBox="0 0 24 24"
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="5" y="11" width="14" height="9" rx="2" />
                  <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                </svg>
                <span className="font-body text-xs font-semibold uppercase tracking-[0.22em]">
                  {t.apartments.comingSoon}
                </span>
              </div>
            </div>
          ))}

          {/* rechter Innenabstand am Ende des Scrollers */}
          <div aria-hidden className="w-2 shrink-0 sm:w-6" />
        </div>
      </div>
    </section>
  );
}
