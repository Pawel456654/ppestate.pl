import {
  CATEGORY_TYPE_MAP,
  type CategoryQueryType,
} from "@/lib/offers";
import type { OfertaRynek, OfertaTypTransakcji } from "@/types/database";

export const PROPERTY_TYPE_LABELS = [
  "Dom",
  "Mieszkanie",
  "Działka",
  "Komercyjne",
] as const;

export type PropertyTypeLabel = (typeof PROPERTY_TYPE_LABELS)[number];

const CATEGORY_TO_PROPERTY_TYPE: Record<CategoryQueryType, PropertyTypeLabel> = {
  domy: "Dom",
  mieszkania: "Mieszkanie",
  dzialki: "Działka",
  przemyslowe: "Komercyjne",
};

const PROPERTY_TYPE_TO_CATEGORY: Record<PropertyTypeLabel, CategoryQueryType> = {
  Dom: "domy",
  Mieszkanie: "mieszkania",
  "Działka": "dzialki",
  Komercyjne: "przemyslowe",
};

export type OfferSearchFilters = {
  typ?: CategoryQueryType;
  transakcja?: OfertaTypTransakcji;
  lokalizacja?: string;
  cenaOd?: number;
  cenaDo?: number;
  powOd?: number;
  powDo?: number;
  cenaM2?: number;
  pokoje?: number;
  pietro?: number;
  rok?: number;
  rynek?: OfertaRynek;
  pietraBudynku?: number;
};

export type OfferSearchFormState = {
  offerType: "Sprzedaż" | "Wynajem";
  propertyType: PropertyTypeLabel | "";
  location: string;
  priceMin: string;
  priceMax: string;
  areaMin: string;
  areaMax: string;
  pricePerMeter: string;
  rooms: string;
  hasElevator: string;
  floor: string;
  buildYear: string;
  marketType: string;
  furnished: string;
  buildingFloors: string;
};

function normalizeCategoryParam(value: string): CategoryQueryType | undefined {
  const normalized = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (normalized in CATEGORY_TYPE_MAP) {
    return normalized as CategoryQueryType;
  }

  return undefined;
}

function readParam(
  params: Record<string, string | string[] | undefined>,
  key: string
): string | undefined {
  const value = params[key];
  if (Array.isArray(value)) return value[0];
  return value || undefined;
}

function readNumber(
  params: Record<string, string | string[] | undefined>,
  key: string
): number | undefined {
  const raw = readParam(params, key);
  if (!raw) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

export function parseOfferSearchParams(
  params: Record<string, string | string[] | undefined>
): OfferSearchFilters {
  const typ = readParam(params, "typ");
  const transakcja = readParam(params, "transakcja");

  return {
    typ: typ ? normalizeCategoryParam(typ) : undefined,
    transakcja:
      transakcja === "sprzedaz" || transakcja === "wynajem"
        ? transakcja
        : undefined,
    lokalizacja: readParam(params, "lokalizacja")?.trim() || undefined,
    cenaOd: readNumber(params, "cena_od"),
    cenaDo: readNumber(params, "cena_do"),
    powOd: readNumber(params, "pow_od"),
    powDo: readNumber(params, "pow_do"),
    cenaM2: readNumber(params, "cena_m2"),
    pokoje: readNumber(params, "pokoje"),
    pietro: readNumber(params, "pietro"),
    rok: readNumber(params, "rok"),
    rynek:
      readParam(params, "rynek") === "pierwotny" ||
      readParam(params, "rynek") === "wtorny"
        ? (readParam(params, "rynek") as OfertaRynek)
        : undefined,
    pietraBudynku: readNumber(params, "pietra_budynku"),
  };
}

export function filtersToFormState(
  filters: OfferSearchFilters
): OfferSearchFormState {
  return {
    offerType: filters.transakcja === "wynajem" ? "Wynajem" : "Sprzedaż",
    propertyType: filters.typ ? CATEGORY_TO_PROPERTY_TYPE[filters.typ] : "",
    location: filters.lokalizacja ?? "",
    priceMin: filters.cenaOd?.toString() ?? "",
    priceMax: filters.cenaDo?.toString() ?? "",
    areaMin: filters.powOd?.toString() ?? "",
    areaMax: filters.powDo?.toString() ?? "",
    pricePerMeter: filters.cenaM2?.toString() ?? "",
    rooms: filters.pokoje?.toString() ?? "",
    hasElevator: "",
    floor: filters.pietro?.toString() ?? "",
    buildYear: filters.rok?.toString() ?? "",
    marketType: filters.rynek ?? "",
    furnished: "",
    buildingFloors: filters.pietraBudynku?.toString() ?? "",
  };
}

export function formStateToFilters(form: OfferSearchFormState): OfferSearchFilters {
  const filters: OfferSearchFilters = {};

  if (form.propertyType) {
    filters.typ = PROPERTY_TYPE_TO_CATEGORY[form.propertyType];
  }
  if (form.offerType === "Wynajem") {
    filters.transakcja = "wynajem";
  } else {
    filters.transakcja = "sprzedaz";
  }

  const location = form.location.trim();
  if (location) filters.lokalizacja = location;

  const cenaOd = Number(form.priceMin);
  if (form.priceMin && Number.isFinite(cenaOd)) filters.cenaOd = cenaOd;

  const cenaDo = Number(form.priceMax);
  if (form.priceMax && Number.isFinite(cenaDo)) filters.cenaDo = cenaDo;

  const powOd = Number(form.areaMin);
  if (form.areaMin && Number.isFinite(powOd)) filters.powOd = powOd;

  const powDo = Number(form.areaMax);
  if (form.areaMax && Number.isFinite(powDo)) filters.powDo = powDo;

  const cenaM2 = Number(form.pricePerMeter);
  if (form.pricePerMeter && Number.isFinite(cenaM2)) filters.cenaM2 = cenaM2;

  const pokoje = Number(form.rooms);
  if (form.rooms && Number.isFinite(pokoje)) filters.pokoje = pokoje;

  const pietro = Number(form.floor);
  if (form.floor && Number.isFinite(pietro)) filters.pietro = pietro;

  const rok = Number(form.buildYear);
  if (form.buildYear && Number.isFinite(rok)) filters.rok = rok;

  if (form.marketType === "pierwotny" || form.marketType === "wtorny") {
    filters.rynek = form.marketType;
  }

  const pietraBudynku = Number(form.buildingFloors);
  if (form.buildingFloors && Number.isFinite(pietraBudynku)) {
    filters.pietraBudynku = pietraBudynku;
  }

  return filters;
}

export function buildOfferSearchQuery(filters: OfferSearchFilters): string {
  const params = new URLSearchParams();

  if (filters.typ) params.set("typ", filters.typ);
  if (filters.transakcja) params.set("transakcja", filters.transakcja);
  if (filters.lokalizacja) params.set("lokalizacja", filters.lokalizacja);
  if (filters.cenaOd != null) params.set("cena_od", String(filters.cenaOd));
  if (filters.cenaDo != null) params.set("cena_do", String(filters.cenaDo));
  if (filters.powOd != null) params.set("pow_od", String(filters.powOd));
  if (filters.powDo != null) params.set("pow_do", String(filters.powDo));
  if (filters.cenaM2 != null) params.set("cena_m2", String(filters.cenaM2));
  if (filters.pokoje != null) params.set("pokoje", String(filters.pokoje));
  if (filters.pietro != null) params.set("pietro", String(filters.pietro));
  if (filters.rok != null) params.set("rok", String(filters.rok));
  if (filters.rynek) params.set("rynek", filters.rynek);
  if (filters.pietraBudynku != null) {
    params.set("pietra_budynku", String(filters.pietraBudynku));
  }

  return params.toString();
}

export function hasActiveFilters(filters: OfferSearchFilters): boolean {
  return Object.values(filters).some((value) => value != null && value !== "");
}
