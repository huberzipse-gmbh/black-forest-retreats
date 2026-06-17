"use client";

import { useRef } from "react";
import { retreats } from "@/data/retreats";
import { useStrings } from "@/lib/i18n/useStrings";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { ApartmentCard } from "./ApartmentCard";

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
              soldOutLabel={t.apartments.soldOut.badge}
              soldOutUntilLabel={
                r.soldOut && r.soldOutUntil
                  ? t.apartments.soldOut.until(r.soldOutUntil)
                  : undefined
              }
            />
          ))}

          {/* rechter Innenabstand am Ende des Scrollers */}
          <div aria-hidden className="w-2 shrink-0 sm:w-6" />
        </div>
      </div>
    </section>
  );
}
