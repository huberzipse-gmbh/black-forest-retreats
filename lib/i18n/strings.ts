/** Registry aller Sprach-Strings, nach Locale adressierbar. */
import { de } from '@/lib/strings/de';
import { en } from '@/lib/strings/en';
import { ar } from '@/lib/strings/ar';
import { zh } from '@/lib/strings/zh';
import type { Locale } from './config';
import type { Strings } from '@/lib/strings/de';

export const STRINGS: Record<Locale, Strings> = { de, en, ar, zh };
