import type { MetadataRoute } from 'next';
import { retreatSlugs } from '@/data/retreats';
import { CATEGORY_ORDER } from '@/data/surroundings';
import { hreflang, localeHref, locales } from '@/lib/i18n/config';
import { SITE_URL } from '@/lib/seo/config';

/**
 * Sitemap über alle Sprachen.
 *
 * Jede Seite steht einmal pro Sprache drin, jeweils mit `alternates.languages`
 * über ALLE Sprachen inklusive sich selbst. Diese Rückverlinkung ist keine
 * Kür: fehlt sie, verwirft Google die hreflang-Angaben der Seite komplett.
 *
 * Rein transaktionale Strecken (Buchung, Konto, Admin) fehlen bewusst - sie
 * sind in robots.txt gesperrt und gehören nicht in den Index.
 */

/** Sprachneutrale Routen, die es in allen vier Sprachen gibt. */
const ROUTES = [
  { path: '/', priority: 1, changeFrequency: 'weekly' as const },
  { path: '/umgebung', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/event-location', priority: 0.6, changeFrequency: 'weekly' as const },
  ...CATEGORY_ORDER.map((key) => ({
    path: `/umgebung/${key}`,
    priority: 0.6,
    changeFrequency: 'monthly' as const,
  })),
  ...retreatSlugs.map((slug) => ({
    path: `/wohnungen/${slug}`,
    priority: 0.9,
    changeFrequency: 'weekly' as const,
  })),
  { path: '/impressum', priority: 0.2, changeFrequency: 'yearly' as const },
  { path: '/datenschutz', priority: 0.2, changeFrequency: 'yearly' as const },
  { path: '/agb', priority: 0.2, changeFrequency: 'yearly' as const },
  { path: '/widerruf', priority: 0.2, changeFrequency: 'yearly' as const },
];

/**
 * Rein deutschsprachige Ortsseiten (lokale Longtails). Kommen nur als deutsche
 * URL in die Sitemap - keine hreflang-Alternates, weil es keine Übersetzungen
 * gibt und lokale Ortssuchen ohnehin deutschsprachig sind.
 */
const GERMAN_ONLY_ROUTES = [
  { path: '/ferienwohnung-neuenbuerg', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/urlaub-enztal', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/ferienwohnung-bad-wildbad', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/anreise', priority: 0.5, changeFrequency: 'yearly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const multilingual = ROUTES.flatMap((route) =>
    locales.map((locale) => ({
      url: `${SITE_URL}${localeHref(route.path, locale)}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [hreflang[l], `${SITE_URL}${localeHref(route.path, l)}`]),
        ),
      },
    })),
  );

  const germanOnly = GERMAN_ONLY_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  return [...multilingual, ...germanOnly];
}
