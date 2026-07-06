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
import { createInvoiceForGiftCard, getInvoicePdf } from '@/lib/invoices/create';
import { getStripe } from '@/lib/payments/stripe';
import { paymentMode } from '@/lib/payments';
import { loadGiftCard, mapGiftCard } from './db';
import { renderGiftCardPdf } from './pdf';
import { GIFT_VALIDITY_YEARS, type GiftCard } from './types';

/**
 * Belt & Braces zur Webhook-Latenz: Wenn der Käufer direkt nach der Zahlung
 * auf der Erfolgsseite landet, den PaymentIntent-Status live bei Stripe
 * prüfen und die Karte sofort aktivieren — der Webhook läuft dann idempotent
 * ins Leere. Gibt die (ggf. aktivierte) Karte zurück.
 */
export async function settleGiftCardIfPaid(card: GiftCard): Promise<GiftCard> {
  if (card.status !== 'pending' || !card.stripePaymentIntentId) return card;
  if (paymentMode() !== 'stripe') return card;
  try {
    const pi = await getStripe().paymentIntents.retrieve(card.stripePaymentIntentId);
    if (pi.status === 'succeeded') {
      // Rückgabewert nutzen — ein erneutes SELECT würde memoized (stale) sein.
      const activated = await markGiftCardPaid(card.id, { paymentIntentId: pi.id });
      return activated ?? card;
    }
  } catch (err) {
    console.error('[giftcard] PI-Status-Check fehlgeschlagen:', err);
  }
  return card;
}

export interface MarkGiftCardPaidOptions {
  paymentIntentId?: string;
  demo?: boolean;
}

/** Gibt die aktivierte Karte zurück (null, wenn nichts zu tun war). */
export async function markGiftCardPaid(
  giftCardId: string,
  opts: MarkGiftCardPaidOptions = {},
): Promise<GiftCard | null> {
  const admin = createAdminClient();
  const card = await loadGiftCard(admin, giftCardId);
  if (!card) throw new Error(`Gutschein ${giftCardId} nicht gefunden`);

  // Idempotenz: Webhook-Retries laufen ins Leere, keine zweite Mail.
  if (card.status !== 'pending') return card.status === 'active' ? card : null;

  const paidAt = new Date();
  const expiresAt = addYears(paidAt, GIFT_VALIDITY_YEARS);
  // Aktualisierte Row direkt aus dem UPDATE nehmen — ein erneutes SELECT
  // würde im Server-Component-Render von Nexts Request-Memoization
  // dedupliziert und die ALTE (pending-)Row liefern.
  const { data: updatedRow, error } = await admin
    .from('gift_cards')
    .update({
      status: 'active',
      paid_at: paidAt.toISOString(),
      expires_at: expiresAt.toISOString(),
      stripe_payment_intent_id: opts.paymentIntentId ?? card.stripePaymentIntentId,
      demo: opts.demo ?? card.demo,
    })
    .eq('id', giftCardId)
    .eq('status', 'pending') // Guard gegen parallele Bestätigungen
    .select('*')
    .maybeSingle();
  if (error) throw error;
  if (!updatedRow) return null; // parallel bereits bestätigt

  const activeCard = mapGiftCard(updatedRow);

  // Rechnung (GoBD, gleicher Nummernkreis wie Buchungen; idempotent).
  // Fehler hier dürfen die Aktivierung nicht zurückrollen — Karte ist bezahlt.
  let invoicePdf: { filename: string; content: Buffer } | null = null;
  try {
    const invoice = await createInvoiceForGiftCard(activeCard);
    invoicePdf = {
      filename: `${invoice.invoiceNumber}.pdf`,
      content: await getInvoicePdf(invoice),
    };
  } catch (err) {
    console.error('[giftcard] Rechnungserstellung fehlgeschlagen:', err);
  }

  // Mail mit Gutschein-PDF + Rechnung — Fehler hier dürfen die Zahlung nicht
  // „zurückrollen": die PDFs sind jederzeit über Route/Admin erreichbar.
  try {
    const pdf = await renderGiftCardPdf(activeCard);
    const mail = giftCardEmail(activeCard);
    await sendEmail({
      to: activeCard.buyerEmail,
      subject: mail.subject,
      html: mail.html,
      attachments: [
        { filename: `${activeCard.code}.pdf`, content: pdf },
        ...(invoicePdf ? [invoicePdf] : []),
      ],
    });
  } catch (err) {
    console.error('[giftcard] Gutschein-Mail fehlgeschlagen:', err);
  }

  return activeCard;
}
