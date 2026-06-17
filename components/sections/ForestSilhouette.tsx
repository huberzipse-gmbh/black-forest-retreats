"use client";

import { useEffect, useRef, useState } from "react";
import { useStrings } from "@/lib/i18n/useStrings";

const VIEW_W = 1440;
const GROUND = 420;

/**
 * Tannen-/Fichten-Silhouette mit gestapelten, leicht hängenden Astetagen.
 * Zeichnerischer Look: weiche Bézier-Kurven an den Astkanten + dezente
 * deterministische Asymmetrie (kein Math.random → SSR-stabil).
 * Prinzipien: viele Etagen, unten breiter/länger, Astspitzen drooping.
 */
function fir(cx: number, h: number, hwBase: number, by = GROUND, seed = 0): string {
  const tip = by - h;
  const tiers = h > 360 ? 6 : h > 270 ? 5 : 4;
  const droop = h * 0.05; // wie stark die Astspitzen nach unten hängen
  // leichte Links/Rechts-Asymmetrie für den handgezeichneten Eindruck
  const jR = 1 + 0.06 * Math.sin(seed * 0.7 + 1.3);
  const jL = 1 + 0.06 * Math.cos(seed * 0.9 + 0.4);

  // Geometrie je Etage (von oben nach unten)
  const T = Array.from({ length: tiers }, (_, i) => {
    const f = (i + 1) / tiers; // 0..1 von Spitze zur Basis
    const w = hwBase * Math.pow(f, 0.72); // unten deutlich breiter
    return {
      w,
      inner: w * 0.34, // wie weit der Ast zum Stamm zurückspringt (Kerbe)
      yTip: tip + h * f + droop, // Astspitze hängt unter die Kerbe
      yNotch: tip + h * f - h * 0.02, // Kerbe sitzt etwas höher
    };
  });

  const d: string[] = [`M ${cx} ${tip}`]; // Wipfel

  // Rechte Seite: oben → unten
  for (const { w, inner, yTip, yNotch } of T) {
    const wR = w * jR;
    const innerR = inner * jR;
    d.push(`Q ${cx + wR * 0.6} ${yTip} ${cx + wR} ${yTip}`); // weicher Ast nach außen-unten
    d.push(`L ${cx + innerR} ${yNotch}`); // zurück zur Stamm-Kerbe
  }

  // Stammbasis
  const trunkHalf = hwBase * 0.07 + 2.5;
  d.push(`L ${cx + trunkHalf} ${by}`);
  d.push(`L ${cx - trunkHalf} ${by}`);

  // Linke Seite: unten → oben (gespiegelt)
  for (let i = tiers - 1; i >= 0; i--) {
    const { w, inner, yTip, yNotch } = T[i];
    const wL = w * jL;
    const innerL = inner * jL;
    d.push(`L ${cx - innerL} ${yNotch}`);
    d.push(`Q ${cx - wL * 0.6} ${yTip} ${cx - wL} ${yTip}`);
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

      {/* Standort-Marke: Werbung für den Nationalpark Nordschwarzwald (auf dem dunklen Band). */}
      <div className="absolute inset-x-0 bottom-7 z-10 flex flex-col items-center px-6 text-center md:bottom-10">
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6 text-brass-300"
        >
          <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
        <span className="mt-2 font-body text-[0.6rem] font-semibold uppercase tracking-[0.32em] text-brass-300/75">
          {t.park.home}
        </span>
        <span className="mt-1.5 font-display text-lg tracking-[0.01em] text-brass-300 md:text-2xl">
          {t.park.name}
        </span>
        <span className="mt-3 h-px w-10 bg-brass-400/70" />
      </div>
    </div>
  );
}
