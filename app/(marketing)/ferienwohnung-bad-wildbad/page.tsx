import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n/server";
import { localeHref } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_NAME } from "@/lib/seo/config";
import { HomeExperience } from "@/components/sections/HomeExperience";

const PATH = "/ferienwohnung-bad-wildbad";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: PATH,
    locale: await getLocale(),
    germanOnly: true,
    title: "Ferienwohnung nahe Bad Wildbad und Baumwipfelpfad",
    description:
      "Ferienwohnungen in Neuenbürg, rund 15 km von Bad Wildbad. Baumwipfelpfad, Palais Thermal und Sommerberg in kurzer Fahrt, ruhig gelegen im Enztal.",
  });
}

export default async function FerienwohnungBadWildbadPage() {
  const locale = await getLocale();
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: SITE_NAME, path: localeHref("/", locale) },
          { name: "Nahe Bad Wildbad", path: localeHref(PATH, locale) },
        ])}
      />
      <HomeExperience heroHeading="Ferienwohnung nahe Bad Wildbad" />
    </>
  );
}
