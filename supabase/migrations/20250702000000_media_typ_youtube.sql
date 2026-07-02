-- Typ medium w galerii oferty: zdjęcie lub film YouTube
alter table public.oferty_zdjecia
  add column if not exists typ text not null default 'zdjecie'
  check (typ in ('zdjecie', 'film'));

create index if not exists oferty_zdjecia_typ_idx
  on public.oferty_zdjecia (oferta_id, typ);
