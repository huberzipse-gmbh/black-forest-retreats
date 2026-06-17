import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CATEGORY_ORDER,
  placesByCategory,
  isCategoryKey,
} from "@/data/surroundings";
import { de } from "@/lib/strings/de";
import { Type } from "@/components/ui/Type";
import { CategoryGrid } from "@/components/sections/umgebung/CategoryGrid";

export function generateStaticParams() {
  return CATEGORY_ORDER.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = isCategoryKey(slug) ? de.surroundings.categories[slug] : null;
  return {
    title: cat
      ? `${cat.title} · Black Forest Retreats`
      : "Umgebung · Black Forest Retreats",
    description: cat?.text,
  };
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isCategoryKey(slug)) notFound();

  const cat = de.surroundings.categories[slug];
  const places = placesByCategory(slug);

  return (
    <article className="bg-night text-cream-50">
      {/* Kopf */}
      <section className="px-6 pt-32 pb-14 md:px-10 md:pt-40 md:pb-18">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/umgebung"
            className="inline-flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.18em] text-cream-100/70 transition-colors hover:text-cream-50"
          >
            &larr; {de.surroundings.detail.back}
          </Link>

          <div className="mt-10 max-w-2xl">
            <Type role="eyebrow" className="text-brass-300">
              {de.surroundings.detail.kicker}
            </Type>
            <Type role="display" as="h1" className="mt-4 text-cream-50">
              {cat.title}
            </Type>
            <div className="mt-7 h-px w-14 bg-brass-400" />
            <Type role="lead" className="mt-7 text-cream-100/80">
              {cat.text}
            </Type>
          </div>
        </div>
      </section>

      {/* Filter + Karten */}
      <section className="px-6 pb-28 md:px-10 md:pb-36">
        <div className="mx-auto max-w-7xl">
          <CategoryGrid places={places} />
        </div>
      </section>
    </article>
  );
}
