# OPEN TODOS — Black Forest Retreats

Ergänzend zu den „Offenen Punkten" in `docs/HANDOFF.md`.

## Offen

- **[20.07.2026] E-Mail-Postfächer/Weiterleitungen für Dennis und Sanja hinterlegen.**
  Weiterleitung der Admin-/Buchungs-Mails (neue Buchungen, Kontaktanfragen,
  Konflikt-Warnungen) an die E-Mail-Adressen von Dennis und Sanja einrichten,
  sobald die Adressen vorliegen. Empfänger dann in der Env-/Resend-Konfiguration
  eintragen: `CONTACT_TO` (kommagetrennte Liste) in `.env.local` bzw. der
  Coolify-Env erweitern — `ownerRecipients()` in `lib/email/send.ts` liest
  diese Variable für alle Betreiber-Benachrichtigungen.
