import { useStrings } from "@/lib/i18n/useStrings";
import { Type } from "@/components/ui/Type";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

// Holz-Maserung als CSS-Muster (vertikale Dielen + feine Maserung + Naht-Linien).
const woodStyle = {
  backgroundColor: "#4a3322",
  backgroundImage: [
    "repeating-linear-gradient(91deg, rgba(0,0,0,0.10) 0 1px, transparent 1px 5px)",
    "repeating-linear-gradient(89deg, rgba(255,255,255,0.022) 0 1px, transparent 1px 11px)",
    "repeating-linear-gradient(90deg, rgba(0,0,0,0.32) 0 2px, transparent 2px 4px, rgba(255,255,255,0.02) 4px 5px, transparent 5px 230px)",
    "linear-gradient(180deg, #5d4029, #382616)",
  ].join(", "),
} as const;

export function GiftVoucher() {
  const t = useStrings();

  return (
    <section
      id="gutschein"
      className="relative overflow-hidden px-6 py-28 text-cream-50 md:py-36"
    >
      {/* Holz-Hintergrund */}
      <div aria-hidden className="absolute inset-0" style={woodStyle} />
      {/* Dunkler Verlauf für Lesbarkeit + Tiefe */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-night/55 via-night/35 to-night/65"
      />

      <Reveal className="relative z-10 mx-auto max-w-2xl text-center">
        <Type role="eyebrow" className="text-brass-300">
          {t.gift.eyebrow}
        </Type>
        <Type role="display" as="h2" className="mt-5 text-cream-50">
          {t.gift.title}
        </Type>
        <div className="mx-auto mt-7 h-px w-14 bg-brass-400" />
        <Type role="lead" className="mx-auto mt-7 max-w-xl text-cream-100/90">
          {t.gift.text}
        </Type>
        <div className="mt-10">
          <Button href="#" variant="outlineLight" size="md">
            {t.gift.cta}
          </Button>
        </div>
        <Type
          role="caption"
          className="mt-7 font-medium uppercase tracking-[0.18em] text-cream-100/60"
        >
          {t.gift.trust}
        </Type>
      </Reveal>
    </section>
  );
}
