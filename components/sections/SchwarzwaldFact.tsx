import type { ReactNode } from "react";
import { Type } from "@/components/ui/Type";
import { Reveal } from "@/components/ui/Reveal";

interface SchwarzwaldFactProps {
  quote: string;
  source: string;
  eyebrow?: string;
  tone?: "dark" | "light";
  /** Reduziert den Abstand nach unten — z. B. damit die Wald-Silhouette direkt anschließt. */
  tightBottom?: boolean;
  /** Dezente Hintergrund-Elemente (z. B. <FactDecor />). */
  decor?: ReactNode;
}

export function SchwarzwaldFact({
  quote,
  source,
  eyebrow,
  tone = "light",
  tightBottom = false,
  decor,
}: SchwarzwaldFactProps) {
  const dark = tone === "dark";
  const padding = tightBottom
    ? "px-6 pt-24 pb-10 md:pt-32 md:pb-12"
    : "px-6 py-24 md:py-32";

  return (
    <section
      className={`relative ${padding} ${
        dark ? "bg-night text-cream-50" : "bg-cream-50 text-forest-900"
      }`}
    >
      {decor}
      <Reveal className="relative z-10 mx-auto max-w-3xl text-center">
        {eyebrow && (
          <Type
            role="eyebrow"
            className={`mb-7 ${dark ? "text-brass-300" : "text-brass-600"}`}
          >
            {eyebrow}
          </Type>
        )}
        {quote
          .split(/\n\n+/)
          .map((para) => para.trim())
          .filter(Boolean)
          .map((para, i) => (
            <Type
              key={i}
              role="h1"
              as="p"
              className={`${dark ? "text-cream-50" : "text-forest-900"} ${
                i > 0 ? "mt-5 md:mt-6" : ""
              }`}
            >
              {para}
            </Type>
          ))}
        <div className="mx-auto mt-8 h-px w-12 bg-brass-400" />
        <Type
          role="caption"
          className={`mt-6 font-medium uppercase tracking-[0.22em] ${
            dark ? "text-cream-100/55" : "text-forest-700/55"
          }`}
        >
          {source}
        </Type>
      </Reveal>
    </section>
  );
}
