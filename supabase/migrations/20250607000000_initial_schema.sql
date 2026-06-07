-- =====================================================================
-- PP Estate — schemat bazy ofert nieruchomości
-- Tabela `oferty` + zdjęcia + zapytania kontaktowe.
-- Bezpieczny do ponownego uruchomienia (idempotentny tam, gdzie się da).
-- =====================================================================

-- Sprzątanie poprzedniej, tymczasowej tabeli (jeśli istniała)
drop table if exists public.offers cascade;

-- ----------------------------- ENUMy ---------------------------------
do $$ begin
  create type oferta_zrodlo as enum ('esti', 'strona');
exception when duplicate_object then null; end $$;

do $$ begin
  create type oferta_status as enum ('aktywna', 'rezerwacja', 'sprzedana', 'wynajeta', 'ukryta');
exception when duplicate_object then null; end $$;

do $$ begin
  create type oferta_typ_nieruchomosci as enum ('mieszkanie', 'dom', 'dzialka', 'lokal_komercyjny', 'biuro', 'hala');
exception when duplicate_object then null; end $$;

do $$ begin
  create type oferta_typ_transakcji as enum ('sprzedaz', 'wynajem');
exception when duplicate_object then null; end $$;

do $$ begin
  create type oferta_rynek as enum ('pierwotny', 'wtorny');
exception when duplicate_object then null; end $$;

-- ------------------- Trigger: data_aktualizacji ----------------------
create or replace function public.set_data_aktualizacji()
returns trigger as $$
begin
  new.data_aktualizacji = now();
  return new;
end;
$$ language plpgsql;

-- ----------------------------- OFERTY --------------------------------
create table if not exists public.oferty (
  id                            uuid primary key default gen_random_uuid(),
  data_utworzenia               timestamptz not null default now(),
  data_aktualizacji             timestamptz not null default now(),

  zrodlo                        oferta_zrodlo not null default 'strona',
  esti_id                       text,
  slug                          text unique,

  tytul                         text not null,
  opis                          text,

  status                        oferta_status not null default 'aktywna',
  typ_nieruchomosci             oferta_typ_nieruchomosci not null,
  typ_transakcji                oferta_typ_transakcji not null default 'sprzedaz',
  rynek                         oferta_rynek,

  cena                          numeric(14,2),
  waluta                        text not null default 'PLN',
  cena_za_m2                    numeric(14,2),

  powierzchnia                  numeric(10,2),
  powierzchnia_uzytkowa         numeric(10,2),
  powierzchnia_dzialki          numeric(12,2),

  liczba_pokoi                  smallint,
  pietro                        smallint,
  liczba_pieter_w_budynku       smallint,

  rok_budowy                    smallint,

  miasto                        text,
  dzielnica                     text,
  ulica                         text,
  kod_pocztowy                  text,

  szerokosc_geo                 double precision,
  dlugosc_geo                   double precision,

  agent_id                      text,

  wyrozniona                    boolean not null default false,
  wyrozniona_na_stronie_glownej boolean not null default false,

  seo_tytul                     text,
  seo_opis                      text,

  ostatnio_widziana_w_esti      timestamptz
);

drop trigger if exists trg_oferty_aktualizacja on public.oferty;
create trigger trg_oferty_aktualizacja
  before update on public.oferty
  for each row execute function public.set_data_aktualizacji();

-- Esti ID unikalne (gdy ustawione), żeby import nie duplikował ofert
create unique index if not exists oferty_esti_id_key
  on public.oferty (esti_id) where esti_id is not null;

create index if not exists oferty_status_idx              on public.oferty (status);
create index if not exists oferty_typ_nieruchomosci_idx   on public.oferty (typ_nieruchomosci);
create index if not exists oferty_typ_transakcji_idx      on public.oferty (typ_transakcji);
create index if not exists oferty_data_utworzenia_idx     on public.oferty (data_utworzenia desc);
create index if not exists oferty_wyrozniona_glowna_idx   on public.oferty (wyrozniona_na_stronie_glownej);

-- --------------------------- ZDJĘCIA ---------------------------------
create table if not exists public.oferty_zdjecia (
  id                uuid primary key default gen_random_uuid(),
  oferta_id         uuid not null references public.oferty(id) on delete cascade,
  url               text not null,
  sciezka           text not null,
  kolejnosc         smallint not null default 0,
  czy_glowne        boolean not null default false,
  data_utworzenia   timestamptz not null default now()
);

create index if not exists oferty_zdjecia_oferta_id_idx
  on public.oferty_zdjecia (oferta_id, kolejnosc);

-- ---------------------- ZAPYTANIA KONTAKTOWE -------------------------
create table if not exists public.contact_inquiries (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  email             text not null,
  phone             text not null,
  subject           text not null,
  message           text not null,
  privacy_accepted  boolean not null default false,
  created_at        timestamptz not null default now()
);

-- ------------------------------- RLS ---------------------------------
alter table public.oferty            enable row level security;
alter table public.oferty_zdjecia    enable row level security;
alter table public.contact_inquiries enable row level security;

-- Publiczny odczyt wszystkich ofert poza ukrytymi
drop policy if exists "Public read visible offers" on public.oferty;
create policy "Public read visible offers" on public.oferty
  for select using (status <> 'ukryta');

drop policy if exists "Public read offer images" on public.oferty_zdjecia;
create policy "Public read offer images" on public.oferty_zdjecia
  for select using (
    exists (
      select 1 from public.oferty o
      where o.id = oferta_id and o.status <> 'ukryta'
    )
  );

-- Każdy może wysłać zapytanie z formularza (po akceptacji RODO)
drop policy if exists "Anyone can submit contact inquiry" on public.contact_inquiries;
create policy "Anyone can submit contact inquiry" on public.contact_inquiries
  for insert with check (privacy_accepted = true);

-- Operacje administracyjne (dodawanie/edycja/usuwanie) wykonuje serwer
-- przez klucz service_role, który omija RLS — dodatkowe polityki zbędne.

-- --------------------------- STORAGE ---------------------------------
insert into storage.buckets (id, name, public)
values ('oferty-zdjecia', 'oferty-zdjecia', true)
on conflict (id) do nothing;

drop policy if exists "Public read oferty-zdjecia" on storage.objects;
create policy "Public read oferty-zdjecia" on storage.objects
  for select using (bucket_id = 'oferty-zdjecia');
