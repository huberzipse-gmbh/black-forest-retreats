import { Fragment, type ReactNode } from "react";
import { useStrings } from "@/lib/i18n/useStrings";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { Type } from "@/components/ui/Type";
import { Reveal } from "@/components/ui/Reveal";

const FEATURE_ICONS: ReactNode[] = [
  // Direkt buchen (Preis-Tag)
  <Fragment key="tag">
    <path d="M9 3H5a2 2 0 0 0-2 2v4l11 11 6-6L9 3z" />
    <circle cx="7.5" cy="7.5" r="1" />
  </Fragment>,
  // Persönlich (Gastgeber)
  <Fragment key="host">
    <circle cx="12" cy="8" r="4" />
    <path d="M5 21v-1a7 7 0 0 1 14 0v1" />
  </Fragment>,
  // Mitten im Wald (Tanne)
  <path key="tree" d="M12 2 7 11h3l-4 7h12l-4-7h3L12 2zM12 18v4" />,
];

export function Intro() {
  const t = useStrings();

  return (
    <section id="intro" className="bg-cream-50 px-6 py-28 md:py-36">
      <div className="mx-auto max-w-5xl">
        <SectionIntro
          eyebrow={t.intro.eyebrow}
          title={t.intro.title}
          text={t.intro.text}
          align="center"
          tone="dark"
        />

        <div className="mt-20 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-3">
          {t.intro.features.map((f, i) => (
            <Reveal key={f.title} delay={i * 100}>
              <div className="flex flex-col items-center text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-brass-400/40">
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-brass-600"
                  >
                    {FEATURE_ICONS[i]}
                  </svg>
                </span>
                <Type role="h3" className="mt-6 text-forest-900">
                  {f.title}
                </Type>
                <p className="mt-3 max-w-[28ch] font-body text-sm leading-relaxed text-forest-700/75">
                  {f.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
