-- ═══════════════════════════════════════════════════════════════════════════
-- Gutscheine (Wertgutscheine): Kauf via Stripe, Einlösung im Buchungsflow.
-- Restguthaben bleibt auf dem Code, Gültigkeit 3 Jahre ab Zahlung.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Gutscheine ──────────────────────────────────────────────────────────────
create table if not exists gift_cards (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,                 -- GIFT-XXXX-XXXX (ohne 0/O/1/I)
  amount_cents int not null check (amount_cents >= 2000 and amount_cents <= 100000),
  balance_cents int not null check (balance_cents >= 0),
  currency text not null default 'EUR' check (currency = 'EUR'),
  buyer_name text not null,
  buyer_email text not null,
  recipient_name text not null,
  message text,                              -- optionale Grußbotschaft
  status text not null default 'pending'
    check (status in ('pending','active','redeemed','expired','cancelled')),
  stripe_payment_intent_id text,
  download_token uuid not null default gen_random_uuid(), -- öffentlicher PDF-Zugriff
  element_icon text not null default 'hut'
    check (element_icon in ('hut','uhr','kirschtorte','schinken')),
  locale text not null default 'de',
  demo boolean not null default false,
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  expires_at timestamptz                     -- paid_at + 3 Jahre
);
create index if not exists gift_cards_status_idx on gift_cards(status);
create index if not exists gift_cards_code_upper_idx on gift_cards(upper(code));

-- ── Einlösungen (Audit-Trail, eine Zeile pro Buchung) ───────────────────────
create table if not exists gift_card_redemptions (
  id uuid primary key default gen_random_uuid(),
  gift_card_id uuid not null references gift_cards(id),
  booking_id uuid not null references bookings(id),
  amount_cents int not null check (amount_cents > 0),
  created_at timestamptz not null default now(),
  unique (gift_card_id, booking_id)          -- Idempotenz bei Webhook-Retries
);

-- Buchung merkt sich den angewendeten Gutschein (Betrag steckt auch im Quote-JSON).
alter table bookings
  add column if not exists gift_card_id uuid references gift_cards(id),
  add column if not exists gift_card_applied_cents int not null default 0;

-- RLS ohne Policies → nur Service-Role (Käufer-Daten nie öffentlich lesbar).
alter table gift_cards enable row level security;
alter table gift_card_redemptions enable row level security;

-- ── Atomare Einlösung: Audit-Zeile + Saldo-Abzug in einer Transaktion ───────
-- Idempotent (unique-Konflikt → true ohne Abzug) und double-spend-sicher
-- (Balance-Guard; schlägt er fehl, rollt auch der Redemption-Insert zurück).
create or replace function redeem_gift_card(
  p_gift_card_id uuid, p_booking_id uuid, p_amount_cents int
) returns boolean
language plpgsql
security definer
as $$
begin
  insert into gift_card_redemptions (gift_card_id, booking_id, amount_cents)
  values (p_gift_card_id, p_booking_id, p_amount_cents)
  on conflict (gift_card_id, booking_id) do nothing;
  if not found then
    return true;                             -- bereits eingelöst (Retry)
  end if;

  update gift_cards
     set balance_cents = balance_cents - p_amount_cents,
         status = case
           when balance_cents - p_amount_cents = 0 then 'redeemed'
           else status
         end
   where id = p_gift_card_id
     and status = 'active'
     and balance_cents >= p_amount_cents;
  if not found then
    raise exception 'Gutschein-Saldo unzureichend oder Karte nicht aktiv';
  end if;

  return true;
end $$;
