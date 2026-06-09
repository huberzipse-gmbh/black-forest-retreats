/**
 * useStrings() — zentraler Zugriff auf alle UI-Texte.
 * Aktuell nur Deutsch (Quellsprache). Weitere Locale = de.ts nach <locale>.ts
 * spiegeln und hier per Geräte-/Browser-Locale auswählen.
 */
import { de, type Strings } from '@/lib/strings/de';

export function useStrings(): Strings {
  // TODO: Locale-Detection (z. B. next/headers Accept-Language) sobald en.ts existiert.
  return de;
}
