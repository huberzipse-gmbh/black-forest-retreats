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

export type SurroundingCategoryKey =
  | "restaurants"
  | "experiences"
  | "nature"
  | "culture"
  | "wellness"
  | "regional";

/** Entfernungs-Band ab Neuenbürg: near ≤15 km · mid 16–35 km · day >35 km. */
export type DistanceBand = "near" | "mid" | "day";

export interface Place {
  id: string;
  category: SurroundingCategoryKey;
  name: string;
  town?: string;
  /** Entfernung ab Neuenbürg in km. Daraus wird das Band abgeleitet. */
  distanceKm: number;
  /** 1–2 Sätze, kein „—"-Gedankenstrich. */
  blurb: string;
  /** Eigenschaften als Chips. */
  features: string[];
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
  website?: string;
  mapsUrl?: string;
  /** Echtes Foto (ersetzt den Mockup-Verlauf), z. B. "/images/umgebung/orte/xy.jpg". */
  image?: string;
  /** Dezente Quellenangabe zum Foto (urheberrechtskonform), z. B. "arlinger-restaurant.de". */
  imageCredit?: string;
  /** Inhalt noch in Klärung (Name/Ort/Details), Karte zeigt dezenten Hinweis. */
  tbd?: boolean;
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

export const surroundings: Place[] = [
  // ───────────────────────── Restaurants ─────────────────────────
  {
    id: "berlins-krone",
    category: "restaurants",
    name: "Berlins Krone",
    town: "Bad Teinach",
    distanceKm: 24,
    blurb:
      "Sternegekrönte Küche im Hotel Berlins KroneLamm. Der besondere Abend, wenn es etwas zu feiern gibt.",
    features: ["Michelin", "Sterneküche", "Fine Dining"],
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
    name: "Benders Birkenfeld",
    town: "Birkenfeld",
    distanceKm: 6,
    blurb:
      "Bodenständiger Familienbetrieb mit regionaler Küche, gleich um die Ecke.",
    features: ["Gutbürgerlich", "Regional", "Familienbetrieb"],
    variant: "night",
    monogram: "BB",
    image: "/images/umgebung/restaurants/benders.webp",
    imageCredit: "Benders Birkenfeld",
  },
  {
    id: "arlinger-gaststaette",
    category: "restaurants",
    name: "Arlinger Gaststätte",
    town: "Pforzheim",
    distanceKm: 14,
    blurb: "Bürgerliche Klassiker und eine schöne Terrasse für den Sommerabend.",
    features: ["Bürgerlich", "Terrasse"],
    variant: "night",
    monogram: "AG",
    image: "/images/umgebung/restaurants/arlinger.webp",
    imageCredit: "arlinger-restaurant.de",
  },
  {
    id: "seehaus-pforzheim",
    category: "restaurants",
    name: "Seehaus",
    town: "Pforzheim",
    distanceKm: 14,
    blurb: "Ausflugslokal am Wald, ideal nach einem Spaziergang.",
    features: ["Ausflugslokal", "Am Wald"],
    variant: "night",
    monogram: "SH",
    image: "/images/umgebung/restaurants/seehaus.webp",
    imageCredit: "seehauspforzheim.de",
  },
  {
    id: "foerstlich-weinbar",
    category: "restaurants",
    name: "Förstlich Weinbar",
    town: "Langensteinbach",
    distanceKm: 22,
    blurb: "Weinbar mit Vesper und regionalen Tropfen für den entspannten Abend.",
    features: ["Weinbar", "Vesper", "Regionale Weine"],
    variant: "night",
    monogram: "FW",
    image: "/images/umgebung/restaurants/foerstlich.webp",
    imageCredit: "foerstlich.de",
  },
  {
    id: "muellers-event-alm",
    category: "restaurants",
    name: "Müllers Eventalm",
    distanceKm: 15,
    blurb: "Deftige Alm-Stimmung mit großem Biergarten und Eventcharakter.",
    features: ["Alm", "Biergarten", "Event"],
    variant: "night",
    monogram: "ME",
    image: "/images/umgebung/restaurants/muellers.webp",
    imageCredit: "schwarzwald-tourismus.info",
  },
  {
    id: "cafe-blaich",
    category: "restaurants",
    name: "Café Blaich",
    town: "Höfen a.d. Enz",
    distanceKm: 8,
    blurb:
      "Konditorei und Café seit 1954, hausgemachte Kuchen für den süßen Nachmittagsstopp.",
    features: ["Café", "Konditorei", "Seit 1954"],
    variant: "night",
    monogram: "CB",
    image: "/images/umgebung/restaurants/cafe-blaich.webp",
    imageCredit: "tripadvisor.de",
  },

  // ───────────────────────── Erlebnisse ─────────────────────────
  {
    id: "alpaka-wanderung",
    category: "experiences",
    name: "Alpaka-Wanderung",
    town: "Pforzheim",
    distanceKm: 15,
    blurb: "Geführte Tour mit den ruhigen Tieren durch Wald und Wiesen.",
    features: ["Geführt", "Familie", "≈ 2 Std"],
    variant: "moss",
    icon: "alpaca",
    highlight: true,
    image: "/images/umgebung/experiences/alpaka.webp",
    imageCredit: "heckengaeu-hoefe.de",
  },
  {
    id: "wildpark-pforzheim",
    category: "experiences",
    name: "Wildpark Pforzheim",
    town: "Pforzheim",
    distanceKm: 14,
    blurb: "Heimische Tiere hautnah, ein ganzjähriger Ausflug für die ganze Familie.",
    features: ["Tiere", "Familie", "Ganzjährig"],
    variant: "moss",
    icon: "paw",
    highlight: true,
    image: "/images/umgebung/experiences/wildpark.webp",
    imageCredit: "pforzheim.de",
  },
  {
    id: "kajak-enz",
    category: "experiences",
    name: "Kajaktour auf der Enz",
    town: "Enztal",
    distanceKm: 10,
    blurb: "Aktiv auf dem Wasser durchs Tal. Verleih und Touren im Sommer.",
    features: ["Aktiv", "Sommer", "Verleih"],
    variant: "moss",
    icon: "kayak",
    highlight: true,
    image: "/images/umgebung/experiences/kajak.webp",
    imageCredit: "diezugvoegel.de",
  },
  {
    id: "fliegenfischen",
    category: "experiences",
    name: "Fliegenfischen",
    town: "Eyachtal",
    distanceKm: 10,
    blurb: "Geführte Kurse am klaren Wasser, Ruhe und Konzentration in der Natur.",
    features: ["Geführt", "Kurs", "Natur"],
    variant: "moss",
    icon: "flyfishing",
    image: "/images/umgebung/experiences/fliegenfischen.webp",
    imageCredit: "meinestadt.de",
  },
  {
    id: "minigolf",
    category: "experiences",
    name: "Minigolf Neuenbürg",
    town: "Neuenbürg",
    distanceKm: 2,
    blurb: "Der Klassiker für entspannte Stunden an der frischen Luft.",
    features: ["Familie", "Draußen"],
    variant: "moss",
    icon: "minigolf",
    image: "/images/umgebung/experiences/minigolf.webp",
    imageCredit: "neuenbuerg.de",
  },
  {
    id: "freibad",
    category: "experiences",
    name: "Freibad Neuenbürg",
    town: "Neuenbürg",
    distanceKm: 2,
    blurb: "Abkühlung an heißen Tagen, entspannt und familienfreundlich.",
    features: ["Sommer", "Familie"],
    variant: "moss",
    icon: "swim",
    image: "/images/umgebung/experiences/freibad.webp",
    imageCredit: "neuenbuerg.de",
  },
  {
    id: "ziegen-wanderung",
    category: "experiences",
    name: "Ziegen-Wanderung",
    town: "Straubenhardt",
    distanceKm: 15,
    blurb: "Unterwegs mit neugierigen Ziegen, ein Erlebnis besonders für Kinder.",
    features: ["Geführt", "Für Kinder"],
    variant: "moss",
    icon: "goat",
    image: "/images/umgebung/experiences/ziege.webp",
    imageCredit: "bnn.de",
  },

  // ───────────────────────── Natur & Wandern ─────────────────────────
  {
    id: "nationalpark-schwarzwald",
    category: "nature",
    name: "Nationalpark Schwarzwald",
    town: "Ruhestein",
    distanceKm: 50,
    blurb:
      "Urwald von morgen: weite Wege, Hochmoore und Gipfelblicke. Ein lohnender Tagesausflug.",
    features: ["Wandern", "Aussicht", "Tagesausflug"],
    variant: "forest",
    monogram: "NP",
    highlight: true,
    image: "/images/umgebung/nature/nationalpark.webp",
    imageCredit: "schwarzwaldplus.de",
  },
  {
    id: "eyachtal",
    category: "nature",
    name: "Eyachtal",
    town: "Eyachtal",
    distanceKm: 10,
    blurb: "Stilles Flusstal zum Wandern und Durchatmen, gleich in der Nähe.",
    features: ["Wandern", "Fluss", "Ruhig"],
    variant: "forest",
    monogram: "EY",
    image: "/images/umgebung/nature/eyachtal.webp",
    imageCredit: "nussbaum.de",
  },
  {
    id: "wildline-haengebruecke",
    category: "nature",
    name: "Wildline-Hängebrücke",
    town: "Bad Wildbad",
    distanceKm: 12,
    blurb:
      "Schwankende Brücke hoch über dem Tal, dazu der Baumwipfelpfad, Aussicht für die ganze Familie.",
    features: ["Aussicht", "Familie", "Baumwipfelpfad"],
    variant: "forest",
    monogram: "WL",
    image: "/images/umgebung/nature/wildline.webp",
    imageCredit: "bwegt.de",
  },

  // ───────────────────────── Kultur & Sehenswürdigkeiten ─────────────────────────
  {
    id: "bergwerk-neuenburg",
    category: "culture",
    name: "Besucherbergwerk Frischglück",
    town: "Neuenbürg",
    distanceKm: 2,
    blurb:
      "Historisches Schaubergwerk samt Schloss Neuenbürg, mit Führungen und „Theater im Berg“, direkt vor der Haustür.",
    features: ["Historisch", "Führung", "Theater im Berg"],
    variant: "night",
    monogram: "BF",
    highlight: true,
    image: "/images/umgebung/culture/bergwerk.webp",
    imageCredit: "frischglueck.de",
  },
  {
    id: "gasometer-pforzheim",
    category: "culture",
    name: "Gasometer Pforzheim",
    town: "Pforzheim",
    distanceKm: 14,
    blurb: "Riesiges 360°-Panorama im alten Gasometer, ein Kunsterlebnis der besonderen Art.",
    features: ["Kunst", "Panorama", "Einzigartig"],
    variant: "night",
    monogram: "GP",
    image: "/images/umgebung/culture/gasometer.webp",
    imageCredit: "gasometer-pforzheim.de",
  },
  {
    id: "porsche-museum",
    category: "culture",
    name: "Porsche Museum",
    town: "Stuttgart",
    distanceKm: 55,
    blurb: "Sportwagen-Ikonen und kühne Architektur. Ein Tagesausflug für Technik-Fans.",
    features: ["Architektur", "Tagesausflug"],
    variant: "night",
    monogram: "PM",
    image: "/images/umgebung/culture/porsche.webp",
    imageCredit: "stuttgart.de",
  },
  {
    id: "mercedes-museum",
    category: "culture",
    name: "Mercedes-Benz Museum",
    town: "Stuttgart",
    distanceKm: 58,
    blurb: "Über ein Jahrhundert Automobilgeschichte auf einer spiralförmigen Zeitreise.",
    features: ["Geschichte", "Tagesausflug"],
    variant: "night",
    monogram: "MB",
    image: "/images/umgebung/culture/mercedes.webp",
    imageCredit: "mercedes-benz.com",
  },
  {
    id: "wilhelma",
    category: "culture",
    name: "Wilhelma",
    town: "Stuttgart",
    distanceKm: 58,
    blurb: "Zoologisch-botanischer Garten im maurischen Stil. Ein Tag für die ganze Familie.",
    features: ["Zoo & Botanik", "Familie", "Tagesausflug"],
    variant: "night",
    monogram: "WI",
    image: "/images/umgebung/culture/wilhelma.webp",
    imageCredit: "wilhelma.de",
  },

  // ───────────────────────── Wellness & Thermen ─────────────────────────
  {
    id: "palais-thermal",
    category: "wellness",
    name: "Palais Thermal",
    town: "Bad Wildbad",
    distanceKm: 12,
    blurb:
      "Historisches Thermalbad im maurischen Stil mit Saunalandschaft, der ruhige Tag ganz in der Nähe.",
    features: ["Historische Therme", "Sauna"],
    variant: "forest",
    monogram: "PT",
    highlight: true,
    image: "/images/umgebung/wellness/palais-thermal.webp",
    imageCredit: "schwarzwaldplus.de",
  },
  {
    id: "siebentaeler-therme",
    category: "wellness",
    name: "Siebentäler Therme",
    town: "Bad Herrenalb",
    distanceKm: 20,
    blurb: "Warmes Thermalwasser und weite Saunalandschaft zum Loslassen.",
    features: ["Thermal", "Sauna"],
    variant: "forest",
    monogram: "ST",
    image: "/images/umgebung/wellness/siebentaeler.webp",
    imageCredit: "schwarzwald-geniessen.de",
  },
  {
    id: "mineraltherme-teinach",
    category: "wellness",
    name: "Mineraltherme",
    town: "Bad Teinach",
    distanceKm: 24,
    blurb: "Heilwasser und Spa in ruhiger Lage, ideal zum Entschleunigen.",
    features: ["Heilwasser", "Spa"],
    variant: "forest",
    monogram: "MT",
    image: "/images/umgebung/wellness/mineraltherme.webp",
    imageCredit: "hotel-therme-teinach.de",
  },

  // ───────────────────────── Genuss & Regionales ─────────────────────────
  {
    id: "forellenzucht-zordel",
    category: "regional",
    name: "Forellenzucht Zordel",
    town: "Eyachtal",
    distanceKm: 10,
    blurb:
      "Frische Forellen direkt vom Erzeuger, geräuchert und zum Mitnehmen. Regional, wie es sein soll.",
    features: ["Frische Forellen", "Räucherei", "Verkauf"],
    variant: "bark",
    monogram: "FZ",
    highlight: true,
    image: "/images/umgebung/regional/zordel.webp",
    imageCredit: "schwarzwald-tourismus.info",
  },
];

/** Band aus Entfernung ableiten. */
export const bandOf = (km: number): DistanceBand =>
  km <= 15 ? "near" : km <= 35 ? "mid" : "day";

export const placesByCategory = (key: SurroundingCategoryKey): Place[] =>
  surroundings.filter((p) => p.category === key);

export const highlightPlaces = (): Place[] =>
  surroundings.filter((p) => p.highlight);

export const isCategoryKey = (s: string): s is SurroundingCategoryKey =>
  (CATEGORY_ORDER as string[]).includes(s);
