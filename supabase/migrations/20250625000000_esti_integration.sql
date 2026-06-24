-- =====================================================================
-- PP Estate — integracja EstiCRM → Supabase
-- Dodaje:
--   * źródło zdjęcia (esti / upload / url) + zdjęcia zewnętrzne bez storage
--   * tabelę logów synchronizacji (esti_sync_log)
--   * tabelę stanu synchronizacji (esti_sync_state) dla syncu przyrostowego
-- Bezpieczny do ponownego uruchomienia (idempotentny tam, gdzie się da).
-- =====================================================================

-- --------------------- Źródło zdjęcia w ofercie ----------------------
do $$ begin
  create type oferta_zdjecie_zrodlo as enum ('esti', 'upload', 'url');
exception when duplicate_object then null; end $$;

alter table public.oferty_zdjecia
  add column if not exists zrodlo oferta_zdjecie_zrodlo not null default 'upload';

-- Zdjęcia zewnętrzne (Esti / wklejony URL) nie mają ścieżki w storage
alter table public.oferty_zdjecia
  alter column sciezka drop not null;

create index if not exists oferty_zdjecia_zrodlo_idx
  on public.oferty_zdjecia (oferta_id, zrodlo);

-- ------------------------ Logi synchronizacji ------------------------
create table if not exists public.esti_sync_log (
  id            uuid primary key default gen_random_uuid(),
  started_at    timestamptz not null default now(),
  finished_at   timestamptz,
  success       boolean,
  mode          text not null, -- 'full' | 'incremental'
  added         int not null default 0,
  updated       int not null default 0,
  hidden        int not null default 0,
  errors        int not null default 0,
  error_message text,
  details       jsonb
);

create index if not exists esti_sync_log_started_at_idx
  on public.esti_sync_log (started_at desc);

-- ------------------------ Stan synchronizacji ------------------------
create table if not exists public.esti_sync_state (
  id                    int primary key default 1 check (id = 1),
  last_successful_sync  timestamptz,
  last_update_date_used text, -- format Esti: YYYY-MM-DD HH:MM:SS
  is_running            boolean not null default false,
  running_since         timestamptz
);

insert into public.esti_sync_state (id)
values (1)
on conflict (id) do nothing;

-- ------------------------------- RLS ---------------------------------
-- Tabele synchronizacji obsługiwane wyłącznie przez serwer (service_role,
-- który omija RLS). Włączamy RLS bez polityk publicznych, by zablokować
-- dostęp z anon/auth.
alter table public.esti_sync_log   enable row level security;
alter table public.esti_sync_state enable row level security;
