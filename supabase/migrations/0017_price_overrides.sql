-- ═══════════════════════════════════════════════════════════════════════════
-- 0017 — Preis-Overrides aus dem Belegungskalender (Airbnb-artige Tages-/
-- Zeitraumpreise pro Wohnung: fester Nachtpreis ODER prozentualer Rabatt).
--
-- Datenmodell-Entscheidung: Die Tabelle price_rules existiert seit 0001 und
-- deckt genau dieses Modell ab (retreat_id + start_date/end_date inklusiv +
-- nightly_price_cents ODER discount_percent/discount_amount_cents). Sie wird
-- hier bewusst WIEDERVERWENDET statt dupliziert, weil die gesamte
-- Preisberechnung (lib/booking/pricing.ts → computeQuote) bereits price_rules
-- liest — Angebot, Checkout, Stripe-Betrag und Rechnung bleiben so automatisch
-- konsistent. Diese Migration ist ein additives Safety-Net (falls eine
-- Umgebung 0001 nicht vollständig hat) plus ein Index für die
-- Datumsbereichs-Lookups des Kalenders. Rein additiv & idempotent.
--
-- (0015/0016 sind durch den ungemergten PR #36 belegt — daher 0017.)
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists price_rules (
  id uuid primary key default gen_random_uuid(),
  retreat_id text not null references retreats(id) on delete cascade,
  name text not null,
  start_date date,                 -- null = ab sofort
  end_date date,                   -- null = unbefristet; INKLUSIV
  nightly_price_cents int,         -- fester Nachtpreis (null = Basispreis)
  discount_amount_cents int,       -- ODER Rabatt pro Nacht (Betrag)
  discount_percent numeric(4,1),   -- ODER Rabatt in Prozent
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Index aus 0001 (Safety-Net) + neuer Index für Zeitraum-Abfragen des
-- Admin-Kalenders (retreat + Datumsbereich).
create index if not exists price_rules_retreat_idx
  on price_rules(retreat_id) where active;
create index if not exists price_rules_retreat_dates_idx
  on price_rules(retreat_id, start_date, end_date) where active;

-- RLS analog 0001: öffentlich lesbar (Preisvorschau), Schreiben nur über
-- Server Actions mit Service-Role.
alter table price_rules enable row level security;
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename  = 'price_rules'
      and policyname = 'price_rules public read'
  ) then
    create policy "price_rules public read" on price_rules for select using (true);
  end if;
end $$;

comment on table price_rules is
  'Preisregeln pro Wohnung (Saison/Kalender): fester Nachtpreis (nightly_price_cents) '
  'oder Rabatt (discount_percent / discount_amount_cents) für start_date–end_date '
  '(inklusiv, null = offen). Wird vom Belegungskalender im Admin und von '
  'computeQuote (lib/booking/pricing.ts) gelesen. Bei überlappenden '
  'Preis-Overrides gewinnt die zuletzt angelegte Regel.';
