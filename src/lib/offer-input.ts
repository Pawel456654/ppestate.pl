import type { Database, Oferta } from "@/types/database";

type OfertaInsert = Database["public"]["Tables"]["oferty"]["Insert"];
type OfertaUpdate = Database["public"]["Tables"]["oferty"]["Update"];

const TEXT_FIELDS = [
  "tytul",
  "opis",
  "esti_id",
  "slug",
  "miasto",
  "dzielnica",
  "ulica",
  "kod_pocztowy",
  "link_google_maps",
  "agent_id",
  "waluta",
] as const;

const ENUM_FIELDS = [
  "zrodlo",
  "status",
  "typ_nieruchomosci",
  "typ_transakcji",
  "rynek",
] as const;

const DECIMAL_FIELDS = [
  "cena",
  "cena_za_m2",
  "powierzchnia",
  "powierzchnia_uzytkowa",
  "powierzchnia_dzialki",
  "szerokosc_geo",
  "dlugosc_geo",
] as const;

const INT_FIELDS = [
  "liczba_pokoi",
  "pietro",
  "liczba_pieter_w_budynku",
  "rok_budowy",
] as const;

const BOOL_FIELDS = ["wyrozniona", "wyrozniona_na_stronie_glownej"] as const;

const TIMESTAMP_FIELDS = ["ostatnio_widziana_w_esti"] as const;

function cleanText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function cleanNumber(value: unknown, integer: boolean): number | null {
  if (value === "" || value == null) return null;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return null;
  return integer ? Math.trunc(n) : n;
}

/**
 * Buduje bezpieczny obiekt oferty z danych wejściowych — tylko znane pola,
 * z koercją typów. `partial` = true pomija pola, których nie przesłano
 * (do aktualizacji), inaczej zapisuje wartości domyślne/null.
 */
export function sanitizeOfferInput(
  body: Record<string, unknown>,
  partial = false
): OfertaInsert | OfertaUpdate {
  const out: Record<string, unknown> = {};
  const has = (key: string) => Object.prototype.hasOwnProperty.call(body, key);

  for (const field of TEXT_FIELDS) {
    if (partial && !has(field)) continue;
    out[field] = cleanText(body[field]);
  }
  for (const field of ENUM_FIELDS) {
    if (partial && !has(field)) continue;
    out[field] = cleanText(body[field]);
  }
  for (const field of DECIMAL_FIELDS) {
    if (partial && !has(field)) continue;
    out[field] = cleanNumber(body[field], false);
  }
  for (const field of INT_FIELDS) {
    if (partial && !has(field)) continue;
    out[field] = cleanNumber(body[field], true);
  }
  for (const field of BOOL_FIELDS) {
    if (partial && !has(field)) continue;
    out[field] = Boolean(body[field]);
  }
  for (const field of TIMESTAMP_FIELDS) {
    if (partial && !has(field)) continue;
    out[field] = cleanText(body[field]);
  }

  if (out.waluta == null && (!partial || has("waluta"))) {
    out.waluta = "PLN";
  }

  return out as OfertaInsert | OfertaUpdate;
}
