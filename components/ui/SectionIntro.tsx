import { Type } from "./Type";
import { Reveal } from "./Reveal";

interface SectionIntroProps {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "center" | "left";
  /** "dark" = auf hellem Grund (dunkle Schrift) · "light" = auf dunklem Grund. */
  tone?: "dark" | "light";
  className?: string;
}

/** Eyebrow + Fraunces-Titel + Messing-Unterstrich + Fließtext. */
export function SectionIntro({
  eyebrow,
  title,
  text,
  align = "center",
  tone = "dark",
  className = "",
}: SectionIntroProps) {
  const isCenter = align === "center";
  const titleColor = tone === "dark" ? "text-forest-900" : "text-cream-50";
  const eyebrowColor = tone === "dark" ? "text-brass-600" : "text-brass-300";
  const textColor = tone === "dark" ? "text-forest-700/80" : "text-cream-100/75";

  return (
    <Reveal
      className={`${isCenter ? "mx-auto text-center" : "text-start"} max-w-2xl ${className}`}
    >
      {eyebrow && (
        <Type role="eyebrow" className={`${eyebrowColor} mb-5`}>
          {eyebrow}
        </Type>
      )}
      <Type role="display" as="h2" className={titleColor}>
        {title}
      </Type>
      <div
        className={`mt-7 h-px w-14 bg-brass-400 ${isCenter ? "mx-auto" : ""}`}
      />
      {text && (
        <Type role="lead" className={`mt-7 ${textColor}`}>
          {text}
        </Type>
      )}
    </Reveal>
  );
}
