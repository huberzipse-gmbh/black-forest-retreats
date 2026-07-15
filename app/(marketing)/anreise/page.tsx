import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n/server";
import { localeHref } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_NAME } from "@/lib/seo/config";
import { HomeExperience } from "@/components/sections/HomeExperience";

const PATH = "/anreise";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: PATH,
    locale: await getLocale(),
    germanOnly: true,
    title: "Anreise nach Neuenbürg im Schwarzwald",
    description:
      "Anreise nach Neuenbürg im Enzkreis: mit Auto über die A8 und das Enztal oder mit der Enztalbahn ab Pforzheim. Entfernungen zu Stuttgart, Karlsruhe und den Flughäfen.",
  });
}

export default async function AnreisePage() {
  const locale = await getLocale();
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: SITE_NAME, path: localeHref("/", locale) },
          { name: "Anreise", path: localeHref(PATH, locale) },
        ])}
      />
      <HomeExperience heroHeading="Anreise nach Neuenbürg" />
    </>
  );
}
