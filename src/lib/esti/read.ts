/**
 * Defensywne odczytywanie wartości z luźnych rekordów Esti.
 * Esti potrafi zwracać te same dane pod różnymi kluczami (snake_case /
 * camelCase) i jako string lub number — te helpery normalizują dostęp.
 */

export function pick(
  record: Record<string, unknown>,
  keys: string[]
): unknown {
  for (const key of keys) {
    const value = record[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

export function readString(
  record: Record<string, unknown>,
  keys: string[]
): string | null {
  const value = pick(record, keys);
  if (value == null) return null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return null;
}

export function readNumber(
  record: Record<string, unknown>,
  keys: string[]
): number | null {
  const value = pick(record, keys);
  if (value == null) return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const normalized = value.replace(/\s+/g, "").replace(",", ".");
    const n = Number(normalized);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function readInt(
  record: Record<string, unknown>,
  keys: string[]
): number | null {
  const n = readNumber(record, keys);
  return n == null ? null : Math.trunc(n);
}
