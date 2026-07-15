"use client";

import { useState } from "react";
import Image from "next/image";
import { Type } from "@/components/ui/Type";
import { useStrings } from "@/lib/i18n/useStrings";
import { Lightbox } from "./Lightbox";

/** Foto-Galerie als Mosaik (5 Bilder) + aufklappbarer Rest, hält die Seite kurz.
 *  Jedes Bild öffnet die Vollbild-Ansicht, dort lässt sich durchblättern. */
export function RetreatGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const t = useStrings().apartments.detail;
  const [open, setOpen] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
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
          {/* Nur zeigen, wenn es wirklich mehr als das Mosaik gibt — sonst war der
              Klick auf „Alle Fotos" ohne jede Wirkung. */}
          {rest.length > 0 && (
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
            <button
              key={src}
              type="button"
              onClick={() => setLightbox(i)}
              aria-label={t.openPhoto}
              className={`group relative cursor-zoom-in overflow-hidden rounded-[5px] ${
                i === 0
                  ? "col-span-2 row-span-2 aspect-square md:aspect-auto"
                  : "aspect-[4/3]"
              }`}
            >
              <Image
                src={src}
                alt={`${name} - Foto ${i + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
              />
            </button>
          ))}
        </div>

        {/* Aufgeklappt: restliche Fotos */}
        {open && rest.length > 0 && (
          <div className="mt-2.5 grid grid-cols-2 gap-2.5 md:grid-cols-3">
            {rest.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setLightbox(i + 5)}
                aria-label={t.openPhoto}
                className="group relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-[5px]"
              >
                <Image
                  src={src}
                  alt={`${name} - Foto ${i + 6}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightbox !== null && (
        <Lightbox
          images={images}
          name={name}
          index={lightbox}
          onIndexChange={setLightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  );
}
