import "server-only";

import {
  CATEGORY_QUERY_TYPES,
  CATEGORY_TYPE_MAP,
  type CategoryQueryType,
} from "@/lib/offers";
import type { OfferSearchFilters } from "@/lib/offer-search";
import { createPublicClient } from "@/lib/supabase/public";
import type { OfertaTypNieruchomosci, OfertaZZdjeciami } from "@/types/database";

export type { CategoryQueryType } from "@/lib/offers";

async function countPublicOffersByTypes(
  types: OfertaTypNieruchomosci[]
): Promise<number> {
  const supabase = createPublicClient();

  const { count, error } = await supabase
    .from("oferty")
    .select("*", { count: "exact", head: true })
    .neq("status", "ukryta")
    .not("slug", "is", null)
    .in("typ_nieruchomosci", types);

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function fetchPublicOfferCities(): Promise<string[]> {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("oferty")
    .select("miasto")
    .neq("status", "ukryta")
    .not("slug", "is", null)
    .not("miasto", "is", null);

  if (error) throw new Error(error.message);

  const cities = new Set<string>();
  for (const row of data ?? []) {
    const city = row.miasto?.trim();
    if (city) cities.add(city);
  }

  return [...cities].sort((a, b) => a.localeCompare(b, "pl"));
}

export async function fetchCategoryOfferCounts(): Promise<
  Record<CategoryQueryType, number>
> {
  const entries = await Promise.all(
    CATEGORY_QUERY_TYPES.map(async (queryType) => [
      queryType,
      await countPublicOffersByTypes(CATEGORY_TYPE_MAP[queryType]),
    ] as const)
  );

  return Object.fromEntries(entries) as Record<CategoryQueryType, number>;
}

export {
  buildRealEstateSchema,
  formatLocation,
  formatOfferPrice,
  formatPowierzchnia,
  getMainImage,
  getOfferPath,
  getOfferUrl,
  getSiteUrl,
  toOfferCardData,
  type OfferCardData,
} from "@/lib/offer-display";

export async function fetchPublicOffers(options?: {
  limit?: number;
  featuredOnHomepage?: boolean;
  filters?: OfferSearchFilters;
}): Promise<OfertaZZdjeciami[]> {
  const supabase = createPublicClient();
  const filters = options?.filters;

  let query = supabase
    .from("oferty")
    .select("*, oferty_zdjecia(*)")
    .neq("status", "ukryta")
    .not("slug", "is", null)
    .order("data_utworzenia", { ascending: false })
    .order("kolejnosc", { referencedTable: "oferty_zdjecia", ascending: true });

  if (filters?.typ) {
    query = query.in("typ_nieruchomosci", CATEGORY_TYPE_MAP[filters.typ]);
  }
  if (filters?.transakcja) {
    query = query.eq("typ_transakcji", filters.transakcja);
  }
  if (filters?.lokalizacja) {
    const term = `%${filters.lokalizacja}%`;
    query = query.or(`miasto.ilike.${term},dzielnica.ilike.${term}`);
  }
  if (filters?.cenaOd != null) {
    query = query.gte("cena", filters.cenaOd);
  }
  if (filters?.cenaDo != null) {
    query = query.lte("cena", filters.cenaDo);
  }
  if (filters?.powOd != null) {
    query = query.gte("powierzchnia", filters.powOd);
  }
  if (filters?.powDo != null) {
    query = query.lte("powierzchnia", filters.powDo);
  }
  if (filters?.cenaM2 != null) {
    query = query.lte("cena_za_m2", filters.cenaM2);
  }
  if (filters?.pokoje != null) {
    query = query.eq("liczba_pokoi", filters.pokoje);
  }
  if (filters?.pietro != null) {
    query = query.eq("pietro", filters.pietro);
  }
  if (filters?.rok != null) {
    query = query.eq("rok_budowy", filters.rok);
  }
  if (filters?.rynek) {
    query = query.eq("rynek", filters.rynek);
  }
  if (filters?.pietraBudynku != null) {
    query = query.eq("liczba_pieter_w_budynku", filters.pietraBudynku);
  }

  if (options?.featuredOnHomepage) {
    query = query.eq("wyrozniona_na_stronie_glownej", true);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as OfertaZZdjeciami[];
}

export async function fetchPublicOfferBySlug(
  slug: string
): Promise<OfertaZZdjeciami | null> {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("oferty")
    .select("*, oferty_zdjecia(*)")
    .eq("slug", slug)
    .neq("status", "ukryta")
    .order("kolejnosc", { referencedTable: "oferty_zdjecia", ascending: true })
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as OfertaZZdjeciami | null;
}

export async function fetchPublicOfferSlugs(): Promise<
  { slug: string; data_aktualizacji: string }[]
> {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("oferty")
    .select("slug, data_aktualizacji")
    .neq("status", "ukryta")
    .not("slug", "is", null);

  if (error) throw new Error(error.message);

  return (data ?? []).filter(
    (row): row is { slug: string; data_aktualizacji: string } => Boolean(row.slug)
  );
}
