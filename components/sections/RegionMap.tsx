"use client";

import dynamic from "next/dynamic";
import { Type } from "@/components/ui/Type";
import { Reveal } from "@/components/ui/Reveal";
import { useStrings } from "@/lib/i18n/useStrings";

/**
 * Leaflet braucht `window`. Darum die eigentliche Karte nur clientseitig laden
 * (ssr: false). `ssr: false` mit next/dynamic ist nur in Client Components
 * erlaubt → dieser Wrapper trägt "use client".
 */
const RegionMapLeaflet = dynamic(() => import("./RegionMapLeaflet"), {
  ssr: false,
  loading: () => (
    <div
      className="h-full w-full animate-pulse"
      style={{ background: "var(--color-forest-900)" }}
    />
  ),
});

export function RegionMap() {
  const t = useStrings();

  return (
    <section className="relative bg-night px-6 py-20 text-cream-50 md:px-10 md:py-28">
      <Reveal className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
          <Type role="eyebrow" className="mb-5 text-brass-300">
            {t.map.eyebrow}
          </Type>
          <Type role="h2" as="h2" className="text-cream-50">
            {t.map.title}
          </Type>
          <Type
            role="caption"
            className="mt-4 font-medium uppercase tracking-[0.22em] text-cream-100/55"
          >
            {t.map.subtitle}
          </Type>
        </div>

        <div className="bf-map-frame relative mx-auto h-[clamp(340px,46vw,560px)] w-full overflow-hidden rounded-2xl">
          <RegionMapLeaflet />
        </div>
      </Reveal>
    </section>
  );
}
