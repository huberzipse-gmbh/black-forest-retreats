import type { ReactNode } from "react";

type Variant = "solid" | "outlineLight" | "outlineDark";
type Size = "sm" | "md";

const BASE =
  "inline-flex items-center justify-center rounded-[3px] font-body font-semibold uppercase tracking-[0.18em] transition-colors duration-300 whitespace-nowrap";

const SIZES: Record<Size, string> = {
  sm: "px-5 py-2.5 text-[0.7rem]",
  md: "px-8 py-4 text-xs",
};

const VARIANTS: Record<Variant, string> = {
  solid: "bg-brass-400 text-night hover:bg-brass-300",
  outlineLight:
    "border border-cream-50/40 text-cream-50 hover:bg-cream-50 hover:text-night",
  outlineDark:
    "border border-forest-900/25 text-forest-900 hover:bg-forest-900 hover:text-cream-50",
};

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  ariaLabel?: string;
}

/** Präsentativer CTA. Mit `href` → <a>, sonst <button>. */
export function Button({
  children,
  href,
  variant = "solid",
  size = "md",
  className = "",
  ariaLabel,
}: ButtonProps) {
  const cls = `${BASE} ${SIZES[size]} ${VARIANTS[variant]} ${className}`;
  if (href) {
    return (
      <a href={href} aria-label={ariaLabel} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" aria-label={ariaLabel} className={cls}>
      {children}
    </button>
  );
}
