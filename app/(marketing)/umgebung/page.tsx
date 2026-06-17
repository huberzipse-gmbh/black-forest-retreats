import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  CATEGORY_ORDER,
  highlightPlaces,
  type SurroundingCategoryKey,
} from "@/data/surroundings";
import { de } from "@/lib/strings/de";
import { Type } from "@/components/ui/Type";
import { Reveal } from "@/components/ui/Reveal";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { PlaceCard } from "@/components/sections/umgebung/PlaceCard";

const IMAGE: Record<SurroundingCategoryKey, string> = {
  restaurants: "restaurants-v3.jpg",
  experiences: "experiences-v3.jpg",
  nature: "nature-v3.jpg",
  culture: "culture-v3.jpg",
  wellness: "wellness-v3.webp",
  regional: "regional-v3.jpg",
};

export const metadata: Metadata = {
  title: "Umgebung · Black Forest Retreats",
  description: de.surroundings.hub.text,
};

export default function UmgebungHubPage() {
  const t = de.surroundings;
  const highlights = highlightPlaces().slice(0, 6);

  return (
    <article className="bg-night text-cream-50">
      {/* Intro */}
      <section className="px-6 pt-32 pb-12 md:px-10 md:pt-40 md:pb-16">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            eyebrow={t.hub.eyebrow}
            title={t.hub.title}
            text={t.hub.text}
            align="center"
            tone="light"
          />
        </div>
      </section>

      {/* Kategorie-Kacheln */}
      <section className="px-6 pb-24 md:px-10 md:pb-28">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORY_ORDER.map((key, i) => {
            const cat = t.categories[key];
            return (
              <Reveal key={key} delay={(i % 3) * 90}>
                <Link
                  href={`/umgebung/${key}`}
                  className="group relative block h-[360px] overflow-hidden rounded-[6px]"
                >
                  <Image
                    src={`/images/umgebung/${IMAGE[key]}`}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night/95 via-night/45 to-night/5 transition-opacity duration-500 group-hover:from-night/90" />
                  <div className="absolute inset-x-0 bottom-0 z-10 p-7">
                    <Type role="h3" className="text-cream-50">
                      {cat.title}
                    </Type>
                    <p className="mt-2 max-w-[40ch] font-body text-sm leading-relaxed text-cream-100/80">
                      {cat.text}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.18em] text-brass-300">
                      {t.discover}
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        &rarr;
                      </span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Highlights (kategorieübergreifend) */}
      <section className="border-t border-cream-50/10 px-6 py-24 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Type role="eyebrow" className="text-center text-brass-300">
            {t.hub.highlights}
          </Type>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 90}>
                <PlaceCard place={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
