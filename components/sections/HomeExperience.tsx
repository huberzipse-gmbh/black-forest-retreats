import { Hero } from "@/components/sections/Hero";
import { ApartmentsShowcase } from "@/components/sections/ApartmentsShowcase";
import { FloatingSauna } from "@/components/sections/FloatingSauna";
import { Surroundings } from "@/components/sections/Surroundings";
import { SchwarzwaldFact } from "@/components/sections/SchwarzwaldFact";
import { FactDecor } from "@/components/sections/FactDecor";
import { GiftVoucher } from "@/components/sections/GiftVoucher";
import { ApartmentsPreview } from "@/components/sections/ApartmentsPreview";
import { RegionMap } from "@/components/sections/RegionMap";
import { ContactForm } from "@/components/sections/ContactForm";
import { PromoBanner } from "@/components/sections/PromoBanner";
import { getStrings } from "@/lib/i18n/server";
import { getRetreatCards } from "@/lib/retreats/db";
import { getPromoBannerData } from "@/lib/booking/promoBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  organizationSchema,
  websiteSchema,
  touristDestinationSchema,
} from "@/lib/seo/schema";

/**
 * Der komplette Inhalt der Startseite als wiederverwendbarer Baustein.
 *
 * Startseite UND die lokalen Landingpages rendern exakt diese Sektionen -
 * visuell identisch. Der EINZIGE Unterschied einer Landingpage ist die
 * personalisierte H1-Überschrift im Hero-Bereich (`heroHeading`) sowie der
 * separat je Seite gesetzte Meta-Titel. Alles andere bleibt eins zu eins gleich.
 *
 * Das H1 ist bewusst `sr-only`: der Hero zeigt nur ein Video ohne Text, die
 * Zeile bleibt also unsichtbar, gibt der Seite aber eine eindeutige, für Ort
 * und Suchmaschine sprechende Überschrift.
 */
export async function HomeExperience({ heroHeading }: { heroHeading?: string }) {
  const t = await getStrings();
  const retreats = await getRetreatCards(t);
  const promo = await getPromoBannerData();

  const schema = [
    organizationSchema(),
    websiteSchema(),
    touristDestinationSchema(
      t.hero.eyebrow,
      t.hero.subtitle,
      // Ehrliche Standort-Zuordnung: Neuenbürg liegt im Naturpark Schwarzwald
      // Mitte/Nord. Der Nationalpark ist ~1 Std. entfernt und damit KEIN
      // Standort-Merkmal - bewusst nicht als Attraktion gelistet.
      [
        "Naturpark Schwarzwald Mitte/Nord",
        "Schloss Neuenbürg",
        "Baumwipfelpfad Bad Wildbad",
        "Palais Thermal Bad Wildbad",
        "Enztal",
      ],
    ),
  ];

  return (
    <>
      <JsonLd data={schema} />
      {/* Screenreader/SEO-H1: der Hero zeigt nur ein Video, ohne diese Zeile
          hätte die Seite kein H1. Visuell nicht sichtbar. Auf Landingpages
          personalisiert (z. B. "Ferienwohnung in Neuenbürg"). */}
      <h1 className="sr-only">{heroHeading ?? t.hero.title}</h1>
      {promo && <PromoBanner code={promo.code} percent={promo.percent} />}
      <Hero />
      <ApartmentsShowcase retreats={retreats} />
      <FloatingSauna />
      <Surroundings />
      <SchwarzwaldFact
        factKey="fact1"
        showEyebrow
        tone="light"
        decor={<FactDecor variant="hutUhr" />}
      />
      <GiftVoucher />
      <ApartmentsPreview />
      <SchwarzwaldFact factKey="fact2" bgImage="/images/elemente/mischwald.jpg" nowrapFirst />
      <ContactForm />
      <RegionMap />
    </>
  );
}
