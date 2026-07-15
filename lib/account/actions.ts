'use server';

/**
 * Konto-Server-Actions. Passwort-Reset läuft bewusst NICHT über den GoTrue-
 * Mailer (der ist selbst-gehostet ohne eigenes SMTP — daher Autoconfirm),
 * sondern: Recovery-Link per Admin-API erzeugen und über den bestehenden
 * Resend-Versand (sendEmail) verschicken. So hängt der Reset an derselben,
 * bereits verifizierten Mail-Pipeline wie Buchungs- und Gutschein-Mails.
 */
import { headers } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import { supabaseAdminConfigured } from '@/lib/supabase/env';
import { sendEmail } from '@/lib/email/send';
import { passwordResetEmail } from '@/lib/email/templates';
import { getLocale } from '@/lib/i18n/server';

/**
 * Passwort-Reset anfordern. Gibt aus Datenschutzgründen IMMER { ok: true }
 * zurück (kein Konto-Leak): Ob eine Adresse existiert, verrät die Antwort nicht.
 */
export async function requestPasswordReset(email: string): Promise<{ ok: boolean }> {
  const clean = email.trim().toLowerCase();
  if (!supabaseAdminConfigured() || !/.+@.+\..+/.test(clean)) return { ok: true };

  try {
    const admin = createAdminClient();
    // Recovery-Link erzeugen. generateLink wirft/liefert Fehler, wenn es die
    // Adresse nicht gibt — das schlucken wir bewusst (kein Leak).
    const { data, error } = await admin.auth.admin.generateLink({
      type: 'recovery',
      email: clean,
    });
    const tokenHash = data?.properties?.hashed_token;
    if (error || !tokenHash) return { ok: true };

    const h = await headers();
    const host = h.get('host') ?? '';
    const proto = h.get('x-forwarded-proto') ?? (host.includes('localhost') ? 'http' : 'https');
    const url = `${proto}://${host}/konto/passwort-neu?token_hash=${encodeURIComponent(
      tokenHash,
    )}&type=recovery`;

    const locale = await getLocale();
    const mail = passwordResetEmail(locale, url);
    await sendEmail({ to: clean, subject: mail.subject, html: mail.html });
  } catch (err) {
    console.error('[account] requestPasswordReset fehlgeschlagen:', err);
  }
  return { ok: true };
}
