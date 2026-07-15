import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n/server";
import { localeHref } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";
import { SITE_NAME } from "@/lib/seo/config";
import { LandingView } from "@/components/sections/landing/LandingView";

const PATH = "/anreise";

const FAQ = [
  {
    q: "Wie komme ich nach Neuenbürg?",
    a: "Mit dem Auto über die A8 (Ausfahrt Pforzheim) und weiter durch das Enztal, rund 12 Kilometer. Mit der Bahn über Pforzheim und die Enztalbahn, die direkt in Neuenbürg hält.",
  },
  {
    q: "Gibt es einen Bahnhof in Neuenbürg?",
    a: "Ja. Neuenbürg liegt an der Enztalbahn zwischen Pforzheim und Bad Wildbad. Die Bahn hält im Ort, ein Auto ist für die Anreise nicht zwingend nötig.",
  },
  {
    q: "Welcher Flughafen ist am nächsten?",
    a: "Der Flughafen Stuttgart liegt rund 55 Kilometer entfernt, der Flughafen Karlsruhe/Baden-Baden rund 50 Kilometer. Von beiden erreichst du Neuenbürg per Bahn oder Mietwagen.",
  },
  {
    q: "Kann ich den Urlaub ohne Auto verbringen?",
    a: "Ja. Über die Enztalbahn erreichst du Pforzheim und Bad Wildbad direkt. Viele Ziele im Enztal liegen an der Bahnlinie oder sind gut mit dem Rad zu erreichen.",
  },
];

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
  const schema = [
    breadcrumbSchema([
      { name: SITE_NAME, path: localeHref("/", locale) },
      { name: "Anreise", path: localeHref(PATH, locale) },
    ]),
    faqSchema(FAQ),
  ];

  return (
    <>
      <JsonLd data={schema} />
      <LandingView
        eyebrow="Lage · Anreise"
        title="Anreise nach Neuenbürg"
        lead="Neuenbürg liegt im Enztal, rund 12 Kilometer südlich von Pforzheim. Mit dem Auto über die A8 oder mit der Enztalbahn, die direkt im Ort hält."
        sections={[
          {
            heading: "Mit dem Auto",
            paragraphs: [
              "Über die A8 nimmst du die Ausfahrt Pforzheim und fährst durch das Enztal nach Süden. Nach rund 12 Kilometern bist du in Neuenbürg. Aus Richtung Karlsruhe und Stuttgart ist die Fahrt in etwa gleich unkompliziert.",
              "Parkmöglichkeiten gibt es an den Unterkünften. Die genauen Hinweise bekommst du mit der Buchungsbestätigung.",
            ],
          },
          {
            heading: "Mit der Bahn",
            paragraphs: [
              "Neuenbürg liegt an der Enztalbahn zwischen Pforzheim und Bad Wildbad. Ab Pforzheim, das gut an den Fernverkehr angebunden ist, bringt dich die Bahn direkt in den Ort.",
              "Damit ist auch ein Urlaub ohne eigenes Auto gut möglich. Viele Ziele im Tal liegen an der Bahnlinie oder sind mit dem Rad erreichbar.",
            ],
          },
        ]}
        facts={{
          heading: "Entfernungen ab Neuenbürg",
          items: [
            { label: "Pforzheim", value: "rund 12 km" },
            { label: "A8, Ausfahrt Pforzheim", value: "rund 12 km" },
            { label: "Karlsruhe", value: "rund 35 km" },
            { label: "Flughafen Karlsruhe/Baden-Baden", value: "rund 50 km" },
            { label: "Stuttgart", value: "rund 50 km" },
            { label: "Flughafen Stuttgart", value: "rund 55 km" },
          ],
        }}
        quote="Zwölf Kilometer hinter Pforzheim wird es ruhig."
        faq={FAQ}
        faqTitle="Anreise und Lage: häufige Fragen"
        ctaEyebrow="Die Unterkünfte"
        ctaTitle="Bereit für den Schwarzwald"
        ctaText="Du weißt jetzt, wie du herkommst. Fehlt nur noch die passende Wohnung für deine Auszeit."
        ctaButton="Apartments ansehen"
      />
    </>
  );
}
