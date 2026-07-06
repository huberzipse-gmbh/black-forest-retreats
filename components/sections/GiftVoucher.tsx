"use client";

import { useStrings } from "@/lib/i18n/useStrings";
import { Type } from "@/components/ui/Type";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { woodStyle } from "@/lib/theme/wood";

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
          <Button href="/gutschein" variant="outlineLight" size="md">
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
