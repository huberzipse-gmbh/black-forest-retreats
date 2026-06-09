"use client";

import { useEffect, useRef, useState } from "react";

const VIEW_W = 1440;
const GROUND = 420;

/** Geschichtete Tannen-Silhouette (klassische Nadelbaum-Form, mehrere Etagen). */
function fir(cx: number, h: number, hw: number, by = GROUND): string {
  const t1 = by - h * 0.3;
  const t2 = by - h * 0.62;
  const tip = by - h;
  return [
    `M${cx - hw},${by}`,
    `L${cx - hw * 0.5},${t1}`,
    `L${cx - hw * 0.7},${t1}`,
    `L${cx - hw * 0.38},${t2}`,
    `L${cx - hw * 0.52},${t2}`,
    `L${cx},${tip}`,
    `L${cx + hw * 0.52},${t2}`,
    `L${cx + hw * 0.38},${t2}`,
    `L${cx + hw * 0.7},${t1}`,
    `L${cx + hw * 0.5},${t1}`,
    `L${cx + hw},${by}`,
    "Z",
  ].join(" ");
}

// Deterministisch (kein Math.random → SSR-stabil, bewusst „strukturiert").
const BACK = Array.from({ length: 19 }, (_, i) => {
  const cx = (i + 0.5) * (VIEW_W / 19);
  const h = 210 + 95 * Math.abs(Math.sin(i * 1.7 + 0.6));
  const hw = 36 + 11 * Math.abs(Math.cos(i * 1.3));
  return { cx, h, hw };
});

const FRONT = Array.from({ length: 13 }, (_, i) => {
  const cx = i * (VIEW_W / 12) + 18 * Math.sin(i * 2.1);
  const h = 290 + 110 * Math.abs(Math.sin(i * 0.9 + 1.2));
  const hw = 50 + 15 * Math.abs(Math.cos(i * 1.1 + 0.4));
  return { cx, h, hw };
});

export function ForestSilhouette() {
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
      aria-hidden
      className="relative h-[clamp(300px,40vw,540px)] w-full overflow-hidden"
      style={{
        // Oben creme (Zitat-Bereich), unten dunkel (Footer) — die Bäume gehen darüber hinweg.
        backgroundImage:
          "linear-gradient(to bottom, var(--color-cream-50) 0%, var(--color-cream-50) 42%, var(--color-night) 60%, var(--color-night) 100%)",
      }}
    >

      <svg
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
              d={fir(tr.cx, tr.h, tr.hw, GROUND - 6)}
            />
          ))}
        </g>
        {/* Vordere Reihe — dunkler, größer */}
        <g fill="#0a110d">
          {FRONT.map((tr, i) => (
            <path
              key={`f${i}`}
              className={treeClass}
              style={{ transitionDelay: `${120 + i * 55}ms` }}
              d={fir(tr.cx, tr.h, tr.hw)}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
