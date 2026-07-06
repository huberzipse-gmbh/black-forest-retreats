-- ═══════════════════════════════════════════════════════════════════════════
-- Rechnungen auch für Gutscheinkäufe (GoBD, gleicher lückenloser Nummernkreis):
-- invoices bekommt gift_card_id; booking_id wird optional (genau eins von
-- beiden muss gesetzt sein). create_invoice() reicht das Feld durch.
-- ═══════════════════════════════════════════════════════════════════════════

alter table invoices alter column booking_id drop not null;
alter table invoices
  add column if not exists gift_card_id uuid references gift_cards(id);
alter table invoices drop constraint if exists invoices_subject_check;
alter table invoices
  add constraint invoices_subject_check
  check (booking_id is not null or gift_card_id is not null);
create index if not exists invoices_gift_card_idx on invoices(gift_card_id);

-- Unveränderlichkeits-Guard um gift_card_id erweitern.
create or replace function invoices_guard() returns trigger
language plpgsql as $$
begin
  if tg_op = 'DELETE' then
    raise exception 'Rechnungen dürfen nicht gelöscht werden (GoBD)';
  end if;
  if (new.invoice_number, new.booking_id, new.gift_card_id, new.kind, new.issued_at,
      new.issuer::text, new.recipient::text, new.line_items::text,
      new.net_cents, new.vat_rate, new.vat_cents, new.gross_cents)
     is distinct from
     (old.invoice_number, old.booking_id, old.gift_card_id, old.kind, old.issued_at,
      old.issuer::text, old.recipient::text, old.line_items::text,
      old.net_cents, old.vat_rate, old.vat_cents, old.gross_cents) then
    raise exception 'Rechnungen sind unveränderlich (GoBD) — Storno per Stornorechnung';
  end if;
  return new;
end $$;

create or replace function create_invoice(payload jsonb) returns invoices
language plpgsql as $$
declare
  inv invoices;
begin
  insert into invoices (
    invoice_number, booking_id, gift_card_id, kind, references_invoice_id,
    issuer, recipient, line_items,
    net_cents, vat_rate, vat_cents, gross_cents,
    service_from, service_to, pdf_locale
  ) values (
    next_invoice_number(),
    nullif(payload->>'booking_id', '')::uuid,
    nullif(payload->>'gift_card_id', '')::uuid,
    coalesce(payload->>'kind', 'invoice'),
    nullif(payload->>'references_invoice_id', '')::uuid,
    payload->'issuer',
    payload->'recipient',
    payload->'line_items',
    (payload->>'net_cents')::int,
    (payload->>'vat_rate')::numeric,
    (payload->>'vat_cents')::int,
    (payload->>'gross_cents')::int,
    nullif(payload->>'service_from', '')::date,
    nullif(payload->>'service_to', '')::date,
    coalesce(payload->>'pdf_locale', 'de')
  ) returning * into inv;
  return inv;
end $$;
