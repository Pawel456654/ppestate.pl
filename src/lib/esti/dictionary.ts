import "server-only";

import type { EstiClient } from "./client";
import type { EstiDictionary } from "./types";

/**
 * Pobiera słowniki i mapowanie pól Esti. Cache'owane in-memory na czas
 * życia procesu (słowniki zmieniają się rzadko). Błędy są tolerowane —
 * mapowanie ofert ma sensowne wartości domyślne, więc brak słowników nie
 * przerywa synchronizacji.
 */
let cached: EstiDictionary | null = null;

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export async function loadEstiDictionary(
  client: EstiClient,
  options?: { force?: boolean }
): Promise<EstiDictionary> {
  if (cached && !options?.force) return cached;

  const [rawResult, mappingResult] = await Promise.allSettled([
    client.get("offer/dictionary"),
    client.get("offer/mapping"),
  ]);

  const dictionary: EstiDictionary = {
    raw: rawResult.status === "fulfilled" ? asRecord(rawResult.value) : {},
    mapping:
      mappingResult.status === "fulfilled" ? asRecord(mappingResult.value) : {},
  };

  cached = dictionary;
  return dictionary;
}

export function clearEstiDictionaryCache(): void {
  cached = null;
}
