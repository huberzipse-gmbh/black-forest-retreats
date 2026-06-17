"use client";

import { useState } from "react";
import Image from "next/image";
import { Type } from "@/components/ui/Type";
import { de } from "@/lib/strings/de";

const t = de.apartments.detail;

/** Foto-Galerie als Mosaik (5 Bilder) + aufklappbarer Rest, hält die Seite kurz. */
export function RetreatGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [open, setOpen] = useState(false);
  if (!images.length) return null;

  const mosaic = images.slice(0, 5);
  const rest = images.slice(5);

  return (
    <section className="bg-cream-50 px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-4">
          <Type role="eyebrow" className="text-brass-600">
            {t.gallery}
          </Type>
          {(rest.length > 0 || images.length > 1) && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="shrink-0 rounded-full border border-forest-900/25 px-5 py-2.5 font-body text-xs font-semibold uppercase tracking-[0.16em] text-forest-900 transition-colors hover:bg-forest-900 hover:text-cream-50"
            >
              {open ? t.showLess : t.showAllPhotos}
            </button>
          )}
        </div>

        {/* Mosaik: 1 großes + 4 kleine */}
        <div className="mt-8 grid grid-cols-2 gap-2.5 md:grid-cols-4 md:grid-rows-2">
          {mosaic.map((src, i) => (
            <div
              key={src}
              className={`group relative overflow-hidden rounded-[5px] ${
                i === 0
                  ? "col-span-2 row-span-2 aspect-square md:aspect-auto"
                  : "aspect-[4/3]"
              }`}
            >
              <Image
                src={src}
                alt={`${name} — Foto ${i + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
              />
            </div>
          ))}
        </div>

        {/* Aufgeklappt: restliche Fotos */}
        {open && rest.length > 0 && (
          <div className="mt-2.5 grid grid-cols-2 gap-2.5 md:grid-cols-3">
            {rest.map((src, i) => (
              <div
                key={src}
                className="group relative aspect-[4/3] overflow-hidden rounded-[5px]"
              >
                <Image
                  src={src}
                  alt={`${name} — Foto ${i + 6}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
