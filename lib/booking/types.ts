/**
 * Black Forest Retreats — Buchungs-Domäne (Typen).
 * Skelett für die Kernlogik: Verfügbarkeit, Preisberechnung, Rabatte (u. a.
 * QR-Code-Direktbucher-Rabatt). Implementierung folgt nach der Design-Phase.
 */

/** Eine buchbare Unterkunft (Wohnung/Retreat). Skaliert auf 10–20 Einheiten. */
export interface Retreat {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  maxGuests: number;
  bedrooms: number;
  /** Basis-Übernachtungspreis in Cent (EUR). */
  basePriceCents: number;
  /** Reinigungsgebühr in Cent, einmalig pro Buchung. */
  cleaningFeeCents: number;
  amenities: string[];
  images: string[];
  /** Externe Airbnb-URL — für Preisvergleich „Direkt vs. Airbnb". */
  airbnbUrl?: string;
}

/** Belegung/Sperrzeit (aus iCal-Sync oder eigenen Buchungen). */
export interface AvailabilityBlock {
  retreatId: string;
  start: string; // ISO date
  end: string;   // ISO date (exklusiv)
  source: 'booking' | 'airbnb-ical' | 'manual';
}

/**
 * Rabattarten.
 * - `direct-qr`: Gast kommt über QR-Code in der Wohnung → Direktbucher-Rabatt.
 *   Macht das Buchen über uns statt über Airbnb attraktiv.
 * - `returning-guest`: Wiederkehrender Gast (E-Mail bekannt).
 * - `promo`: manueller Aktionscode.
 */
export type DiscountKind = 'direct-qr' | 'returning-guest' | 'promo';

export interface Discount {
  code: string;
  kind: DiscountKind;
  /** Prozentualer Nachlass (0–100) ODER fixer Betrag in Cent — genau eines. */
  percentOff?: number;
  amountOffCents?: number;
  retreatId?: string;      // optional auf eine Unterkunft beschränkt
  validFrom?: string;
  validUntil?: string;
  maxRedemptions?: number;
  active: boolean;
}

export interface PriceQuote {
  retreatId: string;
  nights: number;
  subtotalCents: number;
  cleaningFeeCents: number;
  discount?: { code: string; amountCents: number };
  totalCents: number;
  currency: 'EUR';
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Booking {
  id: string;
  retreatId: string;
  guestEmail: string;
  guestName: string;
  checkIn: string;  // ISO date
  checkOut: string; // ISO date
  guests: number;
  quote: PriceQuote;
  status: BookingStatus;
  stripePaymentIntentId?: string;
  createdAt: string;
}
