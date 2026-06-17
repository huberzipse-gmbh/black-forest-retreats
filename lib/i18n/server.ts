/**
 * Server-seitiger Locale-Zugriff (Cookie `NEXT_LOCALE`).
 * Nur in Server-Komponenten / generateMetadata verwenden.
 */
import { cookies } from 'next/headers';
import { STRINGS } from './strings';
import { isLocale, defaultLocale, type Locale } from './config';

export async function getLocale(): Promise<Locale> {
  const c = await cookies();
  const v = c.get('NEXT_LOCALE')?.value;
  return isLocale(v) ? v : defaultLocale;
}

export async function getStrings() {
  return STRINGS[await getLocale()];
}
