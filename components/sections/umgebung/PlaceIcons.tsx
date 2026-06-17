import type { ReactNode } from "react";

/**
 * Aktivitäts-Icons für Erlebnis-Karten. Konvention wie im Projekt:
 * viewBox 0 0 24 24, fill none, stroke currentColor, strokeWidth ~1.4,
 * runde Enden — die Hülle (<svg>) setzt der Aufrufer (siehe <PlaceIcon>).
 * Bewusst reduzierte, erkennbare Strich-Motive (kein „Raketen"-Effekt).
 */
export type PlaceIconKey =
  | "alpaca"
  | "goat"
  | "kayak"
  | "flyfishing"
  | "minigolf"
  | "swim"
  | "paw";

export const PLACE_ICONS: Record<PlaceIconKey, ReactNode> = {
  // Alpaka: markanter Kopf mit zwei hohen Ohren, Gesicht, Augen, Schnauze.
  alpaca: (
    <>
      <path d="M8.8 3.2c.5 1.9.5 3.5 0 5M15.2 3.2c-.5 1.9-.5 3.5 0 5" />
      <path d="M8.9 8c-.8 1.5-.5 3.6.9 4.8.9.8 1.6 1.1 2.2 1.1s1.3-.3 2.2-1.1c1.4-1.2 1.7-3.3.9-4.8" />
      <path d="M10.3 13.4c.3 1 1 1.7 1.7 1.7s1.4-.7 1.7-1.7" />
      <path d="M10.7 9.6h.01M13.3 9.6h.01" />
    </>
  ),
  // Ziege: geschwungene Hörner, Kopf, Ohren, Bart.
  goat: (
    <>
      <path d="M9.5 8.5c-1.4-1.2-2.2-3-2.2-5 1.8.6 3.1 1.9 3.8 3.6M14.5 8.5c1.4-1.2 2.2-3 2.2-5-1.8.6-3.1 1.9-3.8 3.6" />
      <path d="M9 9c-.4 1.9.6 3.8 2.4 4.5l.6.2.6-.2C14.4 12.8 15.4 10.9 15 9" />
      <path d="M9.2 9.3 7.3 10.4M14.8 9.3l1.9 1.1" />
      <path d="M12 13.7v2.6M11 16.3h2" />
    </>
  ),
  // Kajak: Rumpf, Paddler, diagonales Paddel mit Blättern.
  kayak: (
    <>
      <path d="M3.5 13.8c2.8 2 14.2 2 17 0" />
      <path d="M12 9.4v3.6" />
      <circle cx="12" cy="7.6" r="1.5" />
      <path d="M6.2 6.5 17.8 14.5" />
      <path d="M5.3 5.9 7 7.1M16.9 13.9l1.7 1.2" />
    </>
  ),
  // Fliegenfischen: Rute, geschwungene Schnur, springender Fisch.
  flyfishing: (
    <>
      <path d="M4 20.5 13 8.5" />
      <path d="M13 8.5c2.2.8 3.4 2.6 2.8 4.8" />
      <path d="M15.4 16.2c1-1.2 3.1-1.2 4.2 0-1.1 1.2-3.2 1.2-4.2 0z" />
      <path d="m15.4 16.2-1.6-1M15.4 16.2l-1.6 1" />
      <path d="M18.2 16.2h.01" />
    </>
  ),
  // Minigolf: Loch, Fahnenstange mit Wimpel, Ball.
  minigolf: (
    <>
      <path d="M8 19c0 .9 1.8 1.5 4 1.5s4-.6 4-1.5-1.8-1.5-4-1.5-4 .6-4 1.5z" />
      <path d="M12 18V4" />
      <path d="M12 4h6l-2 2.2 2 2.2h-6" />
      <circle cx="7" cy="18" r="1.3" />
    </>
  ),
  // Schwimmen: Kopf, ausgestreckter Arm, Wellenlinien.
  swim: (
    <>
      <circle cx="8.5" cy="7.5" r="1.6" />
      <path d="M6 13c1.4-1 2.9-1 4.4 0l2.4 1.4 4.2-2.1" />
      <path d="M3 18c1.3 1 2.7 1 4 0s2.7-1 4 0 2.7 1 4 0 2.7-1 4 0" />
    </>
  ),
  // Pfote: vier Zehenballen, großer Sohlenballen.
  paw: (
    <>
      <path d="M7.2 9.4a1.3 1.3 0 1 0 .01 0M10.8 7.4a1.3 1.3 0 1 0 .01 0M13.2 7.4a1.3 1.3 0 1 0 .01 0M16.8 9.4a1.3 1.3 0 1 0 .01 0" />
      <path d="M12 12.2c-2.2 0-4 1.7-4 3.6 0 1.6 1.7 2.7 4 2.7s4-1.1 4-2.7c0-1.9-1.8-3.6-4-3.6z" />
    </>
  ),
};

interface PlaceIconProps {
  name: PlaceIconKey;
  className?: string;
}

/** Fertige <svg>-Hülle um ein Aktivitäts-Icon (Farbe via text-* erben). */
export function PlaceIcon({ name, className = "h-7 w-7" }: PlaceIconProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {PLACE_ICONS[name]}
    </svg>
  );
}
