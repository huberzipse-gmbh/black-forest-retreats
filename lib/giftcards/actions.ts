'use server';

/**
 * Server Actions des Gutschein-Kaufflows. Struktur-Kopie des Buchungsflows:
 * pending-Row → PaymentIntent (metadata.gift_card_id) → Webhook/Demo →
 * markGiftCardPaid → Mail mit PDF.
 */
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { supabaseAdminConfigured } from '@/lib/supabase/env';
import { getLocale } from '@/lib/i18n/server';
import { getPaymentProvider, paymentMode } from '@/lib/payments';
import { getStripe } from '@/lib/payments/stripe';
import { generateGiftCode } from './code';
import { loadGiftCard, mapGiftCard } from './db';
import { markGiftCardPaid } from './confirm';
import {
  GIFT_MAX_CENTS,
  GIFT_MESSAGE_MAX,
  GIFT_MIN_CENTS,
  type GiftCard,
} from './types';

const createGiftCardSchema = z.object({
  amountCents: z.number().int().min(GIFT_MIN_CENTS).max(GIFT_MAX_CENTS),
  buyerName: z.string().trim().min(2).max(80),
  buyerEmail: z.string().trim().email().max(200),
  recipientName: z.string().trim().min(2).max(80),
  message: z.string().trim().max(GIFT_MESSAGE_MAX).optional().default(''),
  elementIcon: z.enum(['hut', 'uhr', 'kirschtorte', 'schinken']).optional().default('hut'),
});

export type CreateGiftCardInput = z.input<typeof createGiftCardSchema>;

export interface CreateGiftCardResult {
  ok: boolean;
  error?: 'not-configured' | 'invalid' | 'generic';
  giftCardId?: string;
}

/** Gutschein-Bestellung anlegen (pending, unbezahlt). */
export async function createGiftCardOrder(raw: CreateGiftCardInput): Promise<CreateGiftCardResult> {
  if (!supabaseAdminConfigured()) return { ok: false, error: 'not-configured' };

  const parsed = createGiftCardSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: 'invalid' };
  const input = parsed.data;

  try {
    const admin = createAdminClient();
    const locale = await getLocale();

    // Code-Kollision (unique constraint) ist extrem unwahrscheinlich → Retry.
    for (let attempt = 0; attempt < 3; attempt++) {
      const { data, error } = await admin
        .from('gift_cards')
        .insert({
          code: generateGiftCode(),
          amount_cents: input.amountCents,
          balance_cents: input.amountCents,
          buyer_name: input.buyerName,
          buyer_email: input.buyerEmail,
          recipient_name: input.recipientName,
          message: input.message || null,
          element_icon: input.elementIcon,
          status: 'pending',
          locale,
          demo: paymentMode() === 'demo',
        })
        .select('id')
        .single();
      if (!error) return { ok: true, giftCardId: data.id };
      if (error.code !== '23505') throw error; // nur unique-Kollision retryen
    }
    throw new Error('Code-Generierung: drei Kollisionen in Folge');
  } catch (err) {
    console.error('[giftcard] createGiftCardOrder fehlgeschlagen:', err);
    return { ok: false, error: 'generic' };
  }
}

export interface InitiateGiftPaymentResult {
  ok: boolean;
  error?: string;
  mode?: 'stripe' | 'demo';
  clientSecret?: string;
  /** Für die return_url der Stripe-Bestätigung. */
  downloadToken?: string;
}

/** Zahlung anstoßen: PaymentIntent mit metadata.gift_card_id. */
export async function initiateGiftCardPayment(giftCardId: string): Promise<InitiateGiftPaymentResult> {
  if (!supabaseAdminConfigured()) return { ok: false, error: 'not-configured' };
  try {
    const admin = createAdminClient();
    const card = await loadGiftCard(admin, giftCardId);
    if (!card || card.status !== 'pending') return { ok: false, error: 'invalid' };

    // Der PaymentProvider-Adapter ist auf Booking typisiert — Gutscheine
    // brauchen weder Customer noch SetupIntent, daher direkt via getStripe().
    if (getPaymentProvider().mode === 'stripe') {
      const pi = await getStripe().paymentIntents.create({
        amount: card.amountCents,
        currency: 'eur',
        automatic_payment_methods: { enabled: true },
        receipt_email: card.buyerEmail,
        description: `Gutschein ${card.code}`,
        metadata: { gift_card_id: card.id, gift_code: card.code },
      });
      await admin
        .from('gift_cards')
        .update({ stripe_payment_intent_id: pi.id })
        .eq('id', card.id);
      return {
        ok: true,
        mode: 'stripe',
        clientSecret: pi.client_secret!,
        downloadToken: card.downloadToken,
      };
    }

    return {
      ok: true,
      mode: 'demo',
      clientSecret: `demo_gpi_${card.id}`,
      downloadToken: card.downloadToken,
    };
  } catch (err) {
    console.error('[giftcard] initiateGiftCardPayment fehlgeschlagen:', err);
    return { ok: false, error: 'generic' };
  }
}

/** Demo-Zahlung bestätigen — gleiche Pipeline wie der Stripe-Webhook. */
export async function confirmDemoGiftPayment(giftCardId: string): Promise<{ ok: boolean; error?: string }> {
  if (paymentMode() !== 'demo') return { ok: false, error: 'not-demo' };
  try {
    await markGiftCardPaid(giftCardId, { paymentIntentId: `demo_gpi_${giftCardId}`, demo: true });
    return { ok: true };
  } catch (err) {
    console.error('[giftcard] confirmDemoGiftPayment fehlgeschlagen:', err);
    return { ok: false, error: 'generic' };
  }
}

/** Karte für Zahlungs-/Erfolgsseite laden — nur mit passendem Download-Token. */
export async function getGiftCardByToken(id: string, token: string): Promise<GiftCard | null> {
  if (!supabaseAdminConfigured() || !id || !token) return null;
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from('gift_cards')
      .select('*')
      .eq('id', id)
      .eq('download_token', token)
      .maybeSingle();
    return data ? mapGiftCard(data) : null;
  } catch {
    return null;
  }
}
