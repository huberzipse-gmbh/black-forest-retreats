"use client";

import type { DistanceBand } from "@/data/surroundings";
import { de } from "@/lib/strings/de";

const BAND_ORDER: DistanceBand[] = ["near", "mid", "day"];

interface DistanceFilterProps {
  /** Welche Bänder im Datensatz vorkommen (nur diese werden gezeigt). */
  available: DistanceBand[];
  active: Set<DistanceBand>;
  onToggle: (band: DistanceBand) => void;
}

/** Segmentierte Distanz-Chips: „In der Nähe" · „Etwas weiter" · „Tagesausflug". */
export function DistanceFilter({ available, active, onToggle }: DistanceFilterProps) {
  const labels = de.surroundings.filter;
  const bands = BAND_ORDER.filter((b) => available.includes(b));
  if (bands.length < 2) return null; // Filter nur sinnvoll ab 2 Bändern

  return (
    <div
      role="group"
      aria-label={labels.aria}
      className="flex flex-wrap items-center justify-center gap-2.5"
    >
      {bands.map((band) => {
        const on = active.has(band);
        return (
          <button
            key={band}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(band)}
            className={`rounded-full px-5 py-2.5 font-body text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-300 ${
              on
                ? "bg-brass-400 text-night"
                : "border border-cream-50/25 text-cream-100/80 hover:border-brass-400/60 hover:text-cream-50"
            }`}
          >
            {labels[band]}
          </button>
        );
      })}
    </div>
  );
}
