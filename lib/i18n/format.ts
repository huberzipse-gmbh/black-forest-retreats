import type { Locale } from "./config";

const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/**
 * Wandelt westliche Ziffern (0-9) in die locale-übliche Schreibweise.
 * - ar  → arabisch-indische Ziffern (٠١٢…), authentisch fürs Arabische.
 * - de/en/zh → unverändert (dort sind westliche Ziffern Standard).
 * Wirkt nur auf Ziffern-Zeichen, lässt Punkt/Komma/Text unangetastet.
 */
export function fmtNum(value: string | number, locale: Locale): string {
  const s = String(value);
  if (locale === "ar") return s.replace(/[0-9]/g, (d) => AR_DIGITS[Number(d)]);
  return s;
}
