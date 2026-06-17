import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { retreats, retreatSlugs, getLocalizedRetreat } from "@/data/retreats";
import { getStrings } from "@/lib/i18n/server";
import { RetreatDetailView } from "@/components/sections/retreat/RetreatDetailView";

export function generateStaticParams() {
  return retreatSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = await getStrings();
  const r = getLocalizedRetreat(slug, t);
  return {
    title: r
      ? `${r.name} · Black Forest Retreats`
      : "Unterkunft · Black Forest Retreats",
    description: r?.shortDescription,
  };
}

export default async function RetreatDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Existenz über die strukturellen Daten prüfen (sprachunabhängig).
  if (!retreats.some((r) => r.slug === slug)) notFound();

  return <RetreatDetailView slug={slug} />;
}
