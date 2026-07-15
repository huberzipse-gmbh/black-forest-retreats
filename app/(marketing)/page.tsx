import type { Metadata } from "next";
import { getLocale, getStrings } from "@/lib/i18n/server";
import { buildMetadata } from "@/lib/seo/metadata";
import { HomeExperience } from "@/components/sections/HomeExperience";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getStrings();
  return buildMetadata({
    path: "/",
    locale,
    title: t.hero.title,
    description: t.hero.subtitle,
  });
}

export default function HomePage() {
  return <HomeExperience />;
}
