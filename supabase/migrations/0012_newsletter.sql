-- ═══════════════════════════════════════════════════════════════════════════
-- Newsletter-Anmeldungen mit Double-Opt-in.
--
-- Bis hierher war das Formular im Footer eine Attrappe: kein action, keine
-- Route, keine Tabelle — jede eingetragene Adresse ging verloren. Diese Tabelle
-- ist der Speicherort. status bleibt 'pending', bis der Interessent den Link in
-- der Bestätigungsmail geklickt hat; erst 'confirmed' darf angeschrieben werden
-- (Art. 6 Abs. 1 lit. a DSGVO, Nachweis über confirmed_at).
--
-- Kein RLS-Policy → ausschließlich die Service-Role (Server Actions) kommt ran.
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  locale text not null default 'de',
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'unsubscribed')),
  -- Token für Bestätigungs- und Abmeldelink. Bei jeder neuen Anmeldung erneuert.
  token uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  confirmed_at timestamptz,
  unsubscribed_at timestamptz
);

create index if not exists newsletter_subscribers_token_idx
  on newsletter_subscribers (token);
create index if not exists newsletter_subscribers_status_idx
  on newsletter_subscribers (status);

alter table newsletter_subscribers enable row level security;
-- keine Policies → nur Service-Role

grant select, insert, update on newsletter_subscribers to service_role;
