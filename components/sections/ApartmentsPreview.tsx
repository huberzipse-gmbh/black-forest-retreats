import Image from "next/image";
import { retreats } from "@/data/retreats";
import { useStrings } from "@/lib/i18n/useStrings";
import { Type } from "@/components/ui/Type";
import { Button } from "@/components/ui/Button";

// Kuratierte Galerie aus beiden Wohnungen (abwechselnd).
const GALLERY = [
  retreats[0]?.gallery[0],
  retreats[1]?.gallery[0],
  retreats[0]?.gallery[3],
  retreats[1]?.gallery[2],
  retreats[0]?.gallery[5],
  retreats[1]?.gallery[4],
  retreats[0]?.gallery[7],
  retreats[1]?.gallery[6],
].filter(Boolean) as string[];

export function ApartmentsPreview() {
  const t = useStrings();

  return (
    <section className="relative overflow-hidden bg-night text-cream-50">
      {/* Bild-Galerie als Hintergrund */}
      <div className="grid grid-cols-2 md:grid-cols-4">
        {GALLERY.map((src, i) => (
          <div
            key={src + i}
            className="group relative h-44 overflow-hidden sm:h-52 md:h-64 lg:h-72"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
            />
          </div>
        ))}
      </div>

      {/* Abdunkelung für Lesbarkeit */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(120% 100% at 50% 50%, rgba(15,24,19,0.55), rgba(15,24,19,0.82))",
        }}
      />

      {/* Zentraler Call-to-Action */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <Type role="eyebrow" className="text-brass-300">
          {t.apartmentsPreview.eyebrow}
        </Type>
        <Type role="display" as="h2" className="mt-5 max-w-2xl text-cream-50">
          {t.apartmentsPreview.title}
        </Type>
        <div className="mx-auto mt-7 h-px w-14 bg-brass-400" />
        <Type role="lead" className="mx-auto mt-7 max-w-md text-cream-100/85">
          {t.apartmentsPreview.text}
        </Type>
        <div className="mt-9">
          <Button href="#apartments" size="md">
            {t.apartmentsPreview.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
