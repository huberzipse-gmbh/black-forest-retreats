import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n/server";
import { localeHref } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema, touristDestinationSchema } from "@/lib/seo/schema";
import { SITE_NAME } from "@/lib/seo/config";
import { LandingView } from "@/components/sections/landing/LandingView";

const PATH = "/ferienwohnung-bad-wildbad";

const FAQ = [
  {
    q: "Sind die Ferienwohnungen in Bad Wildbad?",
    a: "Die Apartments liegen in Neuenbürg, rund 15 Kilometer nördlich von Bad Wildbad im selben Enztal. Bad Wildbad ist in etwa 20 Minuten mit Auto oder Enztalbahn erreichbar.",
  },
  {
    q: "Wie weit ist der Baumwipfelpfad?",
    a: "Der Baumwipfelpfad auf dem Sommerberg über Bad Wildbad ist rund 18 Kilometer entfernt, etwa eine halbe Stunde Fahrt. Zur Wildline-Hängebrücke sind es ähnlich weit.",
  },
  {
    q: "Welche Thermen gibt es in der Nähe?",
    a: "Das Palais Thermal und die Vital Therme in Bad Wildbad liegen rund 12 bis 15 Kilometer entfernt. Weitere Thermen gibt es in Bad Teinach und in Freudenstadt-Richtung.",
  },
  {
    q: "Lohnt sich die Lage für einen Wellness-Kurzurlaub?",
    a: "Ja. Du wohnst ruhig in Neuenbürg und erreichst die Thermen, den Sommerberg und die Wanderwege bei Bad Wildbad in kurzer Zeit, ohne die höheren Ortspreise im Kurort.",
  },
];

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
  const schema = [
    breadcrumbSchema([
      { name: SITE_NAME, path: localeHref("/", locale) },
      { name: "Nahe Bad Wildbad", path: localeHref(PATH, locale) },
    ]),
    faqSchema(FAQ),
    touristDestinationSchema(
      "Bad Wildbad und Sommerberg",
      "Kurort im Enztal mit Palais Thermal, Baumwipfelpfad und Wildline-Hängebrücke, rund 15 km von Neuenbürg entfernt.",
      ["Baumwipfelpfad Schwarzwald", "Wildline Hängebrücke", "Palais Thermal", "Sommerberg Bad Wildbad"],
    ),
  ];

  return (
    <>
      <JsonLd data={schema} />
      <LandingView
        eyebrow="Enztal · Nähe Bad Wildbad"
        title="Ferienwohnung nahe Bad Wildbad"
        lead="Ruhig in Neuenbürg wohnen, Thermen und Baumwipfelpfad in kurzer Fahrt. Rund 15 Kilometer trennen dich vom Kurort Bad Wildbad, ohne dessen Ortspreise."
        sections={[
          {
            heading: "Bad Wildbad, ohne mitten im Kurort zu wohnen",
            paragraphs: [
              "Bad Wildbad ist der bekannte Kurort im oberen Enztal: Palais Thermal, Vital Therme, der Sommerberg mit Baumwipfelpfad und Wildline-Hängebrücke. Schön zum Besuchen, aber im Ort wird es voll und teuer.",
              "Von Neuenbürg aus hast du alles in Reichweite und wohnst trotzdem ruhig. Rund 15 Kilometer und eine Fahrt mit Auto oder Enztalbahn trennen dich vom Trubel.",
            ],
          },
          {
            heading: "Baumwipfelpfad, Sommerberg und Thermen",
            paragraphs: [
              "Der Baumwipfelpfad führt in luftiger Höhe durch die Baumkronen über Bad Wildbad, gleich daneben spannt sich die Wildline-Hängebrücke über das Tal. Hinauf geht es bequem mit der Sommerbergbahn.",
              "Danach entspannst du im historischen Palais Thermal oder in der modernen Vital Therme. Beide liegen rund eine Viertelstunde entfernt.",
            ],
          },
        ]}
        facts={{
          heading: "Entfernungen ab Neuenbürg",
          items: [
            { label: "Palais Thermal Bad Wildbad", value: "rund 12 km" },
            { label: "Wildline Hängebrücke", value: "rund 12 km" },
            { label: "Baumwipfelpfad Sommerberg", value: "rund 18 km" },
            { label: "Siebentäler Therme Freudenstadt", value: "rund 20 km" },
            { label: "Fahrzeit Bad Wildbad", value: "rund 20 Min" },
          ],
        }}
        quote="Erst hoch über die Baumkronen, dann tief in die Therme."
        placeIds={[
          "baumwipfelpfad",
          "wildline-haengebruecke",
          "palais-thermal",
          "siebentaeler-therme",
          "gruenhuette",
          "gruenhuette-wandern",
        ]}
        placesEyebrow="Rund um Bad Wildbad"
        placesTitle="Ausflüge in Reichweite"
        placesText="Vom Baumwipfelpfad bis zur Waldgaststätte, die Höhepunkte des oberen Enztals liegen nah."
        faq={FAQ}
        faqTitle="Nahe Bad Wildbad: häufige Fragen"
        ctaEyebrow="Die Unterkünfte"
        ctaTitle="Dein ruhiges Quartier"
        ctaText="Wohne in Neuenbürg und erreiche Thermen, Baumwipfelpfad und Sommerberg in kurzer Zeit. Alle Apartments findest du auf der Übersicht."
        ctaButton="Apartments ansehen"
      />
    </>
  );
}
