import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n/server";
import { localeHref } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_NAME } from "@/lib/seo/config";
import { HomeExperience } from "@/components/sections/HomeExperience";

const PATH = "/urlaub-enztal";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: PATH,
    locale: await getLocale(),
    germanOnly: true,
    title: "Urlaub im Enztal, Nordschwarzwald",
    description:
      "Urlaub im Enztal zwischen Pforzheim und Bad Wildbad. Ferienwohnungen in Neuenbürg als Ausgangspunkt für Wandern, Radfahren, Thermen und die Nachbarorte im Nordschwarzwald.",
  });
}

export default async function UrlaubEnztalPage() {
  const locale = await getLocale();
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: SITE_NAME, path: localeHref("/", locale) },
          { name: "Urlaub im Enztal", path: localeHref(PATH, locale) },
        ])}
      />
      <HomeExperience heroHeading="Urlaub im Enztal" />
    </>
  );
}
