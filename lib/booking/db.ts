/**
 * Row-Mapper + Lese-Helfer der Buchungs-Domäne (DB snake_case ↔ Domäne camelCase).
 * Schreibzugriffe laufen ausschließlich über Server Actions (Service-Role).
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Occupancy } from './conflicts';
import type {
  AvailabilityBlock,
  Booking,
  BookingSettings,
  PriceQuote,
  PriceRule,
} from './types';

/* eslint-disable @typescript-eslint/no-explicit-any */

export function mapPriceRule(r: any): PriceRule {
  return {
    id: r.id,
    retreatId: r.retreat_id,
    name: r.name,
    startDate: r.start_date,
    endDate: r.end_date,
    nightlyPriceCents: r.nightly_price_cents,
    discountAmountCents: r.discount_amount_cents,
    discountPercent: r.discount_percent != null ? Number(r.discount_percent) : null,
    active: r.active,
    createdAt: r.created_at,
  };
}

export function mapBlock(b: any): AvailabilityBlock {
  return {
    id: b.id,
    retreatId: b.retreat_id,
    start: b.start_date,
    end: b.end_date,
    source: b.source,
    bookingId: b.booking_id,
    note: b.note ?? '',
  };
}

export function mapSettings(s: any): BookingSettings {
  return {
    cancellationDays: s.cancellation_days,
    vatRate: Number(s.vat_rate),
    registeredDiscountPercent: Number(s.registered_discount_percent),
    payLaterWindowDays: s.pay_later_window_days,
    globalDiscount: {
      name: s.global_discount_name ?? '',
      amountCents: s.global_discount_amount_cents,
      percent: s.global_discount_percent != null ? Number(s.global_discount_percent) : null,
      active: s.global_discount_active,
    },
    // Solange Migration 0007 nicht eingespielt ist, bleibt der Code inaktiv.
    promo: {
      code: s.promo_code ?? '',
      percent: s.promo_percent != null ? Number(s.promo_percent) : 0,
      active: Boolean(s.promo_active),
    },
  };
}

export function mapBooking(b: any): Booking {
  return {
    id: b.id,
    bookingNumber: b.booking_number,
    retreatId: b.retreat_id,
    userId: b.user_id,
    guestEmail: b.guest_email,
    guestName: b.guest_name,
    checkIn: b.check_in,
    checkOut: b.check_out,
    adults: b.adults,
    children: b.children,
    infants: b.infants,
    status: b.status,
    paymentStatus: b.payment_status,
    paymentTiming: b.payment_timing,
    chargeDueDate: b.charge_due_date,
    quote: b.quote as PriceQuote,
    totalCents: b.total_cents,
    stripePaymentIntentId: b.stripe_payment_intent_id,
    stripeSetupIntentId: b.stripe_setup_intent_id,
    stripeCustomerId: b.stripe_customer_id,
    stripePaymentMethodId: b.stripe_payment_method_id,
    locale: b.locale,
    cancellationDays: b.cancellation_days,
    giftCardId: b.gift_card_id ?? null,
    giftCardAppliedCents: b.gift_card_applied_cents ?? 0,
    demo: b.demo,
    createdAt: b.created_at,
    confirmedAt: b.confirmed_at,
    cancelledAt: b.cancelled_at,
  };
}

/** Globale Einstellungen laden (Single Row id = 1). */
export async function fetchSettings(sb: SupabaseClient): Promise<BookingSettings> {
  const { data, error } = await sb.from('settings').select('*').eq('id', 1).single();
  if (error) throw error;
  return mapSettings(data);
}

/** Aktive Preisregeln einer Wohnung. */
export async function fetchPriceRules(sb: SupabaseClient, retreatId: string): Promise<PriceRule[]> {
  const { data, error } = await sb
    .from('price_rules')
    .select('*')
    .eq('retreat_id', retreatId)
    .eq('active', true);
  if (error) throw error;
  return (data ?? []).map(mapPriceRule);
}

/** Reservierungsfenster einer unbezahlten pending-Buchung. */
export const HOLD_MINUTES = 30;

/**
 * Hält diese Buchung ihren Zeitraum noch? Storniert = nein; unbezahlt und
 * älter als das Reservierungsfenster = nein (der Zeitraum wird wieder frei).
 * Spiegelbild von `release_expired_blocks()` in Migration 0015 — beide Seiten
 * müssen dieselbe Regel anwenden, sonst blockiert die DB Buchungen, die die
 * App für frei hält.
 */
export function bookingHoldsSlot(
  bk: { status: string; payment_status: string; created_at: string },
  now: number = Date.now(),
): boolean {
  if (bk.status === 'cancelled') return false;
  if (
    bk.status === 'pending' &&
    ['unpaid', 'awaiting_payment', 'failed'].includes(bk.payment_status)
  ) {
    return new Date(bk.created_at).getTime() > now - HOLD_MINUTES * 60 * 1000;
  }
  return true;
}

/**
 * Relevante Sperrzeiten einer Wohnung (ab heute). Verfallene pending-Buchungen
 * (unbezahlt, älter als 30 min) blockieren NICHT mehr.
 */
export async function fetchBlocks(sb: SupabaseClient, retreatId: string): Promise<AvailabilityBlock[]> {
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await sb
    .from('availability_blocks')
    .select('*, bookings(status, payment_status, created_at)')
    .eq('retreat_id', retreatId)
    .gte('end_date', today);
  if (error) throw error;

  return (data ?? [])
    .filter((b: any) => b.source !== 'booking' || !b.bookings || bookingHoldsSlot(b.bookings))
    .map(mapBlock);
}

/**
 * Alle aktiven Belegungen ab heute — Grundlage der Doppelbelegungs-Prüfung.
 *
 * Bewusst NICHT aus `availability_blocks` allein: eine bestätigte Buchung ist
 * auch dann vergeben, wenn ihr Block fehlt (z. B. weil eine späte Zahlung nach
 * Ablauf der Reservierung eintraf). Deshalb sind Buchungen hier die Quelle für
 * sich selbst; aus den Blöcken kommen nur Airbnb und manuelle Sperren.
 */
export async function fetchOccupancy(
  sb: SupabaseClient,
  retreatId?: string,
): Promise<Occupancy[]> {
  const today = new Date().toISOString().slice(0, 10);

  const bookingQuery = sb
    .from('bookings')
    .select('id, retreat_id, booking_number, guest_name, check_in, check_out, status, payment_status, created_at')
    .neq('status', 'cancelled')
    .gte('check_out', today);
  const blockQuery = sb
    .from('availability_blocks')
    .select('id, retreat_id, start_date, end_date, source, note')
    .in('source', ['airbnb-ical', 'manual'])
    .gte('end_date', today);
  if (retreatId) {
    bookingQuery.eq('retreat_id', retreatId);
    blockQuery.eq('retreat_id', retreatId);
  }

  const [bookings, blocks] = await Promise.all([bookingQuery, blockQuery]);
  if (bookings.error) throw bookings.error;
  if (blocks.error) throw blocks.error;

  const fromBookings: Occupancy[] = (bookings.data ?? [])
    .filter((b: any) => bookingHoldsSlot(b))
    .map((b: any) => ({
      retreatId: b.retreat_id,
      start: b.check_in,
      end: b.check_out,
      kind: 'booking' as const,
      label: `${b.booking_number} · ${b.guest_name}`,
      bookingId: b.id,
    }));

  const fromBlocks: Occupancy[] = (blocks.data ?? []).map((b: any) => ({
    retreatId: b.retreat_id,
    start: b.start_date,
    end: b.end_date,
    kind: b.source,
    label: b.note || (b.source === 'airbnb-ical' ? 'Airbnb-Belegung' : 'Gesperrt'),
    blockId: b.id,
  }));

  return [...fromBookings, ...fromBlocks];
}
