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
    },
    detail: {
      back: 'Zurück zur Umgebung',
      kicker: 'Umgebung',
    },
    card: {
      michelin: 'Michelin',
      dayTrip: 'Tagesausflug',
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
} as const;

export type Strings = typeof de;
