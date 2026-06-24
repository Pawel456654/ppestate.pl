import "server-only";

import { buildOfferSlug, TYP_NIERUCHOMOSCI_LABELS } from "@/lib/offers";
import { applyGeneratedSeo } from "@/lib/offer-seo";
import type {
  Database,
  OfertaRynek,
  OfertaStatus,
  OfertaTypNieruchomosci,
  OfertaTypTransakcji,
} from "@/types/database";
import { readEstiId, readEstiUpdateDate } from "./offers";
import { readInt, readNumber, readString } from "./read";
import type { EstiRawOffer, EstiRawPhoto } from "./types";

type OfertaInsert = Database["public"]["Tables"]["oferty"]["Insert"];

export type MappedEstiPhoto = { url: string; kolejnosc: number };

export type MappedEstiOffer = {
  estiId: string;
  insert: OfertaInsert;
  photos: MappedEstiPhoto[];
};

/** Status Esti → status oferty na stronie (sekcja 6.2 planu). */
export function mapEstiStatus(status: number | null): OfertaStatus {
  switch (status) {
    case 3:
    case 99:
      return "aktywna";
    case 4:
      return "rezerwacja";
    case 7:
      return "sprzedana";
    case 9:
      return "ukryta";
    default:
      return "ukryta";
  }
}

/** Typ nieruchomości Esti → enum (sekcja 6.3). Null = nieznany typ. */
export function mapEstiType(typeId: number | null): OfertaTypNieruchomosci | null {
  switch (typeId) {
    case 1:
      return "dom";
    case 2:
      return "mieszkanie";
    case 3:
      return "dzialka";
    case 4:
    case 8:
      return "lokal_komercyjny";
    case 7:
      return "biuro";
    case 9:
      return "hala";
    default:
      return null;
  }
}

export function mapEstiTransaction(
  transaction: number | null
): OfertaTypTransakcji {
  if (transaction === 132) return "wynajem";
  return "sprzedaz";
}

export function mapEstiMarket(market: number | null): OfertaRynek | null {
  if (market === 10) return "pierwotny";
  if (market === 11) return "wtorny";
  return null;
}

function mapEstiCurrency(offer: EstiRawOffer): string {
  const raw = readString(offer, ["priceCurrency", "price_currency", "currency"]);
  if (raw && /^[A-Za-z]{3}$/.test(raw)) return raw.toUpperCase();
  return "PLN";
}

const PHOTO_ARRAY_KEYS = [
  "pictures",
  "photos",
  "images",
  "zdjecia",
  "gallery",
  "files",
];

const PHOTO_URL_KEYS = [
  "urlNormal",
  "url_normal",
  "url",
  "urlBig",
  "urlThumb",
  "file",
  "src",
  "image",
  "path",
  "link",
];

function photoUrlFrom(photo: EstiRawPhoto): string | null {
  if (typeof photo === "string") {
    const trimmed = photo.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (photo && typeof photo === "object") {
    return readString(photo as Record<string, unknown>, PHOTO_URL_KEYS);
  }
  return null;
}

/** Wyciąga listę zdjęć z oferty Esti, zachowując kolejność. */
export function mapEstiPhotos(offer: EstiRawOffer): MappedEstiPhoto[] {
  let rawArray: unknown;
  for (const key of PHOTO_ARRAY_KEYS) {
    if (Array.isArray(offer[key])) {
      rawArray = offer[key];
      break;
    }
  }
  if (!Array.isArray(rawArray)) return [];

  const photos: MappedEstiPhoto[] = [];
  let order = 0;
  for (const item of rawArray as EstiRawPhoto[]) {
    const url = photoUrlFrom(item);
    if (!url) continue;
    photos.push({ url, kolejnosc: order });
    order += 1;
  }
  return photos;
}

function readEstiLocation(offer: EstiRawOffer) {
  return {
    miasto: readString(offer, [
      "locationCityName",
      "location_city_name",
      "city",
      "miasto",
      "cityName",
    ]),
    dzielnica: readString(offer, [
      "locationPrecinctName",
      "location_precinct_name",
      "district",
      "dzielnica",
      "precinct",
    ]),
    ulica: readString(offer, [
      "locationStreetName",
      "location_street_name",
      "street",
      "ulica",
      "streetName",
    ]),
    kod_pocztowy: readString(offer, [
      "locationPostal",
      "location_postal",
      "postal",
      "kod_pocztowy",
      "zipCode",
    ]),
  };
}

/** Buduje tytuł, gdy Esti nie zwraca gotowego (typ + lokalizacja + powierzchnia). */
export function buildTitleFromEsti(
  offer: EstiRawOffer,
  typ: OfertaTypNieruchomosci
): string {
  const existing = readString(offer, ["title", "tytul", "name", "offerName"]);
  if (existing) return existing;

  const typeLabel = TYP_NIERUCHOMOSCI_LABELS[typ] ?? "Nieruchomość";
  const { miasto, dzielnica } = readEstiLocation(offer);
  const area = readNumber(offer, [
    "areaTotal",
    "area_total",
    "area",
    "powierzchnia",
  ]);

  const parts = [typeLabel];
  const location = [miasto, dzielnica].filter(Boolean).join(", ");
  if (location) parts.push(location);
  if (area != null) parts.push(`${new Intl.NumberFormat("pl-PL").format(area)} m²`);

  return parts.join(" — ");
}

/**
 * Mapuje surową ofertę Esti na rekord `oferty` + listę zdjęć.
 * Zwraca null, gdy brak `esti_id` lub typ nieruchomości jest nieznany
 * (oferta jest wtedy pomijana, a sync loguje ostrzeżenie).
 */
export function mapEstiOfferToSupabase(
  offer: EstiRawOffer
): MappedEstiOffer | { skipped: true; reason: string; estiId: string | null } {
  const estiId = readEstiId(offer);
  if (!estiId) {
    return { skipped: true, reason: "Brak esti_id", estiId: null };
  }

  const typeId = readInt(offer, ["typeId", "type_id", "mainTypeId", "type"]);
  const typ = mapEstiType(typeId);
  if (!typ) {
    return {
      skipped: true,
      reason: `Nieznany typ nieruchomości (type_id=${typeId})`,
      estiId,
    };
  }

  const statusId = readInt(offer, ["status", "statusId", "status_id"]);
  const status = mapEstiStatus(statusId);
  const typ_transakcji = mapEstiTransaction(
    readInt(offer, ["transaction", "transactionId", "transaction_id"])
  );
  const rynek = mapEstiMarket(readInt(offer, ["market", "marketId", "market_id"]));
  const location = readEstiLocation(offer);
  const powierzchnia = readNumber(offer, [
    "areaTotal",
    "area_total",
    "area",
    "powierzchnia",
  ]);

  const tytul = buildTitleFromEsti(offer, typ);

  const baseInsert: OfertaInsert = {
    esti_id: estiId,
    zrodlo: "esti",
    tytul,
    opis: readString(offer, ["description", "opis", "descriptionWebsite"]),
    status,
    typ_nieruchomosci: typ,
    typ_transakcji,
    rynek,
    cena: readNumber(offer, ["price", "cena"]),
    waluta: mapEstiCurrency(offer),
    cena_za_m2: readNumber(offer, ["pricePermeter", "price_permeter", "cena_za_m2"]),
    powierzchnia,
    powierzchnia_uzytkowa: readNumber(offer, [
      "areaUsable",
      "area_usable",
      "powierzchnia_uzytkowa",
    ]),
    powierzchnia_dzialki: readNumber(offer, [
      "areaPlot",
      "area_plot",
      "plotArea",
      "powierzchnia_dzialki",
    ]),
    liczba_pokoi: readInt(offer, [
      "apartmentRoomNumber",
      "apartment_room_number",
      "roomNumber",
      "room_number",
      "liczba_pokoi",
    ]),
    pietro: readInt(offer, [
      "apartmentFloor",
      "apartment_floor",
      "floorNumber",
      "floor_number",
      "pietro",
    ]),
    liczba_pieter_w_budynku: readInt(offer, [
      "buildingFloornumber",
      "building_floornumber",
      "liczba_pieter_w_budynku",
    ]),
    rok_budowy: readInt(offer, ["buildingYear", "building_year", "rok_budowy"]),
    miasto: location.miasto,
    dzielnica: location.dzielnica,
    ulica: location.ulica,
    kod_pocztowy: location.kod_pocztowy,
    szerokosc_geo: readNumber(offer, [
      "locationLatitude",
      "location_latitude",
      "latitude",
      "lat",
    ]),
    dlugosc_geo: readNumber(offer, [
      "locationLongitude",
      "location_longitude",
      "longitude",
      "lng",
    ]),
    agent_id: readString(offer, ["userId", "user_id", "agentId", "agent_id"]),
    ostatnio_widziana_w_esti:
      readEstiUpdateDate(offer) ?? new Date().toISOString(),
  };

  const insert = applyGeneratedSeo(
    baseInsert as unknown as Record<string, unknown>
  ) as unknown as OfertaInsert;

  insert.slug = buildOfferSlug({
    tytul,
    typ_nieruchomosci: typ,
    powierzchnia,
    miasto: location.miasto,
    ulica: location.ulica,
    esti_id: estiId,
  });

  return { estiId, insert, photos: mapEstiPhotos(offer) };
}

export function isSkipped(
  result: ReturnType<typeof mapEstiOfferToSupabase>
): result is { skipped: true; reason: string; estiId: string | null } {
  return (result as { skipped?: boolean }).skipped === true;
}
