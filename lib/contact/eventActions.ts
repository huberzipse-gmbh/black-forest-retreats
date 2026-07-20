'use server';

/**
 * Server Action der Event-Anfrage (Marktstraße 25 als Event-Location).
 * Gleicher Mechanismus wie das Kontaktformular (lib/contact/actions.ts):
 * server-seitige Validierung, Versand per Resend an ownerRecipients()
 * (CONTACT_TO, Fallback rentals@… + jasin@…), Reply-To ist die E-Mail des
 * Anfragenden. Jede Mail läuft über sendEmail und landet damit auch im
 * email_log (Demo-Outbox).
 */
import { z } from 'zod';
import { ownerRecipients, sendEmail } from '@/lib/email/send';

const eventInquirySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(60).optional().default(''),
  dates: z.string().trim().min(1).max(200),
  occasion: z.string().trim().min(1).max(200),
  guests: z.string().trim().min(1).max(40),
  message: z.string().trim().max(4000).optional().default(''),
  // Honeypot: von echten Menschen nie ausgefüllt.
  company: z.string().max(0).optional().default(''),
});

export interface EventInquiryInput {
  name: string;
  email: string;
  phone?: string;
  dates: string;
  occasion: string;
  guests: string;
  message?: string;
  company?: string;
}

const COLORS = {
  night: '#0f1813',
  forest: '#1b2a21',
  cream: '#faf7f1',
  creamSoft: '#f3ede2',
  brass: '#c9a96a',
  text: '#2a3e31',
};

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid rgba(27,42,33,.12);font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:${COLORS.forest};opacity:.7;">${label}</td>
    <td style="padding:10px 0;border-bottom:1px solid rgba(27,42,33,.12);text-align:end;font-weight:bold;color:${COLORS.forest};">${value}</td>
  </tr>`;
}

function notificationHtml(data: {
  name: string;
  email: string;
  phone: string;
  dates: string;
  occasion: string;
  guests: string;
  message: string;
}): string {
  const details = [
    row('Name', esc(data.name)),
    row('E-Mail', esc(data.email)),
    data.phone ? row('Telefon', esc(data.phone)) : '',
    row('Wunschzeitraum', esc(data.dates)),
    row('Anlass', esc(data.occasion)),
    row('Personenzahl', esc(data.guests)),
  ].join('');
  const message = data.message
    ? `<div style="margin-top:22px;padding:16px 18px;background:${COLORS.creamSoft};border-radius:4px;white-space:normal;">${esc(data.message).replace(/\n/g, '<br>')}</div>`
    : '';

  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:${COLORS.creamSoft};font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.creamSoft};padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${COLORS.cream};border-radius:6px;overflow:hidden;">
        <tr>
          <td style="background:${COLORS.night};padding:28px 32px;text-align:center;">
            <div style="color:${COLORS.cream};font-size:22px;letter-spacing:1px;">Black Forest Retreats</div>
            <div style="color:${COLORS.brass};font-size:11px;letter-spacing:3px;text-transform:uppercase;margin-top:6px;">Neue Event-Anfrage · Marktstraße 25</div>
          </td>
        </tr>
        <tr><td style="padding:36px 32px;color:${COLORS.text};font-size:15px;line-height:1.6;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${details}</table>
          ${message}
        </td></tr>
        <tr>
          <td style="background:${COLORS.forest};padding:20px 32px;text-align:center;">
            <div style="color:${COLORS.cream};font-size:12px;opacity:.8;">Black Forest Retreats · Neuenbürg</div>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendEventInquiry(
  input: EventInquiryInput,
): Promise<{ ok: boolean; error?: string }> {
  const parsed = eventInquirySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: 'invalid' };
  }
  const { name, email, phone, dates, occasion, guests, message, company } = parsed.data;

  // Honeypot ausgefüllt → still „ok" zurückgeben, aber nichts senden.
  if (company) {
    return { ok: true };
  }

  const res = await sendEmail({
    to: ownerRecipients(),
    replyTo: email,
    subject: `Neue Event-Anfrage von ${name}`,
    html: notificationHtml({ name, email, phone, dates, occasion, guests, message }),
  });

  if (!res.ok) {
    return { ok: false, error: res.error ?? 'send-failed' };
  }
  return { ok: true };
}
