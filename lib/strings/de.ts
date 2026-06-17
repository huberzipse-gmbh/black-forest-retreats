/**
 * Black Forest Retreats — Quell-Strings (Deutsch = Quellsprache).
 * Konvention: Alle nutzersichtbaren Texte hier ablegen, Zugriff nur über
 * useStrings(). Key-Schema: feature.section.element (camelCase-Blätter).
 * Übersetzen = diese Datei nach en.ts spiegeln.
 *
 * Ton: klar, direkt, hochwertig, persönlich — Gastgeber-Stimme (wir → du),
 * keine Floskeln. (Wording v1, wird noch überarbeitet.)
 */

export const de = {
  brand: {
    name: 'Black Forest Retreats',
    location: 'Neuenbürg',
    tagline: 'Der Schwarzwald, aber privat.',
  },
  // Locale-Formate (z. B. Dezimaltrennzeichen für Bewertungen wie „4,91").
  formats: { decimal: ',' },
  nav: {
    retreats: 'Unterkünfte',
    surroundings: 'Umgebung',
    gift: 'Gutschein',
    about: 'Über uns',
    book: 'Buchen',
    menu: 'Menü',
    close: 'Schließen',
  },
  booking: {
    cta: 'Direkt buchen',
    directBenefit: 'Direkt buchen & sparen',
    bookStay: 'Buche deinen Aufenthalt',
  },

  hero: {
    eyebrow: 'Schwarzwald · Neuenbürg',
    title: 'Erholung im Schwarzwald',
    subtitle:
      'Schön eingerichtete Ferienwohnungen mitten im Wald. Persönlich geführt und direkt bei uns am günstigsten.',
    scrollCue: 'Ansehen',
  },

  intro: {
    eyebrow: 'Über uns',
    title: 'Lieber direkt, lieber persönlich',
    text: 'Wir vermieten unsere Ferienwohnungen in Neuenbürg selbst, ohne Portal dazwischen. Das heißt für dich: bester Preis, ein echter Ansprechpartner und Tipps aus erster Hand.',
    features: [
      {
        title: 'Direkt buchen',
        text: 'Ohne Portal-Gebühren. Bei uns bist du immer am günstigsten.',
      },
      {
        title: 'Persönlich',
        text: 'Kein anonymes Hotel, sondern ein Gastgeber, der den Ort wirklich kennt.',
      },
      {
        title: 'Mitten im Wald',
        text: 'Tannen, Tal und Schloss Neuenbürg liegen direkt vor der Tür.',
      },
    ],
  },

  apartments: {
    eyebrow: 'Unterkünfte',
    title: 'Unsere Retreats',
    text: 'Jede Wohnung ist anders: mit Schlossblick, mit Blick auf den Fluss, immer mit einem Stück Schwarzwald. Schau, welche zu dir passt.',
    cta: 'Mehr ansehen',
    prev: 'Zurück',
    next: 'Weiter',
    exclusive: 'Exklusiv',
    comingSoon: 'Bald verfügbar',
    soldOut: {
      badge: 'Ausgebucht',
      until: (year: string) => `Ausgebucht bis ${year}`,
      featured: 'Sehr gefragt',
      detailTitle: 'Bis auf Weiteres ausgebucht',
      detailText: (year: string) =>
        `Diese Unterkunft ist bis ${year} vollständig ausgebucht. Schau dir gern unsere verfügbaren Wohnungen an.`,
      detailCta: 'Verfügbare Unterkünfte',
    },
    facts: {
      bedrooms: 'Schlafzimmer',
      beds: 'Betten',
      guests: 'Gäste',
      bathrooms: 'Bad',
    },
    detail: {
      back: 'Alle Unterkünfte',
      overview: 'Im Überblick',
      highlights: 'Das macht es besonders',
      about: 'Die Unterkunft',
      amenities: 'Ausstattung',
      gallery: 'Fotos',
      showAllPhotos: 'Alle Fotos ansehen',
      showAllAmenities: 'Gesamte Ausstattung anzeigen',
      showLess: 'Weniger anzeigen',
      reviewsTitle: 'Das sagen Gäste',
      reviewsCount: (n: number) => `${n} Bewertungen`,
      ratingLine: (rating: string, n: number) => `${rating} · ${n} Bewertungen`,
      guestFavorite: 'Gäste-Favorit',
      superhost: 'Superhost',
      bookTitle: 'Bereit für den Schwarzwald?',
      bookText: 'Sichere dir deine Tage in Neuenbürg, direkt und ohne Umweg.',
      book: 'Verfügbarkeit & Buchung',
      note: 'Buchung aktuell über Airbnb · Direktbuchung folgt',
    },
    // Meta-Vorlagen (Zahlen kommen aus data/retreats.ts)
    meta: (bedrooms: number, beds: number, guests: number) =>
      `${bedrooms} Schlafzimmer · ${beds} Betten · ${guests} Gäste`,
  },

  surroundings: {
    eyebrow: 'Die Umgebung',
    title: 'Was vor der Tür liegt',
    text: 'Gutes Essen, Natur und ein paar echte Schwarzwald-Klassiker, das meiste erreichst du in wenigen Minuten.',
    categories: {
      restaurants: {
        title: 'Restaurants',
        text: 'Vom Wirtshaus ums Eck bis zur Sterneküche.',
      },
      experiences: {
        title: 'Erlebnisse',
        text: 'Mit Alpakas wandern, Kajak auf der Enz, raus ins Tal.',
      },
      nature: {
        title: 'Natur & Wandern',
        text: 'Das Eyachtal, die Wildline-Hängebrücke und der Nationalpark.',
      },
      culture: {
        title: 'Kultur & Sehenswürdigkeiten',
        text: 'Schloss und Bergwerk Neuenbürg, der Gasometer, die Museen in Stuttgart.',
      },
      wellness: {
        title: 'Wellness & Thermen',
        text: 'Thermen und Spas zum Abschalten, gleich um die Ecke.',
      },
      regional: {
        title: 'Genuss & Regionales',
        text: 'Frische Forellen vom Erzeuger und echte Schwarzwald-Spezialitäten.',
      },
    },
    all: 'Alles entdecken',
    discover: 'Entdecken',
    hub: {
      eyebrow: 'Die Umgebung',
      title: 'Was vor der Tür liegt',
      text: 'Von der Sterneküche bis zum stillen Flusstal. Sechs Welten rund um Neuenbürg, das meiste in wenigen Minuten erreichbar.',
      highlights: 'Beliebt bei unseren Gästen',
      highlightsText: 'Was unsere Gäste am liebsten mögen. Pro Kategorie unsere klare Empfehlung.',
      categories: 'Alle Kategorien',
      categoriesText: 'Klapp auf, was dich interessiert, und stöbere in Ruhe.',
    },
    detail: {
      back: 'Zurück zur Umgebung',
      kicker: 'Umgebung',
    },
    accordion: {
      open: 'Aufklappen',
      close: 'Zuklappen',
      viewAll: (title: string) => `Alle ${title} ansehen`,
    },
    card: {
      michelin: 'Michelin',
      dayTrip: 'Tagesausflug',
      recommended: 'Unsere Empfehlung',
      soon: 'Infos folgen in Kürze',
      photo: 'Foto:',
    },
    filter: {
      aria: 'Nach Entfernung filtern',
      near: 'In der Nähe',
      mid: 'Etwas weiter',
      day: 'Tagesausflug',
      empty: 'Für diese Auswahl ist nichts dabei. Aktiviere einen weiteren Bereich.',
    },
  },

  facts: {
    eyebrow: 'Schwarzwald',
    fact1: {
      quote:
        'Die Römer nannten ihn „Silva Nigra": So dicht standen die Tannen, dass kaum Licht den Waldboden erreichte.\n\nDaher der Name: Schwarzwald.',
      source: 'Woher der Name kommt',
    },
    fact2: {
      quote:
        'Kuckucksuhr, Bollenhut, Kirschtorte: Der Schwarzwald hat ein Faible für Dinge, die Zeit und Handwerk brauchen.\n\nGut, dass du Zeit mitbringst.',
      source: 'Schwarzwald-Gefühl',
    },
  },

  gift: {
    eyebrow: 'Verschenken',
    title: 'Schwarzwald verschenken',
    text: 'Ein Gutschein für ein paar Tage im Schwarzwald. Frei wählbarer Wert, einlösbar für jede Wohnung, das ganze Jahr.',
    cta: 'Gutschein kaufen',
    trust: 'Sofort per E-Mail · 3 Jahre gültig · frei wählbarer Wert',
  },

  apartmentsPreview: {
    eyebrow: 'Unterkünfte',
    title: 'Deine Wellness-Oase im Schwarzwald',
    text: 'Such dir deine Ferienwohnung in Neuenbürg: Schlossblick, Tannen vorm Fenster, Ruhe inklusive.',
    cta: 'Unterkünfte ansehen & buchen',
  },

  park: {
    home: 'Unser Zuhause',
    name: 'Nationalpark Nordschwarzwald',
    tagline: 'Der Schwarzwald, aber privat.',
  },

  map: {
    eyebrow: 'Hier sind wir',
    title: 'Mitten im Nordschwarzwald',
    subtitle: 'Nationalpark Nordschwarzwald',
    marker: 'Neuenbürg',
  },

  footer: {
    tagline: 'Der Schwarzwald, aber privat. Ferienwohnungen in Neuenbürg.',
    discover: {
      title: 'Entdecken',
      links: ['Unterkünfte', 'Umgebung', 'Gutschein', 'Über uns'],
    },
    service: {
      title: 'Service',
      links: ['Anreise', 'Häufige Fragen', 'Stornierung', 'Kontakt'],
    },
    contact: {
      title: 'Kontakt',
      location: 'Neuenbürg · Nationalpark Nordschwarzwald',
      email: 'hallo@blackforestretreats.de',
      newsletterTitle: 'Newsletter',
      newsletterText: 'Ab und zu Post aus dem Schwarzwald: neue Wohnungen und leise Angebote. Nicht mehr.',
      newsletterPlaceholder: 'Deine E-Mail',
      newsletterCta: 'Abonnieren',
    },
    legal: ['Impressum', 'Datenschutz', 'AGB'],
    copyright: (year: number) => `© ${year} Black Forest Retreats`,
  },

  langSwitcher: {
    label: 'Sprache',
  },

  /**
   * Lokalisierbare Inhalte der Unterkünfte (Text raus aus data/retreats.ts).
   * Key = retreat.id. usps[] und reviews[] in DERSELBEN Reihenfolge wie im
   * data-File (Index-basiertes Mergen mit icon bzw. author).
   */
  retreatsContent: {
    'black-forest-penthouse': {
      name: 'Black Forest Penthouse',
      highlight: 'Penthouse · Blick aufs Schloss',
      tagline: 'Unser Beliebtestes',
      shortDescription:
        'Charaktervolles Penthouse unterm Dach mit Terrasse und Blick auf Schloss Neuenbürg.',
      description:
        'Hochwertig renoviertes Penthouse mit zwei Mezzanin-Schlafzimmern unter dem Dach, moderner Küche und großer Terrasse über der Enz. Sichtbare Holzbalken, rustikale Balkenbetten und feine Details: Siebträger-Maschine, Smart-TV mit Netflix und eine Marshall-Soundbox. Mitten im Schwarzwald, mit freiem Blick auf das Schloss Neuenbürg.',
      usps: [
        { title: 'Blick aufs Schloss', text: 'Vom Bett und der Terrasse direkt aufs Schloss Neuenbürg.' },
        { title: 'Check-in per Schlüsselbox', text: 'Komm an, wann du willst, ganz ohne Übergabe.' },
        { title: 'Kostenlose Parkplätze', text: 'Eine Seltenheit in der Gegend, bei uns inklusive.' },
        { title: 'Blitzsauber', text: 'Von Gästen immer wieder besonders gelobt.' },
      ],
      reviews: [
        { date: 'Mai 2025', text: 'Der Blick aufs Schloss vom Bett aus ist unbezahlbar. Alles blitzsauber, der Check-in über die Schlüsselbox total unkompliziert.' },
        { date: 'April 2025', text: 'Tom ist ein super Gastgeber, schnelle Antworten und tolle Tipps für die Gegend. Die Terrasse am Abend ein Traum.' },
        { date: 'März 2025', text: 'Stilvoll eingerichtet, ruhig und trotzdem zentral. Parkplatz direkt da. Wir kommen wieder!' },
      ],
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
    },
    'fachwerk-apartment': {
      name: 'Fachwerk-Apartment',
      highlight: 'Fachwerk · Terrasse & Schlossblick',
      tagline: 'Perfekt für Paare',
      shortDescription:
        'Echtes Fachwerk, viel warmes Holz und eine Dachterrasse mit Blick aufs Schloss.',
      description:
        'Stilvolles Apartment im historischen Fachwerkhaus: sichtbares Gebälk, Natursteinwände und warmes Holz. Zwei Schlafzimmer, ein privates Badezimmer und eine Dachterrasse über den Dächern von Neuenbürg mit freiem Blick auf das Schloss. Der ruhige Rückzugsort für zwei bis vier Gäste.',
      usps: [
        { title: 'Dachterrasse mit Schlossblick', text: 'Über den Dächern von Neuenbürg, das Schloss im Blick.' },
        { title: 'Echtes Fachwerk', text: 'Sichtbares Gebälk, Natursteinwände, warmes Holz.' },
        { title: 'Privates Badezimmer', text: 'Ganz für dich, modern ausgestattet.' },
        { title: 'Schnelles WLAN', text: 'Auch zum Arbeiten oder Streamen bestens geeignet.' },
      ],
      reviews: [
        { date: 'Mai 2025', text: 'Das Fachwerk mit den alten Balken hat so viel Charme. Dachterrasse mit Schlossblick, einfach Urlaub pur.' },
        { date: 'April 2025', text: 'Liebevoll eingerichtet, super sauber und ruhig gelegen. Perfekt für ein Wochenende im Schwarzwald.' },
        { date: 'Februar 2025', text: 'Sehr persönlicher Kontakt, alles hat reibungslos geklappt. Absolute Empfehlung.' },
      ],
      amenities: [
        'Dachterrasse',
        'Blick aufs Schloss',
        'Privates Badezimmer',
        'Voll ausgestattete Küche',
        'Sichtbares Fachwerk',
        'Kostenfreies WLAN',
      ],
    },
    riverhouse: {
      name: 'Riverhouse',
      highlight: 'Direkt am Fluss · Blick aufs Wasser',
      tagline: 'Für die ganze Familie',
      shortDescription:
        'Großzügiges Haus direkt an der Enz mit weitem Blick aufs Wasser.',
      description:
        'Ein weitläufiges Haus unmittelbar am Flussufer der Enz. Große Fensterfronten holen das Wasser ins Innere, dazu viel Platz für Familien und Gruppen. Eigener Zugang zum Ufer, ruhige Lage und der Klang des Flusses vor der Tür.',
      usps: [
        { title: 'Direkt am Fluss', text: 'Das Wasser rauscht vor der Tür, eigener Uferzugang inklusive.' },
        { title: 'Platz für 10 Gäste', text: 'Acht Schlafzimmer, ideal für Familien und Gruppen.' },
        { title: 'Großer Essbereich', text: 'Voll ausgestattete Küche und Tafel für alle.' },
        { title: 'Schnelles WLAN', text: 'Im ganzen Haus, auch fürs Homeoffice am See.' },
      ],
      reviews: [
        { date: 'August 2024', text: 'Direkt am Wasser einzuschlafen war herrlich. Viel Platz für die ganze Familie.' },
        { date: 'Juli 2024', text: 'Großzügig, hell und der Flussblick ist einmalig. Jederzeit wieder.' },
      ],
      amenities: [
        'Direkt am Fluss',
        'Blick aufs Wasser',
        'Eigener Uferzugang',
        'Voll ausgestattete Küche',
        'Großer Essbereich',
        'Schnelles WLAN',
      ],
    },
    'the-raccoon-house': {
      name: 'Raccoon House',
      highlight: 'Marktstraße 25 · Altstadt',
      tagline: 'Altstadt-Charme',
      shortDescription:
        'Charaktervolles Stadthaus in der Marktstraße 25, mitten in der Altstadt.',
      description:
        'Ein liebevoll hergerichtetes Stadthaus in der Marktstraße 25, direkt im historischen Kern von Neuenbürg. Knarrende Dielen, dicke Mauern und viel Charakter über mehrere Etagen. Cafés, Bäcker und das Schloss sind nur ein paar Schritte entfernt.',
      usps: [
        { title: 'Mitten in der Altstadt', text: 'Cafés, Bäcker und das Schloss sind nur ein paar Schritte weg.' },
        { title: 'Über mehrere Etagen', text: 'Viel Charakter und Raum in einem historischen Stadthaus.' },
        { title: 'Voll ausgestattete Küche', text: 'Zum Kochen wie zu Hause.' },
        { title: 'Kostenfreies WLAN', text: 'Schnell und stabil im ganzen Haus.' },
      ],
      reviews: [
        { date: 'Oktober 2024', text: 'Mitten in der Altstadt, charmantes Stadthaus über mehrere Etagen. Wir haben uns sofort wohlgefühlt.' },
        { date: 'September 2024', text: 'Perfekte Lage, alles fußläufig erreichbar. Schön und mit Liebe eingerichtet.' },
      ],
      amenities: [
        'Mitten in der Altstadt',
        'Über mehrere Etagen',
        'Historisches Stadthaus',
        'Voll ausgestattete Küche',
        'Kostenfreies WLAN',
      ],
    },
    'the-postal-office': {
      name: 'The Postal Office',
      highlight: 'Das alte Postamt · Im Herzen von Neuenbürg',
      tagline: 'Unser Herzstück',
      shortDescription:
        'Das ehrwürdige alte Postamt, großzügig umgebaut für große Gruppen.',
      description:
        'Das historische Postamt von Neuenbürg, mit viel Liebe zu einem außergewöhnlichen Refugium umgebaut. Hohe Decken, weite Räume und Platz für große Gruppen oder Feiern. Ein besonderer Ort mit Geschichte, mitten im Herzen der Stadt.',
      usps: [
        { title: 'Historisches Postamt', text: 'Ein besonderer Ort mit Geschichte, mitten in Neuenbürg.' },
        { title: 'Bis zu 20 Gäste', text: 'Zehn Schlafzimmer für große Gruppen und Feiern.' },
        { title: 'Hohe Decken & weite Räume', text: 'Großzügig wie kaum eine andere Unterkunft.' },
        { title: 'Großer Gemeinschaftsbereich', text: 'Zum gemeinsamen Kochen, Essen und Beisammensein.' },
      ],
      reviews: [
        { date: 'November 2024', text: 'Was für ein besonderes Haus! Hohe Decken, viel Platz, ideal für unsere große Gruppe.' },
        { date: 'September 2024', text: 'Geschichte zum Anfassen und richtig viel Raum. Ein echtes Erlebnis.' },
      ],
      amenities: [
        'Historisches Postamt',
        'Hohe Decken & weite Räume',
        'Ideal für große Gruppen',
        'Großer Gemeinschaftsbereich',
        'Voll ausgestattete Küche',
        'Schnelles WLAN',
      ],
    },
  } as Record<
    string,
    {
      name: string;
      highlight: string;
      tagline: string;
      shortDescription: string;
      description: string;
      usps: { title: string; text: string }[];
      reviews: { date: string; text: string }[];
      amenities: string[];
    }
  >,

  /**
   * Lokalisierbare Inhalte der Orte (Text raus aus data/surroundings.ts).
   * Key = place.id.
   */
  surroundingsContent: {
    'berlins-krone': {
      name: 'Berlins Krone',
      town: 'Bad Teinach',
      blurb:
        'Sternegekrönte Küche im Hotel Berlins KroneLamm. Der besondere Abend, wenn es etwas zu feiern gibt.',
      features: ['Michelin', 'Sterneküche', 'Fine Dining'],
    },
    'benders-birkenfeld': {
      name: 'Benders Birkenfeld',
      town: 'Birkenfeld',
      blurb:
        'Bodenständiger Familienbetrieb mit regionaler Küche, gleich um die Ecke.',
      features: ['Gutbürgerlich', 'Regional', 'Familienbetrieb'],
    },
    'arlinger-gaststaette': {
      name: 'Arlinger Gaststätte',
      town: 'Pforzheim',
      blurb: 'Bürgerliche Klassiker und eine schöne Terrasse für den Sommerabend.',
      features: ['Bürgerlich', 'Terrasse'],
    },
    'seehaus-pforzheim': {
      name: 'Seehaus',
      town: 'Pforzheim',
      blurb: 'Ausflugslokal am Wald, ideal nach einem Spaziergang.',
      features: ['Ausflugslokal', 'Am Wald'],
    },
    'foerstlich-weinbar': {
      name: 'Förstlich Weinbar',
      town: 'Langensteinbach',
      blurb: 'Weinbar mit Vesper und regionalen Tropfen für den entspannten Abend.',
      features: ['Weinbar', 'Vesper', 'Regionale Weine'],
    },
    'muellers-event-alm': {
      name: 'Müllers Eventalm',
      blurb: 'Deftige Alm-Stimmung mit großem Biergarten und Eventcharakter.',
      features: ['Alm', 'Biergarten', 'Event'],
    },
    'cafe-blaich': {
      name: 'Café Blaich',
      town: 'Höfen a.d. Enz',
      blurb:
        'Konditorei und Café seit 1954, hausgemachte Kuchen für den süßen Nachmittagsstopp.',
      features: ['Café', 'Konditorei', 'Seit 1954'],
    },
    'alpaka-wanderung': {
      name: 'Alpaka-Wanderung',
      town: 'Pforzheim',
      blurb: 'Geführte Tour mit den ruhigen Tieren durch Wald und Wiesen.',
      features: ['Geführt', 'Familie', '≈ 2 Std'],
    },
    'wildpark-pforzheim': {
      name: 'Wildpark Pforzheim',
      town: 'Pforzheim',
      blurb: 'Heimische Tiere hautnah, ein ganzjähriger Ausflug für die ganze Familie.',
      features: ['Tiere', 'Familie', 'Ganzjährig'],
    },
    'kajak-enz': {
      name: 'Kajaktour auf der Enz',
      town: 'Enztal',
      blurb: 'Aktiv auf dem Wasser durchs Tal. Verleih und Touren im Sommer.',
      features: ['Aktiv', 'Sommer', 'Verleih'],
    },
    fliegenfischen: {
      name: 'Fliegenfischen',
      town: 'Eyachtal',
      blurb: 'Geführte Kurse am klaren Wasser, Ruhe und Konzentration in der Natur.',
      features: ['Geführt', 'Kurs', 'Natur'],
    },
    minigolf: {
      name: 'Minigolf Neuenbürg',
      town: 'Neuenbürg',
      blurb: 'Der Klassiker für entspannte Stunden an der frischen Luft.',
      features: ['Familie', 'Draußen'],
    },
    freibad: {
      name: 'Freibad Neuenbürg',
      town: 'Neuenbürg',
      blurb: 'Abkühlung an heißen Tagen, entspannt und familienfreundlich.',
      features: ['Sommer', 'Familie'],
    },
    'ziegen-wanderung': {
      name: 'Ziegen-Wanderung',
      town: 'Straubenhardt',
      blurb: 'Unterwegs mit neugierigen Ziegen, ein Erlebnis besonders für Kinder.',
      features: ['Geführt', 'Für Kinder'],
    },
    'nationalpark-schwarzwald': {
      name: 'Nationalpark Schwarzwald',
      town: 'Ruhestein',
      blurb:
        'Urwald von morgen: weite Wege, Hochmoore und Gipfelblicke. Ein lohnender Tagesausflug.',
      features: ['Wandern', 'Aussicht', 'Tagesausflug'],
    },
    eyachtal: {
      name: 'Eyachtal',
      town: 'Eyachtal',
      blurb: 'Stilles Flusstal zum Wandern und Durchatmen, gleich in der Nähe.',
      features: ['Wandern', 'Fluss', 'Ruhig'],
    },
    'wildline-haengebruecke': {
      name: 'Wildline-Hängebrücke',
      town: 'Bad Wildbad',
      blurb:
        'Schwankende Brücke hoch über dem Tal, dazu der Baumwipfelpfad, Aussicht für die ganze Familie.',
      features: ['Aussicht', 'Familie', 'Baumwipfelpfad'],
    },
    'bergwerk-neuenburg': {
      name: 'Besucherbergwerk Frischglück',
      town: 'Neuenbürg',
      blurb:
        'Historisches Schaubergwerk samt Schloss Neuenbürg, mit Führungen und „Theater im Berg“, direkt vor der Haustür.',
      features: ['Historisch', 'Führung', 'Theater im Berg'],
    },
    'gasometer-pforzheim': {
      name: 'Gasometer Pforzheim',
      town: 'Pforzheim',
      blurb: 'Riesiges 360°-Panorama im alten Gasometer, ein Kunsterlebnis der besonderen Art.',
      features: ['Kunst', 'Panorama', 'Einzigartig'],
    },
    'porsche-museum': {
      name: 'Porsche Museum',
      town: 'Stuttgart',
      blurb: 'Sportwagen-Ikonen und kühne Architektur. Ein Tagesausflug für Technik-Fans.',
      features: ['Architektur', 'Tagesausflug'],
    },
    'mercedes-museum': {
      name: 'Mercedes-Benz Museum',
      town: 'Stuttgart',
      blurb: 'Über ein Jahrhundert Automobilgeschichte auf einer spiralförmigen Zeitreise.',
      features: ['Geschichte', 'Tagesausflug'],
    },
    wilhelma: {
      name: 'Wilhelma',
      town: 'Stuttgart',
      blurb: 'Zoologisch-botanischer Garten im maurischen Stil. Ein Tag für die ganze Familie.',
      features: ['Zoo & Botanik', 'Familie', 'Tagesausflug'],
    },
    'palais-thermal': {
      name: 'Palais Thermal',
      town: 'Bad Wildbad',
      blurb:
        'Historisches Thermalbad im maurischen Stil mit Saunalandschaft, der ruhige Tag ganz in der Nähe.',
      features: ['Historische Therme', 'Sauna'],
    },
    'siebentaeler-therme': {
      name: 'Siebentäler Therme',
      town: 'Bad Herrenalb',
      blurb: 'Warmes Thermalwasser und weite Saunalandschaft zum Loslassen.',
      features: ['Thermal', 'Sauna'],
    },
    'mineraltherme-teinach': {
      name: 'Mineraltherme',
      town: 'Bad Teinach',
      blurb: 'Heilwasser und Spa in ruhiger Lage, ideal zum Entschleunigen.',
      features: ['Heilwasser', 'Spa'],
    },
    'forellenzucht-zordel': {
      name: 'Forellenzucht Zordel',
      town: 'Eyachtal',
      blurb:
        'Frische Forellen direkt vom Erzeuger, geräuchert und zum Mitnehmen. Regional, wie es sein soll.',
      features: ['Frische Forellen', 'Räucherei', 'Verkauf'],
    },
  } as Record<
    string,
    { name: string; town?: string; blurb: string; features: string[] }
  >,
};

export type Strings = typeof de;
