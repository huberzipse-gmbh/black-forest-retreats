"use client";

import { useMemo, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { PlaceCard } from "@/components/sections/umgebung/PlaceCard";
import { DistanceFilter } from "@/components/sections/umgebung/DistanceFilter";
import { bandOf, type DistanceBand, type Place } from "@/data/surroundings";
import { de } from "@/lib/strings/de";

/** Distanz-Filter + reaktives Karten-Grid für eine Kategorie. */
export function CategoryGrid({ places }: { places: Place[] }) {
  // Welche Bänder kommen in dieser Kategorie vor?
  const available = useMemo(() => {
    const set = new Set<DistanceBand>();
    for (const p of places) set.add(bandOf(p.distanceKm));
    return [...set];
  }, [places]);

  // Standard: „In der Nähe" vorausgewählt, falls vorhanden, sonst alles.
  const [active, setActive] = useState<Set<DistanceBand>>(() =>
    new Set<DistanceBand>(available.includes("near") ? ["near"] : available),
  );

  const toggle = (band: DistanceBand) =>
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(band)) next.delete(band);
      else next.add(band);
      return next;
    });

  const visible = places.filter((p) => active.has(bandOf(p.distanceKm)));
  // Schlüssel triggert die Reveal-Animation bei Filterwechsel neu.
  const gridKey = [...active].sort().join("-");

  return (
    <div>
      <div className="mb-12">
        <DistanceFilter available={available} active={active} onToggle={toggle} />
      </div>

      {visible.length > 0 ? (
        <div
          key={gridKey}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 90}>
              <PlaceCard place={p} />
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="py-16 text-center font-body text-sm text-cream-100/55">
          {de.surroundings.filter.empty}
        </p>
      )}
    </div>
  );
}
