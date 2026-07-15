'use server';

/**
 * Newsletter-Anmeldung mit Double-Opt-in.
 *
 * Ablauf: Adresse landet als `pending` in newsletter_subscribers, dazu geht eine
 * Bestätigungsmail mit Einmal-Link raus. Erst der Klick auf diesen Link setzt
 * `confirmed` — vorher darf niemand angeschrieben werden. Das ist die
 * Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO, nachweisbar über confirmed_at.
 *
 * Nach außen antwortet die Action immer gleich („Schau in dein Postfach"),
 * unabhängig davon, ob die Adresse schon bekannt war. Sonst wäre das Formular
 * ein Orakel, mit dem sich fremde Anmeldungen abfragen lassen.
 */
import { z } from 'zod';
import { sendEmail } from '@/lib/email/send';
import { createAdminClient } from '@/lib/supabase/admin';
import { STRINGS } from '@/lib/i18n/strings';
import { isLocale, defaultLocale, type Locale } from '@/lib/i18n/config';
import { confirmMailHtml } from './mail';

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  locale: z.string().trim().max(5).optional().default(defaultLocale),
  // Honeypot: von echten Menschen nie ausgefüllt.
  company: z.string().max(0).optional().default(''),
});

export interface NewsletterInput {
  email: string;
  locale?: string;
  company?: string;
}

export type NewsletterResult = { ok: true } | { ok: false; error: 'invalid' | 'failed' };

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3030').replace(/\/$/, '');
}

export async function subscribeNewsletter(input: NewsletterInput): Promise<NewsletterResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'invalid' };

  const { email, company } = parsed.data;
  // Honeypot ausgefüllt → „ok" melden, aber nichts speichern und nichts senden.
  if (company) return { ok: true };

  const locale: Locale = isLocale(parsed.data.locale) ? parsed.data.locale : defaultLocale;

  let sb;
  try {
    sb = createAdminClient();
  } catch (err) {
    console.error('[newsletter] Supabase nicht konfiguriert:', err);
    return { ok: false, error: 'failed' };
  }

  const { data: existing, error: readError } = await sb
    .from('newsletter_subscribers')
    .select('id, status')
    .eq('email', email)
    .maybeSingle();

  if (readError) {
    console.error('[newsletter] Lesen fehlgeschlagen:', readError.message);
    return { ok: false, error: 'failed' };
  }

  // Schon bestätigt → nichts tun, aber nach außen dieselbe Antwort geben.
  if (existing?.status === 'confirmed') return { ok: true };

  // Neue Anmeldung oder erneuter Anlauf: frisches Token, Status zurück auf pending.
  const token = crypto.randomUUID();
  const { error: writeError } = await sb
    .from('newsletter_subscribers')
    .upsert(
      {
        email,
        locale,
        status: 'pending',
        token,
        confirmed_at: null,
        unsubscribed_at: null,
      },
      { onConflict: 'email' },
    );

  if (writeError) {
    console.error('[newsletter] Speichern fehlgeschlagen:', writeError.message);
    return { ok: false, error: 'failed' };
  }

  const t = STRINGS[locale].newsletter;
  const res = await sendEmail({
    to: email,
    subject: t.mail.subject,
    html: confirmMailHtml({
      intro: t.mail.intro,
      cta: t.mail.cta,
      note: t.mail.note,
      url: `${siteUrl()}/newsletter/bestaetigen?token=${token}`,
      dir: locale === 'ar' ? 'rtl' : 'ltr',
    }),
  });

  if (!res.ok) return { ok: false, error: 'failed' };
  return { ok: true };
}

/** Klick auf den Link in der Bestätigungsmail. */
export async function confirmNewsletter(token: string): Promise<boolean> {
  if (!/^[0-9a-f-]{36}$/i.test(token)) return false;
  try {
    const sb = createAdminClient();
    const { data, error } = await sb
      .from('newsletter_subscribers')
      .update({ status: 'confirmed', confirmed_at: new Date().toISOString() })
      .eq('token', token)
      .in('status', ['pending', 'confirmed'])
      .select('id');
    if (error) throw new Error(error.message);
    return (data?.length ?? 0) > 0;
  } catch (err) {
    console.error('[newsletter] Bestätigung fehlgeschlagen:', err);
    return false;
  }
}

/** Abmeldung über den Link am Ende jeder Newsletter-Mail. */
export async function unsubscribeNewsletter(token: string): Promise<boolean> {
  if (!/^[0-9a-f-]{36}$/i.test(token)) return false;
  try {
    const sb = createAdminClient();
    const { data, error } = await sb
      .from('newsletter_subscribers')
      .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
      .eq('token', token)
      .select('id');
    if (error) throw new Error(error.message);
    return (data?.length ?? 0) > 0;
  } catch (err) {
    console.error('[newsletter] Abmeldung fehlgeschlagen:', err);
    return false;
  }
}
