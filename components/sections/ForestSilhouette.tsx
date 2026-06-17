"use client";

import { useEffect, useRef, useState } from "react";
import { useStrings } from "@/lib/i18n/useStrings";

const VIEW_W = 1440;
const GROUND = 420;

// Auf 2 Nachkommastellen runden → identischer String auf Server & Client (kein Hydration-Mismatch).
const r = (n: number) => Number(n.toFixed(2));

/**
 * Tanne/Fichte als Silhouette: schlanke konische Form, klare Mittelachse,
 * etagenweise gestapelte Astreihen mit leicht hängenden Spitzen, oben spitz,
 * schmaler Stamm unten.
 *
 * Aufbau (immer geschlossener, NIE selbstüberschneidender Pfad):
 *   Wipfel → rechte Seite Etage für Etage nach unten → Stammbasis →
 *   linke Seite gespiegelt nach oben → Z.
 * Jede Etage ist ein nach außen-unten gezogener Ast (quadratische Bézier),
 * danach eine Einkerbung zum Stamm hin, leicht TIEFER als die vorige
 * Astspitze — so überlappen sich die Etagen sauber wie bei einer echten Tanne.
 *
 * Dezente, deterministische Asymmetrie über `seed` (kein Math.random → SSR-stabil).
 */
function fir(cx: number, h: number, hwBase: number, by = GROUND, seed = 0): string {
  const tip = by - h;
  const tiers = h > 360 ? 7 : h > 270 ? 6 : 5;

  // Sehr dezente Seiten-Asymmetrie (max ~4 %), sanft begrenzt → keine kaputten Formen.
  const jR = 1 + 0.04 * Math.sin(seed * 0.7 + 1.3);
  const jL = 1 + 0.04 * Math.cos(seed * 0.9 + 0.4);

  // Crownhöhe (belaubter Teil) lässt unten Platz für den Stamm.
  const trunkH = h * 0.08;
  const crownH = h - trunkH;
  const trunkTop = tip + crownH;
  const trunkHalf = hwBase * 0.06 + 2;

  // Etagen-Geometrie von der Spitze (f=0) zur Basis (f=1).
  type Tier = { yArm: number; yNotch: number; w: number; inner: number };
  const T: Tier[] = Array.from({ length: tiers }, (_, i) => {
    const f0 = i / tiers; // Oberkante dieser Etage
    const f1 = (i + 1) / tiers; // Unterkante (Astspitze) dieser Etage
    // Breite wächst progressiv nach unten (Potenz < 1 → schlanke, spitze Krone).
    const w = hwBase * Math.pow(f1, 0.85);
    return {
      yArm: r(tip + crownH * f1), // Höhe der Astspitze (Außenkante)
      yNotch: r(tip + crownH * f0 + crownH * 0.04), // Einkerbung sitzt höher (am Etagenanfang)
      w,
      inner: hwBase * 0.16 * (0.4 + 0.6 * f1), // Rücksprung zur Stammachse (wächst leicht)
    };
  });

  const d: string[] = [`M ${r(cx)} ${r(tip)}`]; // Wipfel

  // Rechte Seite, oben → unten.
  for (let i = 0; i < tiers; i++) {
    const { yArm, yNotch, w, inner } = T[i];
    const armX = r(cx + w * jR);
    const innerX = r(cx + inner * jR);
    // Wölbung: Kontrollpunkt etwas über der Astspitze für eine weiche, leicht
    // hängende Astkante. Erste Etage startet direkt am Wipfel (keine Kerbe davor).
    if (i > 0) d.push(`L ${innerX} ${yNotch}`);
    const ctrlX = r(cx + w * jR * 0.55);
    const ctrlY = r(yArm - (yArm - yNotch) * 0.55);
    d.push(`Q ${ctrlX} ${ctrlY} ${armX} ${yArm}`);
  }

  // Stammbasis rechts → unten → links.
  d.push(`L ${r(cx + trunkHalf)} ${r(trunkTop)}`);
  d.push(`L ${r(cx + trunkHalf)} ${r(by)}`);
  d.push(`L ${r(cx - trunkHalf)} ${r(by)}`);
  d.push(`L ${r(cx - trunkHalf)} ${r(trunkTop)}`);

  // Linke Seite gespiegelt, unten → oben.
  for (let i = tiers - 1; i >= 0; i--) {
    const { yArm, yNotch, w, inner } = T[i];
    const armX = r(cx - w * jL);
    const innerX = r(cx - inner * jL);
    const ctrlX = r(cx - w * jL * 0.55);
    const ctrlY = r(yArm - (yArm - yNotch) * 0.55);
    d.push(`L ${armX} ${yArm}`);
    if (i > 0) d.push(`Q ${ctrlX} ${ctrlY} ${innerX} ${yNotch}`);
    else d.push(`Q ${ctrlX} ${ctrlY} ${r(cx)} ${r(tip)}`);
  }

  d.push("Z");
  return d.join(" ");
}

// Deterministisch (kein Math.random → SSR-stabil, bewusst „strukturiert").
const BACK = Array.from({ length: 19 }, (_, i) => {
  const cx = (i + 0.5) * (VIEW_W / 19);
  const h = 210 + 95 * Math.abs(Math.sin(i * 1.7 + 0.6));
  const hw = 58 + 16 * Math.abs(Math.cos(i * 1.3));
  return { cx, h, hw };
});

const FRONT = Array.from({ length: 13 }, (_, i) => {
  const cx = i * (VIEW_W / 12) + 18 * Math.sin(i * 2.1);
  const h = 290 + 110 * Math.abs(Math.sin(i * 0.9 + 1.2));
  const hw = 80 + 20 * Math.abs(Math.cos(i * 1.1 + 0.4));
  return { cx, h, hw };
});

export function ForestSilhouette() {
  const t = useStrings();
  const ref = useRef<HTMLDivElement>(null);
  const [grown, setGrown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setGrown(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const treeClass = `bf-tree${grown ? " is-grown" : ""}`;

  return (
    <div
      ref={ref}
      className="relative h-[clamp(300px,40vw,540px)] w-full overflow-hidden"
      style={{
        // Oben creme (Zitat-Bereich), unten dunkel (Footer) — die Bäume gehen darüber hinweg.
        backgroundImage:
          "linear-gradient(to bottom, var(--color-cream-50) 0%, var(--color-cream-50) 42%, var(--color-night) 60%, var(--color-night) 100%)",
      }}
    >

      <svg
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-full w-full"
        viewBox={`0 0 ${VIEW_W} ${GROUND}`}
        preserveAspectRatio="xMidYMax slice"
        fill="none"
      >
        {/* Hintere Reihe — heller, kleiner (Tiefe); sichtbar auf creme UND auf dunkel */}
        <g fill="#26402f">
          {BACK.map((tr, i) => (
            <path
              key={`b${i}`}
              className={treeClass}
              style={{ transitionDelay: `${i * 35}ms` }}
              d={fir(tr.cx, tr.h, tr.hw, GROUND - 6, i + 1)}
            />
          ))}
        </g>
        {/* Vordere Reihe — exakt im Footer-Farbton (--color-night), damit der Übergang nahtlos ist */}
        <g fill="var(--color-night)">
          {FRONT.map((tr, i) => (
            <path
              key={`f${i}`}
              className={treeClass}
              style={{ transitionDelay: `${120 + i * 55}ms` }}
              d={fir(tr.cx, tr.h, tr.hw, GROUND, i + 7)}
            />
          ))}
        </g>
      </svg>

      {/* Standort-Marke: Nationalpark Nordschwarzwald — oben über den Baumwipfeln (heller Bereich). */}
      <div className="absolute inset-x-0 top-7 z-10 flex flex-col items-center px-6 text-center md:top-10">
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6 text-brass-600"
        >
          <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
        <span className="mt-2 font-display text-lg tracking-[0.01em] text-forest-900 md:text-2xl">
          {t.park.name}
        </span>
        <span className="mt-1.5 font-body text-xs font-semibold uppercase tracking-[0.2em] text-brass-600">
          {t.park.tagline}
        </span>
      </div>
    </div>
  );
}
