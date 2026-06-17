/**
 * English strings — mirror of de.ts with identical structure and keys.
 * Source of truth for structure: ./de. Translate values only, keep keys.
 *
 * Voice: clear, direct, warm host. We → you. No filler, no AI tells, no dashes.
 */
import type { Strings } from './de';

export const en: Strings = {
  brand: {
    name: 'Black Forest Retreats',
    location: 'Neuenbürg',
    tagline: 'The Black Forest, but private.',
  },
  formats: { decimal: '.' },
  nav: {
    retreats: 'Stays',
    surroundings: 'Surroundings',
    gift: 'Gift card',
    about: 'About us',
    book: 'Book',
    menu: 'Menu',
    close: 'Close',
  },
  booking: {
    cta: 'Book direct',
    directBenefit: 'Book direct & save',
    bookStay: 'Book your stay',
  },

  hero: {
    eyebrow: 'Black Forest · Neuenbürg',
    title: 'Time off in the Black Forest',
    subtitle:
      'Beautifully furnished holiday homes right in the woods. Personally run, and always cheapest when you book with us.',
    scrollCue: 'Take a look',
  },

  intro: {
    eyebrow: 'About us',
    title: 'Rather direct, rather personal',
    text: 'We rent out our holiday homes in Neuenbürg ourselves, with no platform in between. For you that means the best price, a real person to talk to, and tips straight from a local.',
    features: [
      {
        title: 'Book direct',
        text: 'No platform fees. With us you always pay the lowest price.',
      },
      {
        title: 'Personal',
        text: 'No anonymous hotel, just a host who truly knows the place.',
      },
      {
        title: 'Right in the woods',
        text: 'Fir trees, the valley and Schloss Neuenbürg are right outside the door.',
      },
    ],
  },

  apartments: {
    eyebrow: 'Stays',
    title: 'Our retreats',
    text: 'Every home is different: with a castle view, with a view of the river, always with a piece of the Black Forest. See which one suits you.',
    cta: 'See more',
    prev: 'Back',
    next: 'Next',
    exclusive: 'Exclusive',
    comingSoon: 'Coming soon',
    soldOut: {
      badge: 'Booked out',
      until: (year: string) => `Booked out until ${year}`,
      featured: 'In high demand',
      detailTitle: 'Booked out until further notice',
      detailText: (year: string) =>
        `This stay is fully booked until ${year}. Take a look at our available homes instead.`,
      detailCta: 'Available stays',
    },
    facts: {
      bedrooms: 'Bedrooms',
      beds: 'Beds',
      guests: 'Guests',
      bathrooms: 'Bath',
    },
    detail: {
      back: 'All stays',
      overview: 'At a glance',
      highlights: 'What makes it special',
      about: 'The stay',
      amenities: 'Amenities',
      gallery: 'Photos',
      showAllPhotos: 'See all photos',
      showAllAmenities: 'Show all amenities',
      showLess: 'Show less',
      reviewsTitle: 'What guests say',
      reviewsCount: (n: number) => `${n} reviews`,
      ratingLine: (rating: string, n: number) => `${rating} · ${n} reviews`,
      guestFavorite: 'Guest favourite',
      superhost: 'Superhost',
      bookTitle: 'Ready for the Black Forest?',
      bookText: 'Secure your days in Neuenbürg, direct and without detour.',
      book: 'Availability & booking',
      note: 'Currently booked via Airbnb · direct booking coming soon',
    },
    // Meta templates (numbers come from data/retreats.ts)
    meta: (bedrooms: number, beds: number, guests: number) =>
      `${bedrooms} bedrooms · ${beds} beds · ${guests} guests`,
  },

  surroundings: {
    eyebrow: 'The surroundings',
    title: 'What lies outside the door',
    text: 'Good food, nature and a few real Black Forest classics, most of it just minutes away.',
    categories: {
      restaurants: {
        title: 'Restaurants',
        text: 'From the tavern round the corner to starred cuisine.',
      },
      experiences: {
        title: 'Experiences',
        text: 'Hike with alpacas, kayak the Enz, head out into the valley.',
      },
      nature: {
        title: 'Nature & hiking',
        text: 'The Eyachtal, the Wildline suspension bridge and the national park.',
      },
      culture: {
        title: 'Culture & sights',
        text: 'The castle and mine in Neuenbürg, the Gasometer, the museums in Stuttgart.',
      },
      wellness: {
        title: 'Wellness & spas',
        text: 'Thermal baths and spas to switch off, right around the corner.',
      },
      regional: {
        title: 'Food & local',
        text: 'Fresh trout straight from the farm and real Black Forest specialities.',
      },
    },
    all: 'Discover everything',
    discover: 'Discover',
    hub: {
      eyebrow: 'The surroundings',
      title: 'What lies outside the door',
      text: 'From starred cuisine to a quiet river valley. Six worlds around Neuenbürg, most of them just minutes away.',
      highlights: 'Loved by our guests',
      highlightsText: 'What our guests like best. One clear recommendation per category.',
      categories: 'All categories',
      categoriesText: 'Open up whatever catches your eye and browse at your own pace.',
    },
    detail: {
      back: 'Back to the surroundings',
      kicker: 'Surroundings',
    },
    accordion: {
      open: 'Open up',
      close: 'Close',
      viewAll: (title: string) => `See all ${title}`,
    },
    card: {
      michelin: 'Michelin',
      dayTrip: 'Day trip',
      recommended: 'Our pick',
      soon: 'More info coming soon',
      photo: 'Photo:',
    },
    filter: {
      aria: 'Filter by distance',
      near: 'Nearby',
      mid: 'A bit further',
      day: 'Day trip',
      empty: 'Nothing here for this selection. Switch on another area.',
    },
  },

  facts: {
    eyebrow: 'Black Forest',
    fact1: {
      quote:
        'The Romans called it "Silva Nigra": the firs stood so dense that barely any light reached the forest floor.\n\nHence the name: Black Forest.',
      source: 'Where the name comes from',
    },
    fact2: {
      quote:
        'Cuckoo clock, Bollenhut, cherry cake: the Black Forest has a soft spot for things that take time and craft.\n\nGood thing you brought some time with you.',
      source: 'Black Forest feeling',
    },
  },

  gift: {
    eyebrow: 'Give a gift',
    title: 'Give the Black Forest',
    text: 'A gift card for a few days in the Black Forest. Choose the value freely, redeemable for any home, all year round.',
    cta: 'Buy a gift card',
    trust: 'Instant by email · valid for 3 years · free choice of value',
  },

  apartmentsPreview: {
    eyebrow: 'Stays',
    title: 'Your wellness oasis in the Black Forest',
    text: 'Find your holiday home in Neuenbürg: a castle view, fir trees at the window, quiet included.',
    cta: 'See stays & book',
  },

  park: {
    home: 'Our home',
    name: 'Nationalpark Nordschwarzwald',
    tagline: 'The Black Forest, but private.',
  },

  map: {
    eyebrow: "Here's where we are",
    title: 'Right in the Northern Black Forest',
    subtitle: 'Nationalpark Nordschwarzwald',
    marker: 'Neuenbürg',
  },

  footer: {
    tagline: 'The Black Forest, but private. Holiday homes in Neuenbürg.',
    discover: {
      title: 'Discover',
      links: ['Stays', 'Surroundings', 'Gift card', 'About us'],
    },
    service: {
      title: 'Service',
      links: ['Getting here', 'FAQ', 'Cancellation', 'Contact'],
    },
    contact: {
      title: 'Contact',
      location: 'Neuenbürg · Nationalpark Nordschwarzwald',
      email: 'hallo@blackforestretreats.de',
      newsletterTitle: 'Newsletter',
      newsletterText: 'Now and then a note from the Black Forest: new homes and quiet offers. Nothing more.',
      newsletterPlaceholder: 'Your email',
      newsletterCta: 'Subscribe',
    },
    legal: ['Imprint', 'Privacy', 'Terms'],
    copyright: (year: number) => `© ${year} Black Forest Retreats`,
  },

  langSwitcher: {
    label: 'Language',
  },

  /**
   * Localised stay content (text out of data/retreats.ts).
   * Key = retreat.id. usps[] and reviews[] in the SAME order as the data file.
   */
  retreatsContent: {
    'black-forest-penthouse': {
      name: 'Black Forest Penthouse',
      highlight: 'Penthouse · view of the castle',
      tagline: 'Our most loved',
      shortDescription:
        'Characterful penthouse under the eaves with a terrace and a view of Schloss Neuenbürg.',
      description:
        'A high-end renovated penthouse with two mezzanine bedrooms under the roof, a modern kitchen and a large terrace above the Enz. Exposed wooden beams, rustic beam beds and fine details: a portafilter machine, a smart TV with Netflix and a Marshall speaker. Right in the Black Forest, with a clear view of Schloss Neuenbürg.',
      usps: [
        { title: 'View of the castle', text: 'Look straight out at Schloss Neuenbürg from the bed and the terrace.' },
        { title: 'Check-in by key box', text: 'Arrive whenever you like, with no handover needed.' },
        { title: 'Free parking', text: 'A rarity in the area, included with us.' },
        { title: 'Spotlessly clean', text: 'Praised again and again by our guests.' },
      ],
      reviews: [
        { date: 'May 2025', text: 'The view of the castle from the bed is priceless. Everything spotless, and check-in via the key box was completely effortless.' },
        { date: 'April 2025', text: 'Tom is a great host, quick to reply and full of tips for the area. The terrace in the evening was a dream.' },
        { date: 'March 2025', text: 'Stylishly furnished, quiet and still central. Parking right there. We will be back!' },
      ],
      amenities: [
        'Large terrace',
        'View of the castle',
        'Fully equipped kitchen',
        'Portafilter machine',
        'Smart TV & Netflix',
        'Marshall speaker',
        'Fast Wi-Fi & workspace',
        'Free parking',
      ],
    },
    'fachwerk-apartment': {
      name: 'Fachwerk-Apartment',
      highlight: 'Timber frame · terrace & castle view',
      tagline: 'Perfect for couples',
      shortDescription:
        'Real timber framing, plenty of warm wood and a roof terrace with a view of the castle.',
      description:
        'A stylish apartment in a historic timber-framed house: exposed beams, natural stone walls and warm wood. Two bedrooms, a private bathroom and a roof terrace above the rooftops of Neuenbürg with a clear view of the castle. The quiet retreat for two to four guests.',
      usps: [
        { title: 'Roof terrace with castle view', text: 'Above the rooftops of Neuenbürg, the castle in view.' },
        { title: 'Real timber framing', text: 'Exposed beams, natural stone walls, warm wood.' },
        { title: 'Private bathroom', text: 'All yours, modern and well equipped.' },
        { title: 'Fast Wi-Fi', text: 'Great for working or streaming too.' },
      ],
      reviews: [
        { date: 'May 2025', text: 'The timber frame with its old beams has so much charm. Roof terrace with a castle view, simply a proper holiday.' },
        { date: 'April 2025', text: 'Lovingly furnished, super clean and in a quiet spot. Perfect for a weekend in the Black Forest.' },
        { date: 'February 2025', text: 'Very personal contact, everything went smoothly. Highly recommended.' },
      ],
      amenities: [
        'Roof terrace',
        'View of the castle',
        'Private bathroom',
        'Fully equipped kitchen',
        'Exposed timber framing',
        'Free Wi-Fi',
      ],
    },
    riverhouse: {
      name: 'Riverhouse',
      highlight: 'Right by the river · view of the water',
      tagline: 'For the whole family',
      shortDescription:
        'A spacious house right on the Enz with a wide view of the water.',
      description:
        'A roomy house right on the bank of the Enz. Large windows bring the water inside, with plenty of space for families and groups. Private access to the riverbank, a quiet setting and the sound of the river outside the door.',
      usps: [
        { title: 'Right by the river', text: 'The water flows past the door, with private bank access included.' },
        { title: 'Room for 10 guests', text: 'Eight bedrooms, ideal for families and groups.' },
        { title: 'Large dining area', text: 'A fully equipped kitchen and a table for everyone.' },
        { title: 'Fast Wi-Fi', text: 'Throughout the house, even for working by the water.' },
      ],
      reviews: [
        { date: 'August 2024', text: 'Falling asleep right by the water was wonderful. Plenty of room for the whole family.' },
        { date: 'July 2024', text: 'Spacious, bright and the river view is one of a kind. Any time again.' },
      ],
      amenities: [
        'Right by the river',
        'View of the water',
        'Private bank access',
        'Fully equipped kitchen',
        'Large dining area',
        'Fast Wi-Fi',
      ],
    },
    'the-raccoon-house': {
      name: 'Raccoon House',
      highlight: 'Marktstraße 25 · old town',
      tagline: 'Old-town charm',
      shortDescription:
        'A characterful town house at Marktstraße 25, right in the old town.',
      description:
        'A lovingly restored town house at Marktstraße 25, right in the historic heart of Neuenbürg. Creaking floorboards, thick walls and plenty of character across several floors. Cafés, bakeries and the castle are just a few steps away.',
      usps: [
        { title: 'Right in the old town', text: 'Cafés, bakeries and the castle are just a few steps away.' },
        { title: 'Across several floors', text: 'Plenty of character and space in a historic town house.' },
        { title: 'Fully equipped kitchen', text: 'Cook just like at home.' },
        { title: 'Free Wi-Fi', text: 'Fast and stable throughout the house.' },
      ],
      reviews: [
        { date: 'October 2024', text: 'Right in the old town, a charming town house over several floors. We felt at home straight away.' },
        { date: 'September 2024', text: 'Perfect location, everything within walking distance. Beautiful and furnished with love.' },
      ],
      amenities: [
        'Right in the old town',
        'Across several floors',
        'Historic town house',
        'Fully equipped kitchen',
        'Free Wi-Fi',
      ],
    },
    'the-postal-office': {
      name: 'The Postal Office',
      highlight: 'The old post office · in the heart of Neuenbürg',
      tagline: 'Our centrepiece',
      shortDescription:
        'The venerable old post office, generously converted for large groups.',
      description:
        'The historic post office of Neuenbürg, lovingly converted into an extraordinary retreat. High ceilings, wide rooms and space for large groups or celebrations. A special place with history, right in the heart of town.',
      usps: [
        { title: 'Historic post office', text: 'A special place with history, right in the heart of Neuenbürg.' },
        { title: 'Up to 20 guests', text: 'Ten bedrooms for large groups and celebrations.' },
        { title: 'High ceilings & wide rooms', text: 'Spacious like almost no other stay.' },
        { title: 'Large shared area', text: 'For cooking, eating and being together.' },
      ],
      reviews: [
        { date: 'November 2024', text: 'What a special house! High ceilings, lots of space, ideal for our large group.' },
        { date: 'September 2024', text: 'History you can touch and really plenty of room. A genuine highlight.' },
      ],
      amenities: [
        'Historic post office',
        'High ceilings & wide rooms',
        'Ideal for large groups',
        'Large shared area',
        'Fully equipped kitchen',
        'Fast Wi-Fi',
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
   * Localised place content (text out of data/surroundings.ts).
   * Key = place.id.
   */
  surroundingsContent: {
    'berlins-krone': {
      name: 'Berlins Krone',
      town: 'Bad Teinach',
      blurb:
        'Star-rated cuisine at Hotel Berlins KroneLamm. The special evening, for when there is something to celebrate.',
      features: ['Michelin', 'Starred cuisine', 'Fine dining'],
    },
    'benders-birkenfeld': {
      name: 'Benders Birkenfeld',
      town: 'Birkenfeld',
      blurb:
        'A down-to-earth family business with regional cooking, just around the corner.',
      features: ['Hearty fare', 'Regional', 'Family-run'],
    },
    'arlinger-gaststaette': {
      name: 'Arlinger Gaststätte',
      town: 'Pforzheim',
      blurb: 'Hearty classics and a lovely terrace for a summer evening.',
      features: ['Hearty', 'Terrace'],
    },
    'seehaus-pforzheim': {
      name: 'Seehaus',
      town: 'Pforzheim',
      blurb: 'A spot by the woods, ideal after a walk.',
      features: ['Day spot', 'By the woods'],
    },
    'foerstlich-weinbar': {
      name: 'Förstlich Weinbar',
      town: 'Langensteinbach',
      blurb: 'A wine bar with platters and regional pours for a relaxed evening.',
      features: ['Wine bar', 'Platters', 'Regional wines'],
    },
    'muellers-event-alm': {
      name: 'Müllers Eventalm',
      blurb: 'Hearty alpine-hut vibes with a large beer garden and an event feel.',
      features: ['Alpine hut', 'Beer garden', 'Events'],
    },
    'cafe-blaich': {
      name: 'Café Blaich',
      town: 'Höfen a.d. Enz',
      blurb:
        'A patisserie and café since 1954, with homemade cakes for a sweet afternoon stop.',
      features: ['Café', 'Patisserie', 'Since 1954'],
    },
    'alpaka-wanderung': {
      name: 'Alpaca hike',
      town: 'Pforzheim',
      blurb: 'A guided tour with these calm animals through woods and meadows.',
      features: ['Guided', 'Family', '≈ 2 hrs'],
    },
    'wildpark-pforzheim': {
      name: 'Wildpark Pforzheim',
      town: 'Pforzheim',
      blurb: 'Native animals up close, a year-round outing for the whole family.',
      features: ['Animals', 'Family', 'Year-round'],
    },
    'kajak-enz': {
      name: 'Kayak tour on the Enz',
      town: 'Enztal',
      blurb: 'Out on the water through the valley. Rentals and tours in summer.',
      features: ['Active', 'Summer', 'Rental'],
    },
    fliegenfischen: {
      name: 'Fly fishing',
      town: 'Eyachtal',
      blurb: 'Guided courses by clear water, calm and focus out in nature.',
      features: ['Guided', 'Course', 'Nature'],
    },
    minigolf: {
      name: 'Minigolf Neuenbürg',
      town: 'Neuenbürg',
      blurb: 'The classic for relaxed hours in the fresh air.',
      features: ['Family', 'Outdoors'],
    },
    freibad: {
      name: 'Freibad Neuenbürg',
      town: 'Neuenbürg',
      blurb: 'A cool-off on hot days, relaxed and family-friendly.',
      features: ['Summer', 'Family'],
    },
    'ziegen-wanderung': {
      name: 'Goat hike',
      town: 'Straubenhardt',
      blurb: 'Out and about with curious goats, an experience especially for kids.',
      features: ['Guided', 'For kids'],
    },
    'nationalpark-schwarzwald': {
      name: 'Nationalpark Schwarzwald',
      town: 'Ruhestein',
      blurb:
        'The wilderness of tomorrow: long trails, high moors and summit views. A rewarding day trip.',
      features: ['Hiking', 'Views', 'Day trip'],
    },
    eyachtal: {
      name: 'Eyachtal',
      town: 'Eyachtal',
      blurb: 'A quiet river valley for hiking and breathing deep, right nearby.',
      features: ['Hiking', 'River', 'Quiet'],
    },
    'wildline-haengebruecke': {
      name: 'Wildline suspension bridge',
      town: 'Bad Wildbad',
      blurb:
        'A swaying bridge high above the valley, plus the treetop walk, with views for the whole family.',
      features: ['Views', 'Family', 'Treetop walk'],
    },
    'bergwerk-neuenburg': {
      name: 'Besucherbergwerk Frischglück',
      town: 'Neuenbürg',
      blurb:
        'A historic show mine alongside Schloss Neuenbürg, with guided tours and "Theater im Berg", right on the doorstep.',
      features: ['Historic', 'Guided tour', 'Theater im Berg'],
    },
    'gasometer-pforzheim': {
      name: 'Gasometer Pforzheim',
      town: 'Pforzheim',
      blurb: 'A huge 360° panorama inside the old gasometer, an art experience like no other.',
      features: ['Art', 'Panorama', 'One of a kind'],
    },
    'porsche-museum': {
      name: 'Porsche Museum',
      town: 'Stuttgart',
      blurb: 'Sports-car icons and bold architecture. A day trip for fans of engineering.',
      features: ['Architecture', 'Day trip'],
    },
    'mercedes-museum': {
      name: 'Mercedes-Benz Museum',
      town: 'Stuttgart',
      blurb: 'Over a century of automotive history on a spiralling journey through time.',
      features: ['History', 'Day trip'],
    },
    wilhelma: {
      name: 'Wilhelma',
      town: 'Stuttgart',
      blurb: 'A zoological and botanical garden in Moorish style. A day for the whole family.',
      features: ['Zoo & botany', 'Family', 'Day trip'],
    },
    'palais-thermal': {
      name: 'Palais Thermal',
      town: 'Bad Wildbad',
      blurb:
        'A historic thermal bath in Moorish style with a sauna world, for a calm day close by.',
      features: ['Historic thermal bath', 'Sauna'],
    },
    'siebentaeler-therme': {
      name: 'Siebentäler Therme',
      town: 'Bad Herrenalb',
      blurb: 'Warm thermal water and a wide sauna world to let go.',
      features: ['Thermal', 'Sauna'],
    },
    'mineraltherme-teinach': {
      name: 'Mineraltherme',
      town: 'Bad Teinach',
      blurb: 'Healing water and a spa in a quiet setting, ideal for slowing down.',
      features: ['Healing water', 'Spa'],
    },
    'forellenzucht-zordel': {
      name: 'Forellenzucht Zordel',
      town: 'Eyachtal',
      blurb:
        'Fresh trout straight from the farm, smoked and ready to take home. Local, the way it should be.',
      features: ['Fresh trout', 'Smokehouse', 'Farm shop'],
    },
  } as Record<
    string,
    { name: string; town?: string; blurb: string; features: string[] }
  >,
};
