import type { Metadata } from "next";
import { getLocale, getStrings } from "@/lib/i18n/server";
import { localeHref } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_NAME } from "@/lib/seo/config";
import { EventLocationView } from "@/components/sections/event/EventLocationView";

/**
 * /event-location — Teaser-Seite für die Marktstraße 25 als Event-Location.
 *
 * Bewusst INDEXIERBAR (kein noindex): noindex nutzt dieses Projekt nur für
 * rein transaktionale Strecken (Newsletter-Bestätigung/-Abmeldung, Buchung).
 * Diese Seite hat echten Inhalt plus Anfrage-Funktion und soll für Suchen wie
 * „Eventlocation Neuenbürg" früh ranken — gerade WEIL Bilder und Preise erst
 * noch kommen, zählt jeder Tag Index-Vorlauf.
 */
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getStrings();
  return buildMetadata({
    path: "/event-location",
    locale,
    title: t.eventLocation.page.seoTitle,
    description: t.eventLocation.page.seoDescription,
    images: ["/images/wohnungen/raccoon-house/01.webp"],
  });
}

export default async function EventLocationPage() {
  const locale = await getLocale();
  const t = await getStrings();
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: SITE_NAME, path: localeHref("/", locale) },
          { name: t.eventLocation.page.seoTitle, path: localeHref("/event-location", locale) },
        ])}
      />
      <EventLocationView />
    </>
  );
}
