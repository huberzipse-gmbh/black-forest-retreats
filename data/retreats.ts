/**
 * Unsere aktuellen Unterkünfte — die zwei realen Airbnbs in Neuenbürg.
 * Daten + Fotos direkt aus den Airbnb-Inseraten übernommen.
 * Skaliert langfristig auf 10–20 Wohnungen.
 */
import type { Retreat } from '@/lib/booking/types';
import type { GradientVariant } from '@/components/ui/GradientPanel';
import type { UspIconKey } from '@/components/sections/retreat/UspIcons';
import type { CardAccent } from '@/components/sections/ApartmentCard';

/** Domänen-Retreat + präsentative Felder (Cover, Galerie, Highlight, Betten/Bad). */
export interface RetreatCard extends Retreat {
  image: string;        // Cover-Foto ('' → Mockup-Verlauf, bis ein Foto da ist)
  gallery: string[];    // Galerie für die Detailseite
  highlight: string;    // Eyebrow auf der Karte
  beds: number;
  bathrooms: number;
  rating?: string;      // z. B. "4,91"
  reviewCount?: number; // Anzahl Bewertungen
  superhost?: boolean;
  guestFavorite?: boolean;
  /** Descriptor-Tag auf der Karte, z. B. „Unser Beliebtestes". */
  tagline?: string;
  /** Akzentfarbe für Rahmen + Tag (pro Unterkunft eine andere). */
  accent?: CardAccent;
  /** USP-Highlights (Icon + Titel) für den Überblick oben. */
  usps?: { icon: UspIconKey; title: string; text?: string }[];
  /** Gäste-Stimmen (kurz, positiv). */
  reviews?: { author: string; date: string; text: string }[];
  exclusive?: boolean;
  /** Ausgebucht-Unterkunft: blurred Bild + „Ausgebucht bis <Jahr>". */
  soldOut?: boolean;
  soldOutUntil?: string; // z. B. "2027"
  /** Besonders hervorgehoben (eigener Akzent), z. B. The Postal Office. */
  featured?: boolean;
  /** Mockup-Verlauf, solange kein echtes Foto (`image`) gesetzt ist. */
  variant?: GradientVariant;
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
    tagline: 'Unser Beliebtestes',
    accent: 'brass',
    rating: '4,91',
    reviewCount: 100,
    superhost: true,
    guestFavorite: true,
    usps: [
      { icon: 'castle', title: 'Blick aufs Schloss', text: 'Vom Bett und der Terrasse direkt aufs Schloss Neuenbürg.' },
      { icon: 'key', title: 'Check-in per Schlüsselbox', text: 'Komm an, wann du willst, ganz ohne Übergabe.' },
      { icon: 'parking', title: 'Kostenlose Parkplätze', text: 'Eine Seltenheit in der Gegend, bei uns inklusive.' },
      { icon: 'sparkle', title: 'Blitzsauber', text: 'Von Gästen immer wieder besonders gelobt.' },
    ],
    reviews: [
      { author: 'Sarah', date: 'Mai 2025', text: 'Der Blick aufs Schloss vom Bett aus ist unbezahlbar. Alles blitzsauber, der Check-in über die Schlüsselbox total unkompliziert.' },
      { author: 'Michael', date: 'April 2025', text: 'Tom ist ein super Gastgeber, schnelle Antworten und tolle Tipps für die Gegend. Die Terrasse am Abend ein Traum.' },
      { author: 'Jana', date: 'März 2025', text: 'Stilvoll eingerichtet, ruhig und trotzdem zentral. Parkplatz direkt da. Wir kommen wieder!' },
    ],
    shortDescription:
      'Charaktervolles Penthouse unterm Dach mit Terrasse und Blick auf Schloss Neuenbürg.',
    description:
      'Hochwertig renoviertes Penthouse mit zwei Mezzanin-Schlafzimmern unter dem Dach, moderner Küche und großer Terrasse über der Enz. Sichtbare Holzbalken, rustikale Balkenbetten und feine Details: Siebträger-Maschine, Smart-TV mit Netflix und eine Marshall-Soundbox. Mitten im Schwarzwald, mit freiem Blick auf das Schloss Neuenbürg.',
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
    tagline: 'Perfekt für Paare',
    accent: 'bark',
    rating: '4,89',
    reviewCount: 52,
    superhost: true,
    usps: [
      { icon: 'castle', title: 'Dachterrasse mit Schlossblick', text: 'Über den Dächern von Neuenbürg, das Schloss im Blick.' },
      { icon: 'beams', title: 'Echtes Fachwerk', text: 'Sichtbares Gebälk, Natursteinwände, warmes Holz.' },
      { icon: 'bath', title: 'Privates Badezimmer', text: 'Ganz für dich, modern ausgestattet.' },
      { icon: 'wifi', title: 'Schnelles WLAN', text: 'Auch zum Arbeiten oder Streamen bestens geeignet.' },
    ],
    reviews: [
      { author: 'Lena', date: 'Mai 2025', text: 'Das Fachwerk mit den alten Balken hat so viel Charme. Dachterrasse mit Schlossblick, einfach Urlaub pur.' },
      { author: 'Daniel', date: 'April 2025', text: 'Liebevoll eingerichtet, super sauber und ruhig gelegen. Perfekt für ein Wochenende im Schwarzwald.' },
      { author: 'Christine', date: 'Februar 2025', text: 'Sehr persönlicher Kontakt, alles hat reibungslos geklappt. Absolute Empfehlung.' },
    ],
    shortDescription:
      'Echtes Fachwerk, viel warmes Holz und eine Dachterrasse mit Blick aufs Schloss.',
    description:
      'Stilvolles Apartment im historischen Fachwerkhaus: sichtbares Gebälk, Natursteinwände und warmes Holz. Zwei Schlafzimmer, ein privates Badezimmer und eine Dachterrasse über den Dächern von Neuenbürg mit freiem Blick auf das Schloss. Der ruhige Rückzugsort für zwei bis vier Gäste.',
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

  // ── Weitere Häuser (ausgebucht); Foto wird per CSS geblurrt dargestellt. ──
  {
    id: 'riverhouse',
    slug: 'riverhouse',
    name: 'Riverhouse',
    image: '/images/wohnungen/riverhouse/01.webp',
    gallery: [],
    highlight: 'Direkt am Fluss · Blick aufs Wasser',
    variant: 'moss',
    soldOut: true,
    soldOutUntil: '2027',
    tagline: 'Für die ganze Familie',
    accent: 'forest',
    rating: '4,92',
    reviewCount: 38,
    usps: [
      { icon: 'waves', title: 'Direkt am Fluss', text: 'Das Wasser rauscht vor der Tür, eigener Uferzugang inklusive.' },
      { icon: 'group', title: 'Platz für 10 Gäste', text: 'Acht Schlafzimmer, ideal für Familien und Gruppen.' },
      { icon: 'kitchen', title: 'Großer Essbereich', text: 'Voll ausgestattete Küche und Tafel für alle.' },
      { icon: 'wifi', title: 'Schnelles WLAN', text: 'Im ganzen Haus, auch fürs Homeoffice am See.' },
    ],
    reviews: [
      { author: 'Familie K.', date: 'August 2024', text: 'Direkt am Wasser einzuschlafen war herrlich. Viel Platz für die ganze Familie.' },
      { author: 'Andreas', date: 'Juli 2024', text: 'Großzügig, hell und der Flussblick ist einmalig. Jederzeit wieder.' },
    ],
    shortDescription:
      'Großzügiges Haus direkt an der Enz mit weitem Blick aufs Wasser.',
    description:
      'Ein weitläufiges Haus unmittelbar am Flussufer der Enz. Große Fensterfronten holen das Wasser ins Innere, dazu viel Platz für Familien und Gruppen. Eigener Zugang zum Ufer, ruhige Lage und der Klang des Flusses vor der Tür.',
    maxGuests: 10,
    bedrooms: 8,
    beds: 8,
    bathrooms: 3,
    cleaningFeeCents: 0,
    basePriceCents: 0,
    amenities: [
      'Direkt am Fluss',
      'Blick aufs Wasser',
      'Eigener Uferzugang',
      'Voll ausgestattete Küche',
      'Großer Essbereich',
      'Schnelles WLAN',
    ],
    images: [],
  },
  {
    id: 'the-raccoon-house',
    slug: 'the-raccoon-house',
    name: 'The Raccoon House',
    image: '/images/wohnungen/raccoon-house/01.webp',
    gallery: [],
    highlight: 'Marktstraße 25 · Altstadt',
    variant: 'bark',
    soldOut: true,
    soldOutUntil: '2027',
    tagline: 'Altstadt-Charme',
    accent: 'caramel',
    rating: '4,85',
    reviewCount: 44,
    usps: [
      { icon: 'location', title: 'Mitten in der Altstadt', text: 'Cafés, Bäcker und das Schloss sind nur ein paar Schritte weg.' },
      { icon: 'stairs', title: 'Über mehrere Etagen', text: 'Viel Charakter und Raum in einem historischen Stadthaus.' },
      { icon: 'kitchen', title: 'Voll ausgestattete Küche', text: 'Zum Kochen wie zu Hause.' },
      { icon: 'wifi', title: 'Kostenfreies WLAN', text: 'Schnell und stabil im ganzen Haus.' },
    ],
    reviews: [
      { author: 'Petra', date: 'Oktober 2024', text: 'Mitten in der Altstadt, charmantes Stadthaus über mehrere Etagen. Wir haben uns sofort wohlgefühlt.' },
      { author: 'Thomas', date: 'September 2024', text: 'Perfekte Lage, alles fußläufig erreichbar. Schön und mit Liebe eingerichtet.' },
    ],
    shortDescription:
      'Charaktervolles Stadthaus in der Marktstraße 25, mitten in der Altstadt.',
    description:
      'Ein liebevoll hergerichtetes Stadthaus in der Marktstraße 25, direkt im historischen Kern von Neuenbürg. Knarrende Dielen, dicke Mauern und viel Charakter über mehrere Etagen. Cafés, Bäcker und das Schloss sind nur ein paar Schritte entfernt.',
    maxGuests: 6,
    bedrooms: 4,
    beds: 5,
    bathrooms: 2,
    cleaningFeeCents: 0,
    basePriceCents: 0,
    amenities: [
      'Mitten in der Altstadt',
      'Über mehrere Etagen',
      'Historisches Stadthaus',
      'Voll ausgestattete Küche',
      'Kostenfreies WLAN',
    ],
    images: [],
  },
  {
    id: 'the-postal-office',
    slug: 'the-postal-office',
    name: 'The Postal Office',
    image: '/images/wohnungen/postal-office/01.webp',
    gallery: [],
    highlight: 'Das alte Postamt · Im Herzen von Neuenbürg',
    variant: 'night',
    soldOut: true,
    soldOutUntil: '2028',
    tagline: 'Unser Herzstück',
    accent: 'gold',
    rating: '4,90',
    reviewCount: 26,
    usps: [
      { icon: 'building', title: 'Historisches Postamt', text: 'Ein besonderer Ort mit Geschichte, mitten in Neuenbürg.' },
      { icon: 'group', title: 'Bis zu 20 Gäste', text: 'Zehn Schlafzimmer für große Gruppen und Feiern.' },
      { icon: 'arch', title: 'Hohe Decken & weite Räume', text: 'Großzügig wie kaum eine andere Unterkunft.' },
      { icon: 'kitchen', title: 'Großer Gemeinschaftsbereich', text: 'Zum gemeinsamen Kochen, Essen und Beisammensein.' },
    ],
    reviews: [
      { author: 'Markus', date: 'November 2024', text: 'Was für ein besonderes Haus! Hohe Decken, viel Platz, ideal für unsere große Gruppe.' },
      { author: 'Verein H.', date: 'September 2024', text: 'Geschichte zum Anfassen und richtig viel Raum. Ein echtes Erlebnis.' },
    ],
    shortDescription:
      'Das ehrwürdige alte Postamt, großzügig umgebaut für große Gruppen.',
    description:
      'Das historische Postamt von Neuenbürg, mit viel Liebe zu einem außergewöhnlichen Refugium umgebaut. Hohe Decken, weite Räume und Platz für große Gruppen oder Feiern. Ein besonderer Ort mit Geschichte, mitten im Herzen der Stadt.',
    maxGuests: 20,
    bedrooms: 10,
    beds: 15,
    bathrooms: 5,
    cleaningFeeCents: 0,
    basePriceCents: 0,
    amenities: [
      'Historisches Postamt',
      'Hohe Decken & weite Räume',
      'Ideal für große Gruppen',
      'Großer Gemeinschaftsbereich',
      'Voll ausgestattete Küche',
      'Schnelles WLAN',
    ],
    images: [],
  },
];

export const getRetreat = (slug: string): RetreatCard | undefined =>
  retreats.find((r) => r.slug === slug);
