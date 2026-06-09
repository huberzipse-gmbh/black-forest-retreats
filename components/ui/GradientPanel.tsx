import type { CSSProperties, ReactNode } from "react";

export type GradientVariant = "forest" | "moss" | "bark" | "night" | "cream";

const GRADIENTS: Record<GradientVariant, string> = {
  forest:
    "radial-gradient(125% 125% at 28% 18%, var(--color-forest-700), var(--color-forest-900) 55%, var(--color-night))",
  moss:
    "linear-gradient(155deg, var(--color-forest-500), var(--color-forest-800) 58%, var(--color-night))",
  bark:
    "linear-gradient(155deg, var(--color-bark-700), var(--color-bark-900) 62%, var(--color-night))",
  night:
    "radial-gradient(135% 135% at 72% 12%, var(--color-forest-800), var(--color-night) 58%, #0a110d)",
  cream:
    "linear-gradient(160deg, var(--color-cream-100), var(--color-cream-300))",
};

/** Dezente Höhenlinien-Textur (Schwarzwald-Anmutung), sehr niedrige Deckkraft. */
export function TopoPattern({ light = true }: { light?: boolean }) {
  return (
    <svg
      aria-hidden
      className={`absolute inset-0 h-full w-full ${light ? "text-cream-50" : "text-forest-900"}`}
      style={{ opacity: light ? 0.07 : 0.05 }}
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      {[0, 26, 52, 78, 104, 130, 156, 182].map((d) => (
        <path
          key={d}
          d={`M-20 ${120 + d} C 80 ${70 + d}, 150 ${170 + d}, 230 ${110 + d} S 400 ${90 + d}, 440 ${140 + d}`}
        />
      ))}
    </svg>
  );
}

interface GradientPanelProps {
  variant?: GradientVariant;
  monogram?: string;
  pattern?: boolean;
  vignette?: boolean;
  /** Fügt einen sanften Zoom bei Hover auf dem umgebenden `.group` hinzu. */
  zoomOnHover?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * Edler, foto-loser Platzhalter: geschichteter Verlauf + Grain + optionale
 * Höhenlinien + Monogramm-Wasserzeichen. Wird absolut in einen `relative`-Container
 * gelegt (z. B. `className="absolute inset-0"`). Später durch <Image> ersetzbar.
 */
export function GradientPanel({
  variant = "forest",
  monogram,
  pattern = false,
  vignette = false,
  zoomOnHover = false,
  className = "",
  style,
  children,
}: GradientPanelProps) {
  const light = variant !== "cream";

  return (
    <div className={`overflow-hidden ${className}`} style={style}>
      {/* Verlaufs-Ebene (zoombar) */}
      <div
        className={`absolute inset-0 ${
          zoomOnHover
            ? "transition-transform duration-[1200ms] ease-out group-hover:scale-[1.07]"
            : ""
        }`}
        style={{ backgroundImage: GRADIENTS[variant] }}
      />

      {pattern && <TopoPattern light={light} />}

      {monogram && (
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center font-display font-light leading-none text-brass-300"
          style={{ fontSize: "clamp(7rem, 18vw, 13rem)", opacity: 0.12 }}
        >
          {monogram}
        </span>
      )}

      {/* Grain */}
      <div className="bf-grain pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-soft-light" />

      {vignette && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/80 via-night/15 to-transparent" />
      )}

      {children && <div className="relative z-10 h-full">{children}</div>}
    </div>
  );
}
