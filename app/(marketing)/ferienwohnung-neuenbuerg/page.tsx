import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n/server";
import { localeHref } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema, touristDestinationSchema } from "@/lib/seo/schema";
import { SITE_NAME } from "@/lib/seo/config";
import { LandingView } from "@/components/sections/landing/LandingView";

const PATH = "/ferienwohnung-neuenbuerg";

const FAQ = [
  {
    q: "Wo genau liegen die Ferienwohnungen?",
    a: "In Neuenbürg im Enzkreis, im nördlichen Schwarzwald, rund 12 Kilometer südlich von Pforzheim. Zwei Apartments liegen zentral im Ort, weitere Häuser im näheren Umland.",
  },
  {
    q: "Wie viele Personen haben Platz?",
    a: "Die beiden zentralen Apartments beherbergen jeweils bis zu vier Gäste. Für größere Gruppen und Familien gibt es zusätzliche Häuser im Umland.",
  },
  {
    q: "Kann ich direkt beim Gastgeber buchen?",
    a: "Ja. Du buchst ohne Zwischenportal direkt bei uns, zum besten Preis und mit persönlichem Kontakt vor Ort.",
  },
  {
    q: "Liegt Neuenbürg im Nationalpark Schwarzwald?",
    a: "Nein. Neuenbürg liegt im Naturpark Schwarzwald Mitte/Nord. Der Nationalpark Schwarzwald beginnt weiter südlich und ist in rund einer Stunde mit dem Auto erreichbar.",
  },
  {
    q: "Komme ich ohne Auto nach Neuenbürg?",
    a: "Ja. Neuenbürg liegt an der Enztalbahn zwischen Pforzheim und Bad Wildbad und ist direkt mit der Bahn erreichbar.",
  },
];

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
  const schema = [
    breadcrumbSchema([
      { name: SITE_NAME, path: localeHref("/", locale) },
      { name: "Ferienwohnung Neuenbürg", path: localeHref(PATH, locale) },
    ]),
    faqSchema(FAQ),
    touristDestinationSchema(
      "Neuenbürg im Nordschwarzwald",
      "Fachwerkstädtchen an der Enz im Naturpark Schwarzwald Mitte/Nord, Ausgangspunkt für Wandern, Thermen und Ausflüge.",
      ["Schloss Neuenbürg", "Besucherbergwerk Frischglück", "Eyachtal", "Enztal"],
    ),
  ];

  return (
    <>
      <JsonLd data={schema} />
      <LandingView
        eyebrow="Nordschwarzwald · Enzkreis"
        title="Ferienwohnung in Neuenbürg"
        lead="Stilvolle Apartments mitten in Neuenbürg, dazu weitere Häuser im Umland. Direkt beim Gastgeber gebucht, ohne Portal, mit dem Schlossberg vor der Tür."
        sections={[
          {
            heading: "Neuenbürg: Fachwerk, Schlossberg und die Enz",
            paragraphs: [
              "Neuenbürg ist ein kleines Fachwerkstädtchen im Enzkreis, dort wo die Enz eine enge Schleife um den Schlossberg zieht. Über der Altstadt thront das Schloss Neuenbürg, im Berg darunter lässt sich im Besucherbergwerk Frischglück die alte Bergbaugeschichte erwandern.",
              "Der Ort liegt im Naturpark Schwarzwald Mitte/Nord und ist ruhig, ohne abgelegen zu sein. Wald, Fluss und Wanderwege beginnen direkt am Ortsrand, Pforzheim und die Autobahn sind trotzdem in wenigen Minuten erreichbar.",
            ],
          },
          {
            heading: "Ruhe, ohne auf die Umgebung zu verzichten",
            paragraphs: [
              "Wer eine Ferienwohnung in Neuenbürg sucht, will meist beides: die Stille des Nordschwarzwalds und kurze Wege zu Thermen, Baumwipfelpfad und guter Küche. Genau dafür ist die Lage gemacht.",
              "Vom Ort aus erreichst du das Enztal, das Eyachtal und Bad Wildbad in kurzer Zeit. Abends bist du wieder zurück in einer Wohnung, die eher an ein Zuhause erinnert als an eine Unterkunft.",
            ],
          },
        ]}
        facts={{
          heading: "Entfernungen ab Neuenbürg",
          items: [
            { label: "Pforzheim", value: "rund 12 km" },
            { label: "Bad Wildbad", value: "rund 15 km" },
            { label: "Baumwipfelpfad Bad Wildbad", value: "rund 18 km" },
            { label: "Karlsruhe", value: "rund 35 km" },
            { label: "Stuttgart", value: "rund 50 km" },
            { label: "Bahnhof Neuenbürg (Enztalbahn)", value: "im Ort" },
          ],
        }}
        quote="Ankommen, wo der Schwarzwald noch leise ist."
        placeIds={[
          "schloss-neuenbuerg",
          "bergwerk-neuenburg",
          "eyachtal",
          "benders-birkenfeld",
          "freibad",
          "minigolf",
        ]}
        placesEyebrow="Vor der Tür"
        placesTitle="Was in Neuenbürg auf dich wartet"
        placesText="Von der Burg über dem Ort bis zum stillen Flusstal, vieles liegt in Geh- oder Radweite."
        faq={FAQ}
        faqTitle="Ferienwohnung Neuenbürg: häufige Fragen"
        ctaEyebrow="Die Unterkünfte"
        ctaTitle="Sieh dir die Apartments an"
        ctaText="Zwei Apartments mitten in Neuenbürg und weitere Häuser im Umland. Alle Details, Fotos und die Direktbuchung findest du auf der Übersicht."
        ctaButton="Apartments ansehen"
      />
    </>
  );
}
