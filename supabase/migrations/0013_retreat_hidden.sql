-- ═══════════════════════════════════════════════════════════════════════════
-- Wohnungen vorübergehend ausblenden, ohne das Inserat zu löschen.
--
-- `bookable = false` allein reichte nicht: die Wohnung blieb öffentlich sichtbar
-- (nur der Buchen-Button verschwand). `hidden = true` nimmt das Inserat komplett
-- von der Website (Übersicht + Detailseite), lässt aber alle Daten, Buchungen
-- und Rechnungen bestehen. Löschen ist ohnehin durch GoBD blockiert, sobald
-- Buchungen existieren — Ausblenden ist der richtige, reversible Weg.
-- ═══════════════════════════════════════════════════════════════════════════

alter table retreats
  add column if not exists hidden boolean not null default false;
