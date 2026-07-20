"use client";

import Image from "next/image";
import Link from "next/link";
import { Type } from "@/components/ui/Type";
import { Reveal } from "@/components/ui/Reveal";
import { useStrings } from "@/lib/i18n/useStrings";
import { useLocaleHref } from "@/lib/i18n/I18nProvider";

/** Cover der Marktstraße 25 (id the-raccoon-house) — bewusst geblurrt. */
const IMAGE = "/images/wohnungen/raccoon-house/01.webp";

/**
 * Startseiten-Teaser: die Marktstraße 25 als kommende Event-Location.
 * Bilder und Preise fehlen noch — deshalb ist das Foto bewusst verschwommen
 * und das Ganze als edles „Bald buchbar"-Statement inszeniert (gleiches
 * Blur-Muster wie die ausgebuchten ApartmentCards). Die gesamte Fläche ist
 * ein Link auf /event-location.
 */
export function EventLocationTeaser() {
  const t = useStrings().eventLocation.teaser;
  // Interne Links tragen die Sprache im Pfad (/en/event-location).
  const href = useLocaleHref();

  return (
    <section className="bg-cream-100 px-6 py-20 md:py-28">
      <Reveal className="mx-auto max-w-5xl">
        <Link
          href={href("/event-location")}
          className="group relative flex min-h-[440px] flex-col items-center justify-center overflow-hidden rounded-[6px] px-6 py-20 text-center shadow-[0_30px_80px_-40px_rgba(15,24,19,0.75)] ring-1 ring-brass-400/70 ring-offset-2 ring-offset-cream-100 md:min-h-[500px]"
        >
          {/* Bewusst verschwommen: die Räume werden gerade hergerichtet. */}
          <Image
            src={IMAGE}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="scale-110 object-cover blur-[10px] transition-transform duration-[1600ms] ease-out group-hover:scale-[1.16]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-night/60 via-night/45 to-night/75"
          />

          <div className="relative z-10 flex flex-col items-center text-cream-50">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-brass-300/60 bg-night/45 px-4 py-1.5 font-body text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brass-300 backdrop-blur-sm">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brass-300" />
              {t.badge}
            </span>

            <Type role="eyebrow" className="mt-7 text-cream-100/75">
              {t.eyebrow}
            </Type>
            <Type role="display" as="h2" className="mt-4 max-w-2xl text-cream-50">
              {t.title}
            </Type>
            <div className="mt-6 h-px w-14 bg-brass-400" />
            <Type role="lead" className="mt-6 max-w-xl text-cream-100/90">
              {t.text}
            </Type>

            <span className="mt-9 inline-flex flex-col items-center gap-2">
              <span className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-cream-50">
                {t.cta}{" "}
                <span aria-hidden className="inline-block rtl:rotate-180">
                  &rarr;
                </span>
              </span>
              <span className="h-px w-7 bg-brass-400 transition-all duration-500 group-hover:w-16" />
            </span>
          </div>
        </Link>
      </Reveal>
    </section>
  );
}
