import "server-only";

import { EstiConfigError } from "./errors";

export type EstiConfig = {
  baseUrl: string;
  companyId: string;
  token: string;
  statusFilter: string;
  batchSize: number;
};

const DEFAULT_BASE_URL = "https://app.esticrm.pl/apiClient";
const DEFAULT_STATUS_FILTER = "3,4,7,99";
const DEFAULT_BATCH_SIZE = 50;

/**
 * Wczytuje konfigurację Esti ze zmiennych środowiskowych.
 * Rzuca EstiConfigError, jeśli brakuje wymaganych danych — dzięki temu
 * brak credentials nie wywala buildu, tylko zwraca czytelny błąd przy syncu.
 */
export function getEstiConfig(): EstiConfig {
  const companyId = process.env.ESTI_COMPANY_ID?.trim();
  const token = process.env.ESTI_API_TOKEN?.trim();

  if (!companyId || !token) {
    throw new EstiConfigError(
      "Brak konfiguracji EstiCRM. Ustaw ESTI_COMPANY_ID i ESTI_API_TOKEN."
    );
  }

  const baseUrl = (process.env.ESTI_API_BASE_URL?.trim() || DEFAULT_BASE_URL).replace(
    /\/+$/,
    ""
  );

  const statusFilter =
    process.env.ESTI_SYNC_STATUS_FILTER?.trim() || DEFAULT_STATUS_FILTER;

  const batchSizeRaw = Number(process.env.ESTI_SYNC_BATCH_SIZE);
  const batchSize =
    Number.isFinite(batchSizeRaw) && batchSizeRaw > 0
      ? Math.min(Math.trunc(batchSizeRaw), 200)
      : DEFAULT_BATCH_SIZE;

  return { baseUrl, companyId, token, statusFilter, batchSize };
}

export function isEstiConfigured(): boolean {
  return Boolean(
    process.env.ESTI_COMPANY_ID?.trim() && process.env.ESTI_API_TOKEN?.trim()
  );
}
