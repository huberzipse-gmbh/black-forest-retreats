"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useStrings } from "@/lib/i18n/useStrings";

/**
 * Vollbild-Ansicht der Fotogalerie: Pfeile, Tastatur (←/→/Esc) und Wischen.
 * Rendert per Portal direkt an <body>, damit kein Elternteil mit overflow oder
 * transform das Overlay beschneidet.
 */
export function Lightbox({
  images,
  name,
  index,
  onClose,
  onIndexChange,
}: {
  images: string[];
  name: string;
  index: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}) {
  const t = useStrings().apartments.detail;
  const touchStartX = useRef<number | null>(null);

  const count = images.length;
  const go = useCallback(
    (delta: number) => onIndexChange((index + delta + count) % count),
    [index, count, onIndexChange],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [go, onClose]);

  // Wird nur nach einem Klick gerendert, existiert also nie beim Server-Render.
  if (!count || typeof document === "undefined") return null;

  const arrow =
    "absolute top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-cream-50/25 bg-night/50 text-cream-50 backdrop-blur-sm transition-colors hover:bg-night/80 md:h-14 md:w-14";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.gallery}
      className="fixed inset-0 z-[100] flex flex-col bg-night/97"
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        const start = touchStartX.current;
        touchStartX.current = null;
        if (start === null) return;
        const dx = e.changedTouches[0].clientX - start;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }}
    >
      {/* Kopfzeile: Zähler + Schließen */}
      <div className="flex items-center justify-between px-5 py-5 md:px-8">
        <span className="font-body text-xs font-medium uppercase tracking-[0.2em] text-cream-100/70">
          {index + 1} / {count}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.close}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-cream-50/25 text-cream-50 transition-colors hover:bg-cream-50 hover:text-night"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Bildfläche */}
      <div className="relative flex-1">
        <Image
          key={images[index]}
          src={images[index]}
          alt={`${name} - Foto ${index + 1}`}
          fill
          sizes="100vw"
          priority
          className="object-contain px-3 pb-6 md:px-16"
        />

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={t.prevPhoto}
              className={`${arrow} left-3 md:left-6`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M15 5l-7 7 7 7"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={t.nextPhoto}
              className={`${arrow} right-3 md:right-6`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M9 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Miniaturen */}
      {count > 1 && (
        <div className="flex justify-center gap-2 overflow-x-auto px-5 pb-6 md:pb-8">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => onIndexChange(i)}
              aria-label={`${name} - Foto ${i + 1}`}
              aria-current={i === index}
              className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-[3px] transition-opacity md:h-14 md:w-20 ${
                i === index
                  ? "opacity-100 ring-1 ring-brass-400"
                  : "opacity-45 hover:opacity-80"
              }`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body,
  );
}
