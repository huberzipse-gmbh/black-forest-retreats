/**
 * Row-Mapper + Lese-Helfer der Gutschein-Domäne (snake_case ↔ camelCase).
 * Schreibzugriffe laufen ausschließlich über Server Actions (Service-Role).
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { GiftCard } from './types';

/* eslint-disable @typescript-eslint/no-explicit-any */

export function mapGiftCard(g: any): GiftCard {
  return {
    id: g.id,
    code: g.code,
    amountCents: g.amount_cents,
    balanceCents: g.balance_cents,
    currency: g.currency,
    buyerName: g.buyer_name,
    buyerEmail: g.buyer_email,
    recipientName: g.recipient_name,
    message: g.message ?? '',
    status: g.status,
    stripePaymentIntentId: g.stripe_payment_intent_id,
    downloadToken: g.download_token,
    elementIcon: g.element_icon,
    locale: g.locale,
    demo: g.demo,
    createdAt: g.created_at,
    paidAt: g.paid_at,
    expiresAt: g.expires_at,
  };
}

export async function loadGiftCard(sb: SupabaseClient, id: string): Promise<GiftCard | null> {
  const { data } = await sb.from('gift_cards').select('*').eq('id', id).maybeSingle();
  return data ? mapGiftCard(data) : null;
}

/** Karte per Code finden (case-insensitiv, getrimmt). */
export async function findGiftCardByCode(sb: SupabaseClient, code: string): Promise<GiftCard | null> {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return null;
  const { data } = await sb
    .from('gift_cards')
    .select('*')
    .ilike('code', normalized)
    .maybeSingle();
  return data ? mapGiftCard(data) : null;
}
