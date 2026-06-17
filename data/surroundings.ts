/**
 * „Was vor der Tür liegt", Orte, Erlebnisse & Ausflüge rund um Neuenbürg.
 *
 * Single Source of Truth für die Umgebung-Unterseiten (Hub + Kategorie-Detail).
 * Skaliert beliebig: ein neues Ziel = ein `Place`-Objekt hier. Es erscheint
 * automatisch in Grid, Distanz-Filter und (falls Highlight) auf dem Hub.
 * Echte Fotos später über `image` ergänzen, ersetzt den Mockup-Verlauf.
 */
import type { GradientVariant } from "@/components/ui/GradientPanel";
import type { PlaceIconKey } from "@/components/sections/umgebung/PlaceIcons";
import type { Strings } from "@/lib/strings/de";

export type SurroundingCategoryKey =
  | "restaurants"
  | "experiences"
  | "nature"
  | "culture"
  | "wellness"
  | "regional";

/** Entfernungs-Band ab Neuenbürg: near ≤15 km · mid 16–35 km · day >35 km. */
export type DistanceBand = "near" | "mid" | "day";

/** Strukturelle Felder eines Ortes (sprachunabhängig). */
export interface PlaceStruct {
  id: string;
  category: SurroundingCategoryKey;
  /** Entfernung ab Neuenbürg in km. Daraus wird das Band abgeleitet. */
  distanceKm: number;
  /** Mockup-Verlauf (bis echtes Foto da ist). */
  variant: GradientVariant;
  /** Monogramm fürs Mockup (Initialen). */
  monogram?: string;
  /** Nur Erlebnisse: Icon-geführte Karte statt Mockup-Bild. */
  icon?: PlaceIconKey;
  /** Premium-Darstellung mit Stern-Badge. */
  michelin?: boolean;
  /** Als Highlight auf dem Hub zeigen. */
  highlight?: boolean;
  /** Unsere ausdrückliche Empfehlung der Kategorie (goldener Rand + Badge). Genau ein Ort je Kategorie. */
  recommended?: boolean;
  website?: string;
  mapsUrl?: string;
  /** Echtes Foto (ersetzt den Mockup-Verlauf), z. B. "/images/umgebung/orte/xy.jpg". */
  image?: string;
  /** Dezente Quellenangabe zum Foto (urheberrechtskonform), z. B. "arlinger-restaurant.de". */
  imageCredit?: string;
  /** Inhalt noch in Klärung (Name/Ort/Details), Karte zeigt dezenten Hinweis. */
  tbd?: boolean;
}

/** Vollständiger Ort (Struktur + lokalisierter Text) — die Form, die Komponenten konsumieren. */
export interface Place extends PlaceStruct {
  name: string;
  town?: string;
  blurb: string;
  features: string[];
}

/** Reihenfolge der Kategorien (Hub + Navigation). */
export const CATEGORY_ORDER: SurroundingCategoryKey[] = [
  "restaurants",
  "experiences",
  "nature",
  "culture",
  "wellness",
  "regional",
];

/** Pro Kategorie: Mockup-Verlauf, Default-Monogramm und Detail-Layout. */
export const CATEGORY_META: Record<
  SurroundingCategoryKey,
  { variant: GradientVariant; layout: "image" | "icon"; monogram: string }
> = {
  restaurants: { variant: "night", layout: "image", monogram: "R" },
  experiences: { variant: "moss", layout: "icon", monogram: "E" },
  nature: { variant: "forest", layout: "image", monogram: "N" },
  culture: { variant: "night", layout: "image", monogram: "K" },
  wellness: { variant: "forest", layout: "image", monogram: "W" },
  regional: { variant: "bark", layout: "image", monogram: "G" },
};

export const surroundings: PlaceStruct[] = [
  // ───────────────────────── Restaurants ─────────────────────────
  {
    id: "berlins-krone",
    category: "restaurants",
    distanceKm: 24,
    variant: "night",
    monogram: "BK",
    michelin: true,
    highlight: true,
    image: "/images/umgebung/restaurants/berlins-krone.webp",
    imageCredit: "kronelamm-schwarzwald.de",
  },
  {
    id: "benders-birkenfeld",
    category: "restaurants",
    distanceKm: 6,
    variant: "night",
    monogram: "BB",
    recommended: true,
    highlight: true,
    image: "/images/umgebung/restaurants/benders.webp",
    imageCredit: "Benders Birkenfeld",
    website: "https://benders-restaurant.de",
  },
  {
    id: "arlinger-gaststaette",
    category: "restaurants",
    distanceKm: 14,
    variant: "night",
    monogram: "AG",
    image: "/images/umgebung/restaurants/arlinger.webp",
    imageCredit: "arlinger-restaurant.de",
  },
  {
    id: "seehaus-pforzheim",
    category: "restaurants",
    distanceKm: 14,
    variant: "night",
    monogram: "SH",
    image: "/images/umgebung/restaurants/seehaus.webp",
    imageCredit: "seehauspforzheim.de",
  },
  {
    id: "foerstlich-weinbar",
    category: "restaurants",
    distanceKm: 22,
    variant: "night",
    monogram: "FW",
    image: "/images/umgebung/restaurants/foerstlich.webp",
    imageCredit: "foerstlich.de",
  },
  {
    id: "muellers-event-alm",
    category: "restaurants",
    distanceKm: 15,
    variant: "night",
    monogram: "ME",
    image: "/images/umgebung/restaurants/muellers.webp",
    imageCredit: "schwarzwald-tourismus.info",
  },
  {
    id: "cafe-blaich",
    category: "restaurants",
    distanceKm: 8,
    variant: "night",
    monogram: "CB",
    image: "/images/umgebung/restaurants/cafe-blaich.webp",
    imageCredit: "tripadvisor.de",
  },

  // ───────────────────────── Erlebnisse ─────────────────────────
  {
    id: "alpaka-wanderung",
    category: "experiences",
    distanceKm: 15,
    variant: "moss",
    icon: "alpaca",
    highlight: true,
    image: "/images/umgebung/experiences/alpaka.webp",
    imageCredit: "heckengaeu-hoefe.de",
  },
  {
    id: "wildpark-pforzheim",
    category: "experiences",
    distanceKm: 14,
    variant: "moss",
    icon: "paw",
    highlight: true,
    recommended: true,
    image: "/images/umgebung/experiences/wildpark.webp",
    imageCredit: "pforzheim.de",
  },
  {
    id: "kajak-enz",
    category: "experiences",
    distanceKm: 10,
    variant: "moss",
    icon: "kayak",
    highlight: true,
    image: "/images/umgebung/experiences/kajak.webp",
    imageCredit: "diezugvoegel.de",
  },
  {
    id: "fliegenfischen",
    category: "experiences",
    distanceKm: 10,
    variant: "moss",
    icon: "flyfishing",
    image: "/images/umgebung/experiences/fliegenfischen.webp",
    imageCredit: "meinestadt.de",
  },
  {
    id: "minigolf",
    category: "experiences",
    distanceKm: 2,
    variant: "moss",
    icon: "minigolf",
    image: "/images/umgebung/experiences/minigolf.webp",
    imageCredit: "neuenbuerg.de",
  },
  {
    id: "freibad",
    category: "experiences",
    distanceKm: 2,
    variant: "moss",
    icon: "swim",
    image: "/images/umgebung/experiences/freibad.webp",
    imageCredit: "neuenbuerg.de",
  },
  {
    id: "ziegen-wanderung",
    category: "experiences",
    distanceKm: 15,
    variant: "moss",
    icon: "goat",
    image: "/images/umgebung/experiences/ziege.webp",
    imageCredit: "bnn.de",
  },

  // ───────────────────────── Natur & Wandern ─────────────────────────
  {
    id: "nationalpark-schwarzwald",
    category: "nature",
    distanceKm: 50,
    variant: "forest",
    monogram: "NP",
    highlight: true,
    image: "/images/umgebung/nature/nationalpark.webp",
    imageCredit: "schwarzwaldplus.de",
  },
  {
    id: "eyachtal",
    category: "nature",
    distanceKm: 10,
    variant: "forest",
    monogram: "EY",
    image: "/images/umgebung/nature/eyachtal.webp",
    imageCredit: "nussbaum.de",
  },
  {
    id: "wildline-haengebruecke",
    category: "nature",
    distanceKm: 12,
    variant: "forest",
    monogram: "WL",
    recommended: true,
    highlight: true,
    image: "/images/umgebung/nature/wildline.webp",
    imageCredit: "bwegt.de",
  },

  // ───────────────────────── Kultur & Sehenswürdigkeiten ─────────────────────────
  {
    id: "bergwerk-neuenburg",
    category: "culture",
    distanceKm: 2,
    variant: "night",
    monogram: "BF",
    highlight: true,
    recommended: true,
    website: "https://www.neuenbuerg.de/freizeit-erlebnis/sehenswertes-in-um-neuenbuerg/besucherbergwerk",
    image: "/images/umgebung/culture/bergwerk.webp",
    imageCredit: "frischglueck.de",
  },
  {
    id: "gasometer-pforzheim",
    category: "culture",
    distanceKm: 14,
    variant: "night",
    monogram: "GP",
    image: "/images/umgebung/culture/gasometer.webp",
    imageCredit: "gasometer-pforzheim.de",
  },
  {
    id: "porsche-museum",
    category: "culture",
    distanceKm: 55,
    variant: "night",
    monogram: "PM",
    image: "/images/umgebung/culture/porsche.webp",
    imageCredit: "stuttgart.de",
  },
  {
    id: "mercedes-museum",
    category: "culture",
    distanceKm: 58,
    variant: "night",
    monogram: "MB",
    image: "/images/umgebung/culture/mercedes.webp",
    imageCredit: "mercedes-benz.com",
  },
  {
    id: "wilhelma",
    category: "culture",
    distanceKm: 58,
    variant: "night",
    monogram: "WI",
    image: "/images/umgebung/culture/wilhelma.webp",
    imageCredit: "wilhelma.de",
  },

  // ───────────────────────── Wellness & Thermen ─────────────────────────
  {
    id: "palais-thermal",
    category: "wellness",
    distanceKm: 12,
    variant: "forest",
    monogram: "PT",
    highlight: true,
    recommended: true,
    image: "/images/umgebung/wellness/palais-thermal.webp",
    imageCredit: "schwarzwaldplus.de",
  },
  {
    id: "siebentaeler-therme",
    category: "wellness",
    distanceKm: 20,
    variant: "forest",
    monogram: "ST",
    image: "/images/umgebung/wellness/siebentaeler.webp",
    imageCredit: "schwarzwald-geniessen.de",
  },
  {
    id: "mineraltherme-teinach",
    category: "wellness",
    distanceKm: 24,
    variant: "forest",
    monogram: "MT",
    image: "/images/umgebung/wellness/mineraltherme.webp",
    imageCredit: "hotel-therme-teinach.de",
  },

  // ───────────────────────── Genuss & Regionales ─────────────────────────
  {
    id: "forellenzucht-zordel",
    category: "regional",
    distanceKm: 10,
    variant: "bark",
    monogram: "FZ",
    highlight: true,
    recommended: true,
    image: "/images/umgebung/regional/zordel.webp",
    imageCredit: "schwarzwald-tourismus.info",
  },
];

/** Band aus Entfernung ableiten. */
export const bandOf = (km: number): DistanceBand =>
  km <= 15 ? "near" : km <= 35 ? "mid" : "day";

/** Struktur + lokalisierter Text → vollständiger Place. */
const mergePlace = (p: PlaceStruct, t: Strings): Place => {
  const c = t.surroundingsContent[p.id];
  return { ...p, name: c.name, town: c.town, blurb: c.blurb, features: c.features };
};

export const placesByCategory = (
  key: SurroundingCategoryKey,
  t: Strings,
): Place[] =>
  surroundings
    .filter((p) => p.category === key)
    // Unsere Empfehlung führt die Kategorie an.
    .sort((a, b) => Number(Boolean(b.recommended)) - Number(Boolean(a.recommended)))
    .map((p) => mergePlace(p, t));

export const highlightPlaces = (t: Strings): Place[] =>
  surroundings.filter((p) => p.highlight).map((p) => mergePlace(p, t));

/** Unsere Empfehlungen — ein Ort je Kategorie, sortiert nach Kategorie-Reihenfolge. */
export const recommendedPlaces = (t: Strings): Place[] =>
  CATEGORY_ORDER.map((key) =>
    surroundings.find((p) => p.category === key && p.recommended),
  )
    .filter((p): p is PlaceStruct => Boolean(p))
    .map((p) => mergePlace(p, t));

export const isCategoryKey = (s: string): s is SurroundingCategoryKey =>
  (CATEGORY_ORDER as string[]).includes(s);
