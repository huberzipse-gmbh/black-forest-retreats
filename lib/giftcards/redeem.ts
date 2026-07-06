'use server';

/**
 * Gutschein-Einlösung im Buchungsflow (Muster lib/booking/promo.ts):
 * eingelöster Code liegt im Cookie, der Saldo wird bei jeder Preisberechnung
 * serverseitig frisch aufgelöst — der Client rechnet nie selbst am Guthaben.
 */
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import { supabaseAdminConfigured } from '@/lib/supabase/env';
import { findGiftCardByCode } from './db';
import { GIFT_COOKIE } from './types';
import type { GiftCard } from './types';

const MAX_AGE = 60 * 60 * 24 * 30; // 30 Tage — genug für „später buchen".

/** Karte prüfen; abgelaufene Karten werden dabei lazily markiert. */
async function validateCard(card: GiftCard | null): Promise<GiftCard | null> {
  if (!card) return null;
  if (card.status === 'active' && card.expiresAt && new Date(card.expiresAt) < new Date()) {
    const admin = createAdminClient();
    await admin.from('gift_cards').update({ status: 'expired' }).eq('id', card.id);
    return null;
  }
  if (card.status !== 'active' || card.balanceCents <= 0) return null;
  return card;
}

export interface ApplyGiftResult {
  ok: boolean;
  code?: string;
  balanceCents?: number;
  error?: 'invalid' | 'not-configured';
}

/** Code prüfen und bei Erfolg als Cookie merken. */
export async function applyGiftCode(raw: string): Promise<ApplyGiftResult> {
  if (!supabaseAdminConfigured()) return { ok: false, error: 'not-configured' };
  const code = raw.trim().toUpperCase();
  if (!code || code.length > 40) return { ok: false, error: 'invalid' };

  // gift_cards ist RLS-geschützt ohne Policies → Lookup nur via Service-Role.
  const card = await validateCard(await findGiftCardByCode(createAdminClient(), code));
  if (!card) return { ok: false, error: 'invalid' };

  const store = await cookies();
  store.set(GIFT_COOKIE, card.code, { maxAge: MAX_AGE, sameSite: 'lax' });
  return { ok: true, code: card.code, balanceCents: card.balanceCents };
}

/** Eingelösten Code entfernen. */
export async function removeGiftCode(): Promise<void> {
  const store = await cookies();
  store.delete(GIFT_COOKIE);
}

/** Gemerkten Code lesen (Auflösung passiert in resolveGiftCard). */
export async function getStoredGiftCode(): Promise<string | null> {
  const store = await cookies();
  return store.get(GIFT_COOKIE)?.value ?? null;
}

/**
 * Code serverseitig auflösen → Eingabe für computeQuote (oder null).
 * Wird von Buchungsseiten UND createBooking genutzt — der Server ist die
 * einzige Wahrheit über das Guthaben.
 */
export async function resolveGiftCard(
  code: string | null,
): Promise<{ id: string; code: string; balanceCents: number } | null> {
  if (!code || !supabaseAdminConfigured()) return null;
  try {
    const card = await validateCard(await findGiftCardByCode(createAdminClient(), code));
    return card ? { id: card.id, code: card.code, balanceCents: card.balanceCents } : null;
  } catch {
    return null;
  }
}
