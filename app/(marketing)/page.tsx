import { Hero } from "@/components/sections/Hero";
import { ApartmentsShowcase } from "@/components/sections/ApartmentsShowcase";
import { Surroundings } from "@/components/sections/Surroundings";
import { SchwarzwaldFact } from "@/components/sections/SchwarzwaldFact";
import { FactDecor } from "@/components/sections/FactDecor";
import { GiftVoucher } from "@/components/sections/GiftVoucher";
import { ApartmentsPreview } from "@/components/sections/ApartmentsPreview";
import { RegionMap } from "@/components/sections/RegionMap";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ApartmentsShowcase />
      <Surroundings />
      <SchwarzwaldFact
        factKey="fact1"
        showEyebrow
        tone="light"
        decor={<FactDecor variant="hutUhr" />}
      />
      <GiftVoucher />
      <ApartmentsPreview />
      <SchwarzwaldFact
        factKey="fact2"
        tone="light"
        decor={<FactDecor variant="schinkenTorte" />}
      />
      <RegionMap />
    </>
  );
}
