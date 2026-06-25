alter table public.oferty
  add column if not exists status_reczny boolean not null default false;

comment on column public.oferty.status_reczny is
  'Gdy true, synchronizacja Esti nie nadpisuje pola status.';
