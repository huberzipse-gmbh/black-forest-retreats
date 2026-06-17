import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORY_ORDER, isCategoryKey } from "@/data/surroundings";
import { getStrings } from "@/lib/i18n/server";
import { CategoryDetailView } from "@/components/sections/umgebung/CategoryDetailView";

export function generateStaticParams() {
  return CATEGORY_ORDER.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = await getStrings();
  const cat = isCategoryKey(slug) ? t.surroundings.categories[slug] : null;
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

  return <CategoryDetailView slug={slug} />;
}
