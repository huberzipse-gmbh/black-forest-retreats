/**
 * Black Forest Retreats — Typografie (Single Source of Truth)
 * Ziel: Schriften app-weit über EINEN Ort steuerbar — "ein Prompt ändert alles".
 *
 * ⚠️ ENTWURF — Pairing & Skala werden in der DESIGN-PHASE finalisiert.
 * Agentur-Default-Pairing: Fraunces (Display-Serif, warm/editorial — passt zu
 * Wellness/Retreat) + Plus Jakarta Sans (humanistische Text-Sans).
 *
 * Laden via next/font/google in app/layout.tsx; die hier definierten
 * fontFamily-Strings werden über CSS-Variablen (--font-display / --font-body)
 * gespiegelt. In Screens NIE fontFamily/fontSize/fontWeight hardcoden — immer
 * type.* nutzen.
 */

export const fonts = {
  display: 'var(--font-display)',      // Fraunces
  displayBold: 'var(--font-display)',
  body: 'var(--font-body)',            // Plus Jakarta Sans
  bodyMedium: 'var(--font-body)',
  bodySemiBold: 'var(--font-body)',
  bodyBold: 'var(--font-body)',
  bodyExtraBold: 'var(--font-body)',
} as const;

// Skala 1.25 (Major Third). Größere Schrift → engere Zeilenhöhe.
export const type = {
  display:   { fontFamily: fonts.display, fontSize: 40, lineHeight: 44, letterSpacing: -0.5 },
  h1:        { fontFamily: fonts.display, fontSize: 28, lineHeight: 34, letterSpacing: -0.3 },
  h2:        { fontFamily: fonts.display, fontSize: 20, lineHeight: 26 },
  h3:        { fontFamily: fonts.bodySemiBold, fontSize: 17, lineHeight: 23 },
  subtitle:  { fontFamily: fonts.bodyMedium, fontSize: 15, lineHeight: 22 },
  body:      { fontFamily: fonts.body, fontSize: 15, lineHeight: 22 },
  bodyStrong:{ fontFamily: fonts.bodySemiBold, fontSize: 15, lineHeight: 22 },
  label:     { fontFamily: fonts.bodySemiBold, fontSize: 13, lineHeight: 18 },
  caption:   { fontFamily: fonts.body, fontSize: 12, lineHeight: 16 },
  eyebrow:   { fontFamily: fonts.bodyBold, fontSize: 11, lineHeight: 14, letterSpacing: 1.5, textTransform: 'uppercase' as const },
} as const;

export type TypeRole = keyof typeof type;

/**
 * Web-Rollen als Tailwind-Klassen (fluid via clamp). Single Source of Truth für
 * die Website-Typo — die <Type>-Komponenten in components/ui/Type.tsx lesen NUR
 * von hier. Schriftwechsel/Skalierung = nur hier ändern.
 */
export const typeClass = {
  hero:       'font-display font-light text-[clamp(2.75rem,7vw,5.25rem)] leading-[1.04] tracking-[-0.02em]',
  display:    'font-display font-normal text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.08] tracking-[-0.015em]',
  h1:         'font-display font-normal text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-[-0.01em]',
  h2:         'font-display font-normal text-[clamp(1.5rem,2.6vw,2.1rem)] leading-[1.15] tracking-[-0.01em]',
  h3:         'font-display font-medium text-xl leading-snug',
  lead:       'font-body text-lg md:text-xl leading-relaxed',
  body:       'font-body text-base leading-relaxed',
  bodyStrong: 'font-body font-semibold text-base leading-relaxed',
  label:      'font-body font-medium text-sm',
  caption:    'font-body text-xs leading-snug',
  eyebrow:    'font-body text-xs font-semibold uppercase tracking-[0.22em]',
} as const;

export type TypeClassRole = keyof typeof typeClass;
