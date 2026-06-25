import "server-only";

import { getEstiConfig, type EstiConfig } from "./config";
import {
  EstiAuthError,
  EstiParseError,
  EstiRequestError,
} from "./errors";

const REQUEST_TIMEOUT_MS = 20_000;
const MAX_RETRIES = 2;

export type EstiClient = {
  config: EstiConfig;
  get: <T = unknown>(
    path: string,
    params?: Record<string, string | number | undefined>
  ) => Promise<T>;
};

function buildUrl(
  config: EstiConfig,
  path: string,
  params?: Record<string, string | number | undefined>
): string {
  const url = new URL(`${config.baseUrl}/${path.replace(/^\/+/, "")}`);
  url.searchParams.set("company", config.companyId);
  url.searchParams.set("token", config.token);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestOnce<T>(
  config: EstiConfig,
  path: string,
  params?: Record<string, string | number | undefined>
): Promise<T> {
  const url = buildUrl(config, path, params);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
      cache: "no-store",
    });
  } finally {
    clearTimeout(timeout);
  }

  if (response.status === 401 || response.status === 403) {
    throw new EstiAuthError(
      `EstiCRM odrzuciło autoryzację (HTTP ${response.status}). Sprawdź company/token.`
    );
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new EstiRequestError(
      `EstiCRM HTTP ${response.status} dla /${path}. ${body.slice(0, 300)}`.trim(),
      response.status
    );
  }

  const text = await response.text();
  if (!text.trim()) {
    return undefined as T;
  }

  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new EstiParseError(
      `Nie udało się sparsować odpowiedzi JSON z /${path}: ${text.slice(0, 200)}`
    );
  }

  // Esti często zwraca HTTP 200 z { status/success: false, message: "..." } zamiast błędu HTTP.
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    const record = payload as Record<string, unknown>;
    if (record.status === false || record.success === false) {
      const msg =
        typeof record.message === "string" ? record.message : "Nieznany błąd EstiCRM.";
      throw new EstiRequestError(`EstiCRM /${path}: ${msg}`, response.status);
    }
  }

  return payload as T;
}

/** Czy błąd warto ponowić (timeout / 5xx / 429). */
function isRetryable(error: unknown): boolean {
  if (error instanceof EstiRequestError) {
    return error.status >= 500 || error.status === 429;
  }
  if (error instanceof DOMException && error.name === "AbortError") return true;
  if (error instanceof TypeError) return true; // network error
  return false;
}

export function createEstiClient(): EstiClient {
  const config = getEstiConfig();

  async function get<T = unknown>(
    path: string,
    params?: Record<string, string | number | undefined>
  ): Promise<T> {
    let lastError: unknown;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
      try {
        return await requestOnce<T>(config, path, params);
      } catch (error) {
        lastError = error;
        if (!isRetryable(error) || attempt === MAX_RETRIES) throw error;
        await sleep(500 * (attempt + 1));
      }
    }
    throw lastError;
  }

  return { config, get };
}
