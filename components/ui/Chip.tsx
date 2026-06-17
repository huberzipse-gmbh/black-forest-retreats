import type { ReactNode } from "react";

type ChipTone = "light" | "dark" | "brass";

const TONES: Record<ChipTone, string> = {
  // Auf dunklem Grund (Default der Umgebung-Seiten).
  light: "border-cream-50/20 text-cream-100/85",
  // Auf hellem (Creme-)Grund.
  dark: "border-forest-900/20 text-forest-700/85",
  // Akzent (z. B. Michelin).
  brass: "border-brass-400/50 text-brass-300",
};

interface ChipProps {
  children: ReactNode;
  tone?: ChipTone;
  /** Kleines vorangestelltes Element (z. B. Stern-SVG). */
  icon?: ReactNode;
  className?: string;
}

/** Eigenschaft-Pill (Feature/Property) im Marken-Look. */
export function Chip({ children, tone = "light", icon, className = "" }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-body text-xs font-medium ${TONES[tone]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}
