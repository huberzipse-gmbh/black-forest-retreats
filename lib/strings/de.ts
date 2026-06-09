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
    tagline: 'Ferienwohnungen im Schwarzwald. Direkt vom Gastgeber.',
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
    bookStay: 'Buchen Sie Ihren Aufenthalt',
  },

  hero: {
    eyebrow: 'Schwarzwald · Neuenbürg',
    title: 'Erholung im Schwarzwald',
    subtitle:
      'Schön eingerichtete Ferienwohnungen mitten im Wald. Persönlich geführt – und direkt bei uns am günstigsten.',
    scrollCue: 'Ansehen',
  },

  intro: {
    eyebrow: 'Über uns',
    title: 'Lieber direkt, lieber persönlich',
    text: 'Wir vermieten zwei Ferienwohnungen in Neuenbürg — selbst, ohne Portal dazwischen. Das heißt für dich: bester Preis, ein echter Ansprechpartner und Tipps aus erster Hand.',
    features: [
      {
        title: 'Direkt buchen',
        text: 'Ohne Portal-Gebühren. Bei uns bist du immer am günstigsten.',
      },
      {
        title: 'Persönlich',
        text: 'Kein anonymes Hotel — ein Gastgeber, der den Ort wirklich kennt.',
      },
      {
        title: 'Mitten im Wald',
        text: 'Tannen, Tal und Schloss Neuenbürg liegen direkt vor der Tür.',
      },
    ],
  },

  apartments: {
    eyebrow: 'Unterkünfte',
    title: 'Unsere Wohnungen',
    text: 'Jede Wohnung ist anders – von hell und weit bis klein und geborgen. Schau, was zu dir passt.',
    cta: 'Mehr ansehen',
    prev: 'Zurück',
    next: 'Weiter',
    exclusive: 'Exklusiv',
    comingSoon: 'Bald verfügbar',
    facts: {
      bedrooms: 'Schlafzimmer',
      beds: 'Betten',
      guests: 'Gäste',
      bathrooms: 'Bad',
    },
    detail: {
      back: 'Alle Unterkünfte',
      overview: 'Im Überblick',
      about: 'Die Unterkunft',
      amenities: 'Ausstattung',
      bookTitle: 'Bereit für den Schwarzwald?',
      bookText: 'Sichere dir deine Tage in Neuenbürg — direkt, ohne Umweg.',
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
    text: 'Gutes Essen, Natur und ein paar echte Schwarzwald-Klassiker – das meiste erreichst du in wenigen Minuten.',
    categories: {
      restaurants: {
        title: 'Restaurants',
        text: 'Bodenständige Wirtshäuser und ein paar richtig gute Adressen.',
      },
      experiences: {
        title: 'Erlebnisse',
        text: 'Touren, Manufakturen und kleine Auszeiten im Tal.',
      },
      nature: {
        title: 'Natur & Wandern',
        text: 'Das Enztal, Aussichtspunkte und die Wildline-Hängebrücke.',
      },
      culture: {
        title: 'Kultur & Sehenswürdigkeiten',
        text: 'Schloss Neuenbürg, Museen und die Goldstadt Pforzheim.',
      },
      wellness: {
        title: 'Wellness & Thermen',
        text: 'Thermen und Spas in der Nähe – für den ruhigen Tag.',
      },
      regional: {
        title: 'Genuss & Regionales',
        text: 'Hofläden, Brennereien und Schwarzwälder Spezialitäten.',
      },
    },
  },

  facts: {
    eyebrow: 'Schwarzwald',
    fact1: {
      quote:
        'Die Römer nannten ihn „Silva Nigra" — so dicht standen die Tannen, dass kaum Licht den Waldboden erreichte. Daher der Name: Schwarzwald.',
      source: 'Woher der Name kommt',
    },
    fact2: {
      quote:
        'Kuckucksuhr, Bollenhut, Kirschtorte — der Schwarzwald hat ein Faible für Dinge, die Zeit und Handwerk brauchen. Gut, dass du Zeit mitbringst.',
      source: 'Schwarzwald-Gefühl',
    },
  },

  gift: {
    eyebrow: 'Verschenken',
    title: 'Schwarzwald verschenken',
    text: 'Ein Gutschein für ein paar Tage im Schwarzwald. Frei wählbarer Wert, einlösbar für jede Wohnung – das ganze Jahr.',
    cta: 'Gutschein kaufen',
    trust: 'Sofort per E-Mail · 3 Jahre gültig · frei wählbarer Wert',
  },

  apartmentsPreview: {
    eyebrow: 'Unterkünfte',
    title: 'Deine Wohnung wartet',
    text: 'Zwei Wohnungen in Neuenbürg — beide mit Blick aufs Schloss.',
    cta: 'Unterkünfte ansehen & buchen',
  },

  footer: {
    tagline: 'Ferienwohnungen in Neuenbürg, direkt vom Gastgeber.',
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
      location: 'Neuenbürg, Schwarzwald',
      email: 'hallo@blackforestretreats.de',
      newsletterTitle: 'Newsletter',
      newsletterText: 'Neue Wohnungen und Angebote. Selten, nie Spam.',
      newsletterPlaceholder: 'Deine E-Mail',
      newsletterCta: 'Abonnieren',
    },
    legal: ['Impressum', 'Datenschutz', 'AGB'],
    copyright: (year: number) => `© ${year} Black Forest Retreats`,
  },
} as const;

export type Strings = typeof de;
