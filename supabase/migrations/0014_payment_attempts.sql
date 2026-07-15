-- ═══════════════════════════════════════════════════════════════════════════
-- Zähler für Abbuchungsversuche einer „Später zahlen"-Buchung.
--
-- Ohne Limit zog der charge-due-Cron eine dauerhaft abgelehnte Karte bei JEDEM
-- Lauf erneut und verschickte jedes Mal eine neue „Zahlung fehlgeschlagen"-Mail.
-- Mit diesem Zähler wird höchstens N-mal versucht, und der Gast erhält genau
-- EINE Benachrichtigung; danach übernimmt der Betreiber manuell.
-- ═══════════════════════════════════════════════════════════════════════════

alter table bookings
  add column if not exists payment_attempts int not null default 0;
