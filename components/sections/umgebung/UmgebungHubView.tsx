"use client";

import {
  CATEGORY_ORDER,
  recommendedPlaces,
  placesByCategory,
  type SurroundingCategoryKey,
} from "@/data/surroundings";
import { useStrings } from "@/lib/i18n/useStrings";
import { Type } from "@/components/ui/Type";
import { Reveal } from "@/components/ui/Reveal";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { PlaceCard } from "@/components/sections/umgebung/PlaceCard";
import {
  CategoryAccordion,
  type AccordionCategory,
} from "@/components/sections/umgebung/CategoryAccordion";

const IMAGE: Record<SurroundingCategoryKey, string> = {
  restaurants: "restaurants-v3.jpg",
  experiences: "experiences-v3.jpg",
  nature: "nature-v3.jpg",
  culture: "culture-v3.jpg",
  wellness: "wellness-v3.webp",
  regional: "regional-v3.jpg",
};

export function UmgebungHubView() {
  const strings = useStrings();
  const t = strings.surroundings;
  const recommended = recommendedPlaces(strings);

  const categories: AccordionCategory[] = CATEGORY_ORDER.map((key) => ({
    key,
    title: t.categories[key].title,
    text: t.categories[key].text,
    image: `/images/umgebung/${IMAGE[key]}`,
    places: placesByCategory(key, strings),
  }));

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

      {/* Beliebt bei unseren Gästen — unsere Empfehlungen, hervorgehoben */}
      <section className="px-6 pb-8 md:px-10 md:pb-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <Type role="eyebrow" className="text-brass-300">
              {t.hub.highlights}
            </Type>
            <p className="mx-auto mt-4 max-w-xl font-body text-sm leading-relaxed text-cream-100/70">
              {t.hub.highlightsText}
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 90}>
                <PlaceCard place={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Alle Kategorien — aufklappbar, je mit Klick in die volle Kategorie */}
      <section className="border-t border-cream-50/10 px-6 py-20 md:px-10 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <Type role="eyebrow" className="text-brass-300">
              {t.hub.categories}
            </Type>
            <p className="mx-auto mt-4 max-w-xl font-body text-sm leading-relaxed text-cream-100/70">
              {t.hub.categoriesText}
            </p>
          </div>
          <div className="mt-12">
            <CategoryAccordion categories={categories} />
          </div>
        </div>
      </section>
    </article>
  );
}
