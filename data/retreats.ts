/**
 * Unsere aktuellen Unterkünfte — die zwei realen Airbnbs in Neuenbürg.
 * Daten + Fotos direkt aus den Airbnb-Inseraten übernommen.
 * Skaliert langfristig auf 10–20 Wohnungen.
 */
import type { Retreat } from '@/lib/booking/types';

/** Domänen-Retreat + präsentative Felder (Cover, Galerie, Highlight, Betten/Bad). */
export interface RetreatCard extends Retreat {
  image: string;        // Cover-Foto
  gallery: string[];    // Galerie für die Detailseite
  highlight: string;    // Eyebrow auf der Karte
  beds: number;
  bathrooms: number;
  rating?: string;      // z. B. "4,91"
  exclusive?: boolean;
}

const penthouseGallery = Array.from(
  { length: 9 },
  (_, i) => `/images/wohnungen/penthouse/${String(i + 1).padStart(2, '0')}.jpg`,
);
const fachwerkGallery = Array.from(
  { length: 9 },
  (_, i) => `/images/wohnungen/fachwerk/${String(i + 1).padStart(2, '0')}.jpg`,
);

export const retreats: RetreatCard[] = [
  {
    id: 'black-forest-penthouse',
    slug: 'black-forest-penthouse',
    name: 'Black Forest Penthouse',
    image: penthouseGallery[0],
    gallery: penthouseGallery,
    highlight: 'Penthouse · Blick aufs Schloss',
    exclusive: true,
    rating: '4,91',
    shortDescription:
      'Charaktervolles Penthouse unterm Dach mit Terrasse und Blick auf Schloss Neuenbürg.',
    description:
      'Hochwertig renoviertes Penthouse mit zwei Mezzanin-Schlafzimmern unter dem Dach, moderner Küche und großer Terrasse über der Enz. Sichtbare Holzbalken, rustikale Balkenbetten und feine Details — Siebträger-Maschine, Smart-TV mit Netflix und eine Marshall-Soundbox. Mitten im Schwarzwald, mit freiem Blick auf das Schloss Neuenbürg.',
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    cleaningFeeCents: 0,
    basePriceCents: 0,
    amenities: [
      'Große Terrasse',
      'Blick aufs Schloss',
      'Voll ausgestattete Küche',
      'Siebträger-Maschine',
      'Smart-TV & Netflix',
      'Marshall-Soundbox',
      'Schnelles WLAN & Arbeitsplatz',
      'Kostenlose Parkplätze',
    ],
    images: [],
    airbnbUrl: 'https://www.airbnb.de/rooms/1109938710053146548',
  },
  {
    id: 'fachwerk-apartment',
    slug: 'fachwerk-apartment',
    name: 'Fachwerk-Apartment',
    image: fachwerkGallery[0],
    gallery: fachwerkGallery,
    highlight: 'Fachwerk · Terrasse & Schlossblick',
    exclusive: true,
    shortDescription:
      'Echtes Fachwerk, viel warmes Holz und eine Dachterrasse mit Blick aufs Schloss.',
    description:
      'Stilvolles Apartment im historischen Fachwerkhaus — sichtbares Gebälk, Natursteinwände und warmes Holz. Zwei Schlafzimmer, ein privates Badezimmer und eine Dachterrasse über den Dächern von Neuenbürg mit freiem Blick auf das Schloss. Der ruhige Rückzugsort für zwei bis vier Gäste.',
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    cleaningFeeCents: 0,
    basePriceCents: 0,
    amenities: [
      'Dachterrasse',
      'Blick aufs Schloss',
      'Privates Badezimmer',
      'Voll ausgestattete Küche',
      'Sichtbares Fachwerk',
      'Kostenfreies WLAN',
    ],
    images: [],
    airbnbUrl: 'https://www.airbnb.de/rooms/1694207599638836907',
  },
];

export const getRetreat = (slug: string): RetreatCard | undefined =>
  retreats.find((r) => r.slug === slug);
