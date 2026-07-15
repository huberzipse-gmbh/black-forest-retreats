-- ═══════════════════════════════════════════════════════════════════════════
-- Überbuchungsschutz.
--
-- Bisher lagen Verfügbarkeitsprüfung und Block-Insert in createBooking als
-- zwei getrennte Statements ohne Transaktion: zwei parallele Buchungsversuche
-- auf denselben Zeitraum lasen beide „frei" und legten beide einen Block an.
-- Nichts in der DB verhinderte das.
--
-- Zwei Schichten:
--   1. EXCLUDE-Constraint — die harte Garantie gegen kollidierende EIGENE
--      Belegungen (Buchung/manuelle Sperre), egal über welchen Weg sie kommen.
--   2. create_booking_block() — atomarer Check+Insert unter Advisory Lock,
--      damit der Normalfall eine saubere „belegt"-Antwort bekommt statt eines
--      Constraint-Fehlers.
--
-- Airbnb-Blöcke sind BEWUSST vom Constraint ausgenommen: wenn ein Airbnb-Gast
-- gebucht hat, ist das Faktum bereits geschaffen: Der Import muss landen dürfen,
-- damit die Kollision im Admin sichtbar wird. Ein Constraint würde den Import
-- abweisen und die Überbuchung damit unsichtbar machen.
--
-- VOR dem Ausführen prüfen, ob bereits kollidierende Blöcke existieren —
-- sonst schlägt der ALTER TABLE unten fehl (und genau das soll er, statt
-- Daten stillschweigend zu akzeptieren, die er nie erlauben würde):
--
--   select a.retreat_id, a.start_date, a.end_date, b.start_date, b.end_date
--     from availability_blocks a
--     join availability_blocks b
--       on a.retreat_id = b.retreat_id and a.id < b.id
--      and daterange(a.start_date, a.end_date) && daterange(b.start_date, b.end_date)
--    where a.source <> 'airbnb-ical' and b.source <> 'airbnb-ical';
-- ═══════════════════════════════════════════════════════════════════════════

-- gist-Index über text-Gleichheit (retreat_id) + daterange-Overlap
create extension if not exists btree_gist;

-- ── Verfallene Reservierungen freigeben ────────────────────────────────────
-- Spiegelbild von bookingHoldsSlot() in lib/booking/db.ts: eine unbezahlte
-- pending-Buchung reserviert nur 30 min. Die App filterte solche Blöcke
-- bisher nur beim Lesen weg — die Zeilen blieben liegen. Unter dem Constraint
-- würden diese Karteileichen echte Buchungen blockieren, also müssen sie weg,
-- bevor ein neuer Block entsteht.
create or replace function release_expired_blocks(p_retreat_id text default null)
returns int language plpgsql as $$
declare
  v_count int;
begin
  with released as (
    delete from availability_blocks ab
    using bookings b
    where ab.booking_id = b.id
      and ab.source = 'booking'
      and (p_retreat_id is null or ab.retreat_id = p_retreat_id)
      and (
        b.status = 'cancelled'
        or (
          b.status = 'pending'
          and b.payment_status in ('unpaid', 'awaiting_payment', 'failed')
          and b.created_at < now() - interval '30 minutes'
        )
      )
    returning ab.id
  )
  select count(*) into v_count from released;
  return v_count;
end $$;

-- Karteileichen aus der Zeit vor dem Constraint einsammeln.
select release_expired_blocks();

-- ── Schicht 1: harte Garantie ──────────────────────────────────────────────
alter table availability_blocks
  add constraint availability_blocks_no_overlap
  exclude using gist (
    retreat_id with =,
    daterange(start_date, end_date) with &&
  ) where (source <> 'airbnb-ical');

-- ── Schicht 2: atomarer Check + Insert ─────────────────────────────────────
-- Der Advisory Lock serialisiert alle Buchungsversuche derselben Wohnung für
-- die Dauer der Transaktion. Rückgabe null = Zeitraum belegt (der Aufrufer
-- macht daraus die normale „unavailable"-Antwort).
--
-- Anders als der Constraint prüft der Check auch gegen Airbnb-Blöcke: dort
-- liegt bereits ein Gast, also darf keine Direktbuchung mehr rein.
create or replace function create_booking_block(
  p_retreat_id text,
  p_booking_id uuid,
  p_start date,
  p_end date
) returns uuid
language plpgsql as $$
declare
  v_id uuid;
begin
  perform pg_advisory_xact_lock(hashtext(p_retreat_id));
  perform release_expired_blocks(p_retreat_id);

  if exists (
    select 1
      from availability_blocks
     where retreat_id = p_retreat_id
       and booking_id is distinct from p_booking_id
       and daterange(start_date, end_date) && daterange(p_start, p_end)
  ) then
    return null;
  end if;

  insert into availability_blocks (retreat_id, start_date, end_date, source, booking_id)
  values (p_retreat_id, p_start, p_end, 'booking', p_booking_id)
  returning id into v_id;
  return v_id;
end $$;

-- PostgREST-Schema-Cache neu laden
notify pgrst, 'reload schema';
