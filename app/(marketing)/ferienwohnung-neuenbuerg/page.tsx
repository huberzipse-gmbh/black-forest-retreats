import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n/server";
import { localeHref } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_NAME } from "@/lib/seo/config";
import { HomeExperience } from "@/components/sections/HomeExperience";

const PATH = "/ferienwohnung-neuenbuerg";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: PATH,
    locale: await getLocale(),
    germanOnly: true,
    title: "Ferienwohnung Neuenbürg im Nordschwarzwald",
    description:
      "Stilvolle Ferienwohnungen in Neuenbürg im Enzkreis, direkt beim Gastgeber gebucht. Zentral im nördlichen Schwarzwald, Schlossberg und Enztal vor der Tür.",
  });
}

export default async function FerienwohnungNeuenbuergPage() {
  const locale = await getLocale();
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: SITE_NAME, path: localeHref("/", locale) },
          { name: "Ferienwohnung Neuenbürg", path: localeHref(PATH, locale) },
        ])}
      />
      <HomeExperience heroHeading="Ferienwohnung in Neuenbürg" />
    </>
  );
}
