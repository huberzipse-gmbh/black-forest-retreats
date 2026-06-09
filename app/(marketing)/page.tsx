import { Hero } from "@/components/sections/Hero";
import { ApartmentsShowcase } from "@/components/sections/ApartmentsShowcase";
import { Surroundings } from "@/components/sections/Surroundings";
import { SchwarzwaldFact } from "@/components/sections/SchwarzwaldFact";
import { FactDecor } from "@/components/sections/FactDecor";
import { GiftVoucher } from "@/components/sections/GiftVoucher";
import { ApartmentsPreview } from "@/components/sections/ApartmentsPreview";
import { ForestSilhouette } from "@/components/sections/ForestSilhouette";
import { useStrings } from "@/lib/i18n/useStrings";

export default function HomePage() {
  const t = useStrings();

  return (
    <>
      <Hero />
      <ApartmentsShowcase />
      <Surroundings />
      <SchwarzwaldFact
        quote={t.facts.fact1.quote}
        source={t.facts.fact1.source}
        eyebrow={t.facts.eyebrow}
        tone="light"
        decor={<FactDecor variant="hutUhr" />}
      />
      <GiftVoucher />
      <ApartmentsPreview />
      <SchwarzwaldFact
        quote={t.facts.fact2.quote}
        source={t.facts.fact2.source}
        tone="light"
        tightBottom
        decor={<FactDecor variant="schinkenTorte" />}
      />
      <ForestSilhouette />
    </>
  );
}
