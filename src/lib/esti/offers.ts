import "server-only";

import type { EstiClient } from "./client";
import { readString } from "./read";
import type {
  EstiBasicEntry,
  EstiListEnvelope,
  EstiRawOffer,
} from "./types";

const ESTI_ID_KEYS = ["id", "offerId", "offer_id", "estiId", "esti_id"];
const UPDATE_DATE_KEYS = [
  "update_date",
  "updateDate",
  "dataAktualizacji",
  "modified",
  "modifiedAt",
];

/** Normalizuje pojedynczą ofertę lub tablicę do zawsze-tablicy. */
function normalizeToOfferArray(value: unknown): EstiRawOffer[] {
  if (value == null) return [];
  if (Array.isArray(value)) return value as EstiRawOffer[];
  if (typeof value === "object") return [value as EstiRawOffer];
  return [];
}

/** Wyciąga tablicę ofert z dowolnego wariantu koperty odpowiedzi Esti. */
function extractOffers(payload: unknown): EstiRawOffer[] {
  if (Array.isArray(payload)) return payload as EstiRawOffer[];
  if (payload && typeof payload === "object") {
    const env = payload as EstiListEnvelope & { data?: unknown };
    const candidate = env.data ?? env.offers ?? env.items;
    if (candidate !== undefined) return normalizeToOfferArray(candidate);
  }
  return [];
}

export function readEstiId(offer: EstiRawOffer): string | null {
  return readString(offer, ESTI_ID_KEYS);
}

export function readEstiUpdateDate(offer: EstiRawOffer): string | null {
  return readString(offer, UPDATE_DATE_KEYS);
}

/**
 * Pobiera jedną stronę aktywnych ofert (pełne dane).
 * `status` w formacie Esti, np. "3,99".
 */
export async function fetchActiveOffersPage(
  client: EstiClient,
  args: { skip: number; take: number; status: string; updateDate?: string }
): Promise<EstiRawOffer[]> {
  const payload = await client.get("offer/list", {
    skip: args.skip,
    take: args.take,
    status: args.status,
    updateDate: args.updateDate,
  });
  return extractOffers(payload);
}

/** Pobiera wszystkie aktywne oferty z paginacją skip/take. */
export async function fetchAllActiveOffers(
  client: EstiClient,
  args: { status: string; batchSize: number; updateDate?: string }
): Promise<EstiRawOffer[]> {
  const all: EstiRawOffer[] = [];
  let skip = 0;
  // Twardy limit stron, by uniknąć pętli nieskończonej przy błędnej paginacji.
  const MAX_PAGES = 200;

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const batch = await fetchActiveOffersPage(client, {
      skip,
      take: args.batchSize,
      status: args.status,
      updateDate: args.updateDate,
    });
    if (batch.length === 0) break;
    all.push(...batch);
    if (batch.length < args.batchSize) break;
    skip += args.batchSize;
  }

  return all;
}

/**
 * Lekka lista aktywnych ofert (ID + update_date) do reconciliacji.
 * Gdy `basic-list` nie jest dostępne, wraca na pełną listę.
 */
export async function fetchActiveBasicList(
  client: EstiClient,
  args: { status: string; batchSize: number }
): Promise<EstiBasicEntry[]> {
  let raw: EstiRawOffer[];
  try {
    const payload = await client.get("offer/basic-list", {
      status: args.status,
    });
    raw = extractOffers(payload);
    if (raw.length === 0) {
      raw = await fetchAllActiveOffers(client, args);
    }
  } catch {
    raw = await fetchAllActiveOffers(client, args);
  }

  const entries: EstiBasicEntry[] = [];
  for (const offer of raw) {
    const estiId = readEstiId(offer);
    if (!estiId) continue;
    entries.push({ estiId, updateDate: readEstiUpdateDate(offer) });
  }
  return entries;
}

export async function fetchOfferDetails(
  client: EstiClient,
  id: string
): Promise<EstiRawOffer | null> {
  const payload = await client.get("offer/details", { id });
  if (Array.isArray(payload)) return (payload[0] as EstiRawOffer) ?? null;
  if (payload && typeof payload === "object") {
    const env = payload as EstiListEnvelope & { offer?: EstiRawOffer };
    if (env.offer) return env.offer;
    const list = extractOffers(payload);
    if (list.length > 0) return list[0];
    return payload as EstiRawOffer;
  }
  return null;
}
