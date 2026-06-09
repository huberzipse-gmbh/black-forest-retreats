/**
 * Black Forest Retreats — Farb-Tokens (Single Source of Truth)
 *
 * ⚠️ ENTWURF — wird in der DESIGN-PHASE gemeinsam finalisiert.
 * Richtung laut Briefing: Wellness-Retreat, hochwertig, Schwarzwald —
 * dunkles Grün (Tannen/Moos), warme Brauntöne (Holz/Erde), cremige Neutraltöne.
 *
 * Regel (Agentur-Standard): In Screens NIE Hex-Werte hardcoden — immer über
 * diese Tokens (bzw. die in tailwind/globals.css gespiegelten CSS-Variablen).
 */

export const colors = {
  // Tiefstes Fast-Schwarz-Grün (Hero-/Dark-Bänder, Footer)
  night: '#0f1813',
  // Primär — Tannengrün (dunkel, edel)
  forest: {
    50: '#f1f5f2',
    100: '#dce7df',
    300: '#9bb4a3',
    500: '#3f5a48',
    700: '#2a3e31',
    800: '#22332a', // Gradient-Zwischenstufe
    900: '#1b2a21', // Haupt-Dunkelgrün (Hintergründe, Header)
  },
  // Sekundär — Holz/Erde (warmes Braun)
  bark: {
    100: '#e9ddd0',
    300: '#c8a98c',
    500: '#9c7a5b',
    700: '#6f513a',
    900: '#43301f',
  },
  // Neutral — Creme/Sand (Flächen, Text auf dunkel)
  cream: {
    50: '#faf7f1',
    100: '#f3ede2',
    300: '#ddd2c0',
    500: '#b8a98f',
  },
  // Akzent — gedämpftes Gold/Messing (CTAs, Premium-Details)
  brass: {
    300: '#d8bd85', // hell — Text/Eyebrow auf dunklem Grund
    400: '#c9a96a',
    600: '#a6863f',
  },
} as const;

export type ColorScale = keyof typeof colors;
