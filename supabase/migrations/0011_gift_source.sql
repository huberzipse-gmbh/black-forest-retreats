-- Herkunft eines Gutscheins: regulärer Kauf über den Shop (mit Stripe-Zahlung
-- und Rechnung) oder manuell im Admin ausgestellt (Geschenk/Kulanz, ohne
-- Zahlung und ohne Rechnung).
alter table gift_cards
  add column if not exists source text not null default 'purchase'
    check (source in ('purchase', 'admin'));

create index if not exists gift_cards_source_idx on gift_cards(source);
