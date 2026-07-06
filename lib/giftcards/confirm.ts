import 'server-only';

/**
 * Gutschein-Zahlungsbestätigung — gemeinsame Pipeline für Stripe-Webhook und
 * Demo-Modus: aktivieren, Gültigkeit setzen, PDF rendern, Mail an den Käufer.
 *
 * Bewusst KEINE Rechnung (invoices-Nummernkreis bleibt unberührt).
 * TODO Steuerberater: Einzweck- vs. Mehrzweck-Gutschein (§ 3 Abs. 14 UStG) —
 * ist nur Beherbergung (7 %) einlösbar, wäre die USt ggf. schon beim Verkauf
 * fällig und beim Kauf ein Beleg nötig. Aktuell pragmatisch: Beleg erst mit
 * der Buchungsrechnung, Gutschein mindert dort das Brutto.
 *
 * Refunds sind out of scope: Kauf-Storno manuell im Stripe-Dashboard plus
 * Admin-„Stornieren"; bei Buchungs-Storno wird nur der Stripe-Anteil
 * erstattet, Guthaben-Rückbuchung ist ein manueller Admin-Vorgang.
 */
import { addYears } from 'date-fns';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email/send';
import { giftCardEmail } from '@/lib/email/templates';
import { loadGiftCard } from './db';
import { renderGiftCardPdf } from './pdf';
import { GIFT_VALIDITY_YEARS } from './types';

export interface MarkGiftCardPaidOptions {
  paymentIntentId?: string;
  demo?: boolean;
}

export async function markGiftCardPaid(
  giftCardId: string,
  opts: MarkGiftCardPaidOptions = {},
): Promise<void> {
  const admin = createAdminClient();
  const card = await loadGiftCard(admin, giftCardId);
  if (!card) throw new Error(`Gutschein ${giftCardId} nicht gefunden`);

  // Idempotenz: Webhook-Retries laufen ins Leere, keine zweite Mail.
  if (card.status !== 'pending') return;

  const paidAt = new Date();
  const expiresAt = addYears(paidAt, GIFT_VALIDITY_YEARS);
  const { error } = await admin
    .from('gift_cards')
    .update({
      status: 'active',
      paid_at: paidAt.toISOString(),
      expires_at: expiresAt.toISOString(),
      stripe_payment_intent_id: opts.paymentIntentId ?? card.stripePaymentIntentId,
      demo: opts.demo ?? card.demo,
    })
    .eq('id', giftCardId)
    .eq('status', 'pending'); // Guard gegen parallele Bestätigungen
  if (error) throw error;

  const activeCard = await loadGiftCard(admin, giftCardId);
  if (!activeCard) return;

  // Mail mit PDF — Fehler hier dürfen die Zahlung nicht „zurückrollen":
  // Karte ist aktiv, das PDF ist jederzeit über die Download-Route erreichbar.
  try {
    const pdf = await renderGiftCardPdf(activeCard);
    const mail = giftCardEmail(activeCard);
    await sendEmail({
      to: activeCard.buyerEmail,
      subject: mail.subject,
      html: mail.html,
      attachments: [{ filename: `${activeCard.code}.pdf`, content: pdf }],
    });
  } catch (err) {
    console.error('[giftcard] Gutschein-Mail fehlgeschlagen:', err);
  }
}
