"use client";

/**
 * Wiederverwendbares Gerüst für die lokalen Ortsseiten (Ferienwohnung Neuenbürg,
 * Urlaub Enztal, Nähe Bad Wildbad, Anreise). Rein deutschsprachig, Text kommt als
 * Props herein (nicht über lib/strings) - analog zu den Legal-Seiten.
 *
 * Baut ausschließlich aus den bestehenden Design-Primitiven (Type, SectionIntro,
 * Reveal, Button, PlaceCard, Chip) und dem dunklen Article-Idiom der
 * Umgebung-Detailseiten, damit die neuen Seiten optisch nicht auffallen.
 */
import { Type } from "@/components/ui/Type";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { PlaceCard } from "@/components/sections/umgebung/PlaceCard";
import { surroundings, type Place } from "@/data/surroundings";
import { useLocaleHref, useStrings } from "@/lib/i18n/I18nProvider";

export interface LandingTextSection {
  heading: string;
  paragraphs: string[];
}

export interface LandingFact {
  label: string;
  value: string;
}

export interface LandingFaq {
  q: string;
  a: string;
}

export interface LandingViewProps {
  eyebrow: string;
  /** H1 der Seite. */
  title: string;
  lead: string;
  /** Erzähl-Abschnitte (Ort, Lage, Angebot). */
  sections: LandingTextSection[];
  /** Optionale Fakten-Tabelle (Entfernungen o. Ä.) - stark für KI-Antworten. */
  facts?: { heading: string; items: LandingFact[] };
  /** IDs echter Umgebungsorte (data/surroundings) für das Ausflugsziele-Grid. */
  placeIds?: string[];
  placesEyebrow?: string;
  placesTitle?: string;
  placesText?: string;
  /** Prägnanter Editorial-Satz als Break. */
  quote?: string;
  faq?: LandingFaq[];
  faqTitle?: string;
  ctaEyebrow: string;
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
}

export function LandingView(props: LandingViewProps) {
  const t = useStrings();
  const href = useLocaleHref();

  // Place-Objekte aus IDs + lokalisiertem Text zusammensetzen (kein DB-Zugriff).
  const places: Place[] = (props.placeIds ?? [])
    .map((id) => {
      const struct = surroundings.find((p) => p.id === id);
      const content = t.surroundingsContent[id];
      if (!struct || !content) return null;
      return { ...struct, ...content } as Place;
    })
    .filter((p): p is Place => Boolean(p));

  return (
    <article className="bg-night text-cream-50">
      {/* Kopf */}
      <section className="px-6 pt-32 pb-14 md:px-10 md:pt-40 md:pb-18">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <Type role="eyebrow" className="text-brass-300">
              {props.eyebrow}
            </Type>
            <Type role="display" as="h1" className="mt-5 text-cream-50">
              {props.title}
            </Type>
            <div className="mx-auto mt-7 h-px w-14 bg-brass-400" />
            <Type role="lead" className="mt-7 text-cream-100/80">
              {props.lead}
            </Type>
          </Reveal>
        </div>
      </section>

      {/* Erzähl-Abschnitte */}
      <section className="border-t border-cream-50/10 px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-5xl gap-14 md:gap-20">
          {props.sections.map((s, i) => (
            <Reveal key={i} delay={(i % 2) * 90}>
              <div className="max-w-2xl">
                <Type role="h2" as="h2" className="text-cream-50">
                  {s.heading}
                </Type>
                <div className="mt-5 space-y-4">
                  {s.paragraphs.map((p, j) => (
                    <Type key={j} role="body" className="text-cream-100/75">
                      {p}
                    </Type>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Fakten-Tabelle */}
      {props.facts && (
        <section className="border-t border-cream-50/10 px-6 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <Type role="h2" as="h2" className="text-cream-50">
                {props.facts.heading}
              </Type>
              <dl className="mt-8 divide-y divide-cream-50/10">
                {props.facts.items.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-baseline justify-between gap-6 py-3.5"
                  >
                    <dt className="font-body text-cream-100/75">{f.label}</dt>
                    <dd className="text-end font-body font-semibold text-cream-50">
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>
      )}

      {/* Editorial-Satz */}
      {props.quote && (
        <section className="border-t border-cream-50/10 px-6 py-24 md:px-10 md:py-32">
          <Reveal className="mx-auto max-w-4xl text-center">
            <Type role="display" as="p" className="text-cream-50">
              {props.quote}
            </Type>
          </Reveal>
        </section>
      )}

      {/* Ausflugsziele */}
      {places.length > 0 && (
        <section className="border-t border-cream-50/10 px-6 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              tone="light"
              align="center"
              eyebrow={props.placesEyebrow}
              title={props.placesTitle ?? ""}
              text={props.placesText}
            />
            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {places.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 90}>
                  <PlaceCard place={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {props.faq && props.faq.length > 0 && (
        <section className="border-t border-cream-50/10 px-6 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-3xl">
            <Type role="h2" as="h2" className="text-cream-50">
              {props.faqTitle ?? "Häufige Fragen"}
            </Type>
            <div className="mt-10 space-y-8">
              {props.faq.map((item, i) => (
                <Reveal key={i} delay={(i % 3) * 60}>
                  <Type role="h3" as="h3" className="text-cream-50">
                    {item.q}
                  </Type>
                  <Type role="body" className="mt-3 text-cream-100/75">
                    {item.a}
                  </Type>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA zu den Wohnungen */}
      <section className="border-t border-cream-50/10 px-6 py-24 md:px-10 md:py-32">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Type role="eyebrow" className="text-brass-300">
            {props.ctaEyebrow}
          </Type>
          <Type role="display" as="h2" className="mt-5 text-cream-50">
            {props.ctaTitle}
          </Type>
          <Type role="lead" className="mx-auto mt-6 max-w-xl text-cream-100/80">
            {props.ctaText}
          </Type>
          <div className="mt-9 flex justify-center">
            <Button href={href("/#apartments")} variant="solid" size="md">
              {props.ctaButton}
            </Button>
          </div>
        </Reveal>
      </section>
    </article>
  );
}
