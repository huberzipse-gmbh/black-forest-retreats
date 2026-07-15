import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n/server";
import { localeHref } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema, touristDestinationSchema } from "@/lib/seo/schema";
import { SITE_NAME } from "@/lib/seo/config";
import { LandingView } from "@/components/sections/landing/LandingView";

const PATH = "/urlaub-enztal";

const FAQ = [
  {
    q: "Wo liegt das Enztal?",
    a: "Das Enztal zieht sich durch den nördlichen Schwarzwald, von Bad Wildbad über Höfen an der Enz und Neuenbürg bis nach Pforzheim. Neuenbürg liegt mittendrin, an einer engen Flussschleife um den Schlossberg.",
  },
  {
    q: "Welche Orte liegen in der Nähe?",
    a: "Direkte Nachbarn sind Birkenfeld, Straubenhardt, Höfen an der Enz, Engelsbrand und Keltern, alle wenige Kilometer entfernt. Bad Wildbad, Schömberg und Dobel liegen im weiteren Umkreis.",
  },
  {
    q: "Was kann man im Enztal machen?",
    a: "Wandern und Radfahren entlang der Enz, der Enztalradweg führt durch das Tal. Dazu Thermen in Bad Wildbad, der Baumwipfelpfad, Bergbaugeschichte in Neuenbürg und ruhige Seitentäler wie das Eyachtal.",
  },
  {
    q: "Ist das Enztal auch bei Regen einen Besuch wert?",
    a: "Ja. Die Thermen in Bad Wildbad und Bad Teinach, das Besucherbergwerk in Neuenbürg und das Schloss über der Stadt sind vom Wetter unabhängig.",
  },
];

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
  const schema = [
    breadcrumbSchema([
      { name: SITE_NAME, path: localeHref("/", locale) },
      { name: "Urlaub im Enztal", path: localeHref(PATH, locale) },
    ]),
    faqSchema(FAQ),
    touristDestinationSchema(
      "Enztal im Nordschwarzwald",
      "Flusstal der Enz zwischen Pforzheim und Bad Wildbad, mit Neuenbürg, Höfen, Birkenfeld und Straubenhardt, im Naturpark Schwarzwald Mitte/Nord.",
      ["Enztalradweg", "Eyachtal", "Bad Wildbad", "Höfen an der Enz"],
    ),
  ];

  return (
    <>
      <JsonLd data={schema} />
      <LandingView
        eyebrow="Nordschwarzwald · Enztal"
        title="Urlaub im Enztal"
        lead="Das Enztal ist ruhiger Schwarzwald zwischen Pforzheim und Bad Wildbad. Neuenbürg liegt mittendrin, ein guter Ausgangspunkt für Tal, Höhen und Nachbarorte."
        sections={[
          {
            heading: "Ein Tal, viele kurze Wege",
            paragraphs: [
              "Die Enz fließt aus dem Hochschwarzwald bei Bad Wildbad nordwärts nach Pforzheim. Auf dem Weg reihen sich Höfen an der Enz, Neuenbürg und die Nachbargemeinden Birkenfeld, Straubenhardt, Engelsbrand und Keltern aneinander, alle nur wenige Kilometer voneinander entfernt.",
              "Von einer Ferienwohnung in Neuenbürg aus bist du schnell überall: im Tal am Fluss, oben auf den Höhen bei Dobel und Schömberg, oder in wenigen Minuten in Bad Wildbad.",
            ],
          },
          {
            heading: "Draußen unterwegs, mit oder ohne Höhenmeter",
            paragraphs: [
              "Der Enztalradweg begleitet den Fluss durch das ganze Tal, überwiegend flach und familientauglich. Wer lieber wandert, findet im Eyachtal, rund um den Schlossberg und in den Seitentälern ruhige Wege abseits der bekannten Routen.",
              "Nach dem Tag draußen locken regionale Küche in den Nachbarorten und die Thermen von Bad Wildbad. Vieles davon liegt keine Viertelstunde entfernt.",
            ],
          },
        ]}
        facts={{
          heading: "Nachbarorte ab Neuenbürg",
          items: [
            { label: "Birkenfeld", value: "rund 5 km" },
            { label: "Straubenhardt", value: "rund 6 km" },
            { label: "Höfen an der Enz", value: "rund 6 km" },
            { label: "Engelsbrand", value: "rund 7 km" },
            { label: "Bad Wildbad", value: "rund 15 km" },
            { label: "Dobel", value: "rund 12 km" },
          ],
        }}
        quote="Die Enz gibt das Tempo vor, und das ist ein angenehmes."
        placeIds={[
          "eyachtal",
          "cafe-blaich",
          "kajak-enz",
          "fliegenfischen",
          "forellenzucht-zordel",
          "benders-birkenfeld",
        ]}
        placesEyebrow="Im Tal"
        placesTitle="Enztal und Umgebung"
        placesText="Vom stillen Eyachtal bis zur Kajaktour auf der Enz, das Tal lässt sich auf viele Arten erleben."
        faq={FAQ}
        faqTitle="Urlaub im Enztal: häufige Fragen"
        ctaEyebrow="Die Unterkünfte"
        ctaTitle="Dein Quartier im Enztal"
        ctaText="Neuenbürg ist der ruhige Mittelpunkt des Tals. Von hier erreichst du Fluss, Höhen und Nachbarorte in kurzer Zeit."
        ctaButton="Apartments ansehen"
      />
    </>
  );
}
