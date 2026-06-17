"use client";

import { useState } from "react";
import { Type } from "@/components/ui/Type";
import { useStrings } from "@/lib/i18n/useStrings";

/** Wieviele Ausstattungs-Punkte vor dem Aufklappen sichtbar sind (2 Reihen à 3). */
const PREVIEW_COUNT = 6;

/** Ausstattung als aufklappbare Liste — hält die Seite kurz, zeigt auf Wunsch alles. */
export function RetreatAmenities({ amenities }: { amenities: string[] }) {
  const t = useStrings().apartments.detail;
  const [open, setOpen] = useState(false);
  if (!amenities.length) return null;

  const collapsible = amenities.length > PREVIEW_COUNT;
  const visible = open || !collapsible ? amenities : amenities.slice(0, PREVIEW_COUNT);

  return (
    <section className="bg-cream-50 px-6 py-20 md:px-10 md:py-24">
      <div className="mx-auto max-w-7xl">
        <Type role="eyebrow" className="text-brass-600">
          {t.amenities}
        </Type>
        <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((a) => (
            <li
              key={a}
              className="flex items-center gap-3 font-body text-sm text-forest-700/85"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brass-500" />
              {a}
            </li>
          ))}
        </ul>

        {collapsible && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="mt-10 rounded-full border border-forest-900/25 px-5 py-2.5 font-body text-xs font-semibold uppercase tracking-[0.16em] text-forest-900 transition-colors hover:bg-forest-900 hover:text-cream-50"
          >
            {open ? t.showLess : t.showAllAmenities}
          </button>
        )}
      </div>
    </section>
  );
}
