import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Database,
  EstiSyncMode,
  Oferta,
} from "@/types/database";
import { createEstiClient } from "./client";
import { EstiError } from "./errors";
import {
  fetchActiveBasicList,
  fetchAllActiveOffers,
  fetchActiveOffersPage,
} from "./offers";
import {
  isSkipped,
  mapEstiOfferToSupabase,
  type MappedEstiOffer,
  type MappedEstiPhoto,
} from "./map-offer";

type AdminClient = ReturnType<typeof createAdminClient>;
type OfertaInsert = Database["public"]["Tables"]["oferty"]["Insert"];

const LOCK_STALE_MINUTES = 10;

export type EstiSyncResult = {
  ok: boolean;
  mode: EstiSyncMode;
  added: number;
  updated: number;
  hidden: number;
  errors: number;
  skipped: number;
  durationMs: number;
  message?: string;
};

type ExistingOffer = Pick<
  Oferta,
  "id" | "esti_id" | "zrodlo" | "status" | "slug" | "status_reczny"
>;

/** Pola, których sync NIGDY nie nadpisuje przy aktualizacji oferty z Esti. */
const PRESERVED_ON_UPDATE = [
  "wyrozniona",
  "wyrozniona_na_stronie_glownej",
] as const;

async function acquireLock(supabase: AdminClient): Promise<boolean> {
  const staleBefore = new Date(
    Date.now() - LOCK_STALE_MINUTES * 60_000
  ).toISOString();

  const { data, error } = await supabase
    .from("esti_sync_state")
    .update({ is_running: true, running_since: new Date().toISOString() })
    .eq("id", 1)
    .or(`is_running.eq.false,running_since.lt.${staleBefore}`)
    .select("id");

  if (error) throw new EstiError(`Nie udało się uzyskać blokady sync: ${error.message}`);
  return (data?.length ?? 0) > 0;
}

async function releaseLock(supabase: AdminClient): Promise<void> {
  await supabase
    .from("esti_sync_state")
    .update({ is_running: false, running_since: null })
    .eq("id", 1);
}

async function getLastUpdateDate(supabase: AdminClient): Promise<string | null> {
  const { data } = await supabase
    .from("esti_sync_state")
    .select("last_update_date_used, last_successful_sync")
    .eq("id", 1)
    .maybeSingle();
  return data?.last_update_date_used ?? null;
}

/** Format daty wymagany przez Esti: YYYY-MM-DD HH:MM:SS (UTC). */
function toEstiDate(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

async function fetchExistingEstiOffers(
  supabase: AdminClient
): Promise<Map<string, ExistingOffer>> {
  const map = new Map<string, ExistingOffer>();
  const { data, error } = await supabase
    .from("oferty")
    .select("id, esti_id, zrodlo, status, slug, status_reczny")
    .not("esti_id", "is", null);

  if (error) throw new EstiError(`Błąd odczytu istniejących ofert: ${error.message}`);

  for (const row of (data ?? []) as ExistingOffer[]) {
    if (row.esti_id) map.set(row.esti_id, row);
  }
  return map;
}

/** Zastępuje zdjęcia z Esti dla oferty; zdjęcia upload/url pozostają nietknięte. */
async function replaceEstiPhotos(
  supabase: AdminClient,
  ofertaId: string,
  photos: MappedEstiPhoto[]
): Promise<void> {
  await supabase
    .from("oferty_zdjecia")
    .delete()
    .eq("oferta_id", ofertaId)
    .eq("zrodlo", "esti");

  if (photos.length > 0) {
    await supabase.from("oferty_zdjecia").insert(
      photos.map((p) => ({
        oferta_id: ofertaId,
        url: p.url,
        sciezka: null,
        kolejnosc: p.kolejnosc,
        czy_glowne: false,
        zrodlo: "esti" as const,
        typ: "zdjecie" as const,
      }))
    );
  }

  // Upewnij się, że oferta ma dokładnie jedno zdjęcie główne.
  const { data: all } = await supabase
    .from("oferty_zdjecia")
    .select("id, czy_glowne, kolejnosc, typ")
    .eq("oferta_id", ofertaId)
    .order("kolejnosc", { ascending: true });

  const rows = (all ?? []) as {
    id: string;
    czy_glowne: boolean;
    kolejnosc: number;
    typ: string;
  }[];
  const hasMainImage = rows.some((r) => r.czy_glowne && r.typ === "zdjecie");
  const firstImage = rows.find((r) => r.typ === "zdjecie");
  if (firstImage && !hasMainImage) {
    await supabase
      .from("oferty_zdjecia")
      .update({ czy_glowne: true })
      .eq("id", firstImage.id);
  }
}

type UpsertCounters = { added: number; updated: number; errors: number };

async function upsertOffer(
  supabase: AdminClient,
  mapped: MappedEstiOffer,
  existing: ExistingOffer | undefined,
  counters: UpsertCounters,
  details: { errors: string[] }
): Promise<void> {
  try {
    // Oferty ręczne (zrodlo='strona') nigdy nie są dotykane przez sync.
    if (existing && existing.zrodlo !== "esti") return;

    if (!existing) {
      const { data, error } = await supabase
        .from("oferty")
        .insert(mapped.insert as OfertaInsert)
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      counters.added += 1;
      await replaceEstiPhotos(supabase, (data as { id: string }).id, mapped.photos);
      return;
    }

    const updatePayload: Record<string, unknown> = { ...mapped.insert };
    // Zachowaj ręcznie ustawione flagi wyróżnienia i istniejący slug (URL).
    for (const field of PRESERVED_ON_UPDATE) delete updatePayload[field];
    if (existing.slug) delete updatePayload.slug;
    // Jeśli admin ręcznie ustawił status, sync nie nadpisuje go.
    if (existing.status_reczny) delete updatePayload.status;

    const { error } = await supabase
      .from("oferty")
      .update(updatePayload as Database["public"]["Tables"]["oferty"]["Update"])
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
    counters.updated += 1;
    await replaceEstiPhotos(supabase, existing.id, mapped.photos);
  } catch (err) {
    counters.errors += 1;
    const message = err instanceof Error ? err.message : String(err);
    details.errors.push(`esti_id=${mapped.estiId}: ${message}`);
  }
}

/**
 * Ukrywa oferty z Esti, które całkowicie zniknęły ze wszystkich synchronizowanych
 * statusów (wycofane, usunięte). Oferty ze statusem sprzedana/rezerwacja pozostają
 * widoczne — po rozszerzeniu filtra statusów są w activeEstiIds.
 */
async function reconcileRemovedOffers(
  supabase: AdminClient,
  activeEstiIds: Set<string>,
  existing: Map<string, ExistingOffer>
): Promise<number> {
  const toHide: string[] = [];
  for (const [estiId, offer] of existing) {
    if (offer.zrodlo !== "esti") continue;
    if (offer.status === "ukryta") continue;
    if (activeEstiIds.has(estiId)) continue;
    toHide.push(offer.id);
  }

  if (toHide.length === 0) return 0;

  const { error } = await supabase
    .from("oferty")
    .update({ status: "ukryta" })
    .in("id", toHide);
  if (error) throw new EstiError(`Błąd ukrywania ofert: ${error.message}`);
  return toHide.length;
}

async function writeLog(
  supabase: AdminClient,
  startedAt: string,
  result: EstiSyncResult,
  details: { errors: string[]; skipped: string[] }
): Promise<void> {
  await supabase.from("esti_sync_log").insert({
    started_at: startedAt,
    finished_at: new Date().toISOString(),
    success: result.ok,
    mode: result.mode,
    added: result.added,
    updated: result.updated,
    hidden: result.hidden,
    errors: result.errors,
    error_message: result.message ?? null,
    details: {
      skipped: result.skipped,
      skippedDetails: details.skipped.slice(0, 50),
      errorDetails: details.errors.slice(0, 50),
    },
  });
}

/**
 * Uruchamia synchronizację ofert EstiCRM → Supabase.
 * Zwraca podsumowanie i zapisuje wpis do esti_sync_log.
 */
export async function runEstiSync(options: {
  mode: EstiSyncMode;
}): Promise<EstiSyncResult> {
  const startedAt = new Date().toISOString();
  const startMs = Date.now();
  const supabase = createAdminClient();
  const details = { errors: [] as string[], skipped: [] as string[] };

  const baseResult: EstiSyncResult = {
    ok: false,
    mode: options.mode,
    added: 0,
    updated: 0,
    hidden: 0,
    errors: 0,
    skipped: 0,
    durationMs: 0,
  };

  const locked = await acquireLock(supabase);
  if (!locked) {
    return { ...baseResult, message: "Synchronizacja już trwa." };
  }

  try {
    const client = createEstiClient();
    const { statusFilter, batchSize } = client.config;

    // 1. Pobierz oferty do upsertu.
    let toUpsert;
    if (options.mode === "incremental") {
      const lastUpdate = await getLastUpdateDate(supabase);
      toUpsert = await fetchAllActiveOffersIncremental(client, {
        status: statusFilter,
        batchSize,
        updateDate: lastUpdate ?? undefined,
      });
    } else {
      toUpsert = await fetchAllActiveOffers(client, {
        status: statusFilter,
        batchSize,
      });
    }

    const existing = await fetchExistingEstiOffers(supabase);
    const counters: UpsertCounters = { added: 0, updated: 0, errors: 0 };

    for (const raw of toUpsert) {
      const mapped = mapEstiOfferToSupabase(raw);
      if (isSkipped(mapped)) {
        details.skipped.push(`${mapped.estiId ?? "?"}: ${mapped.reason}`);
        continue;
      }
      await upsertOffer(supabase, mapped, existing.get(mapped.estiId), counters, details);
    }

    // Reconciliacja wyłączona — oferty z Esti nigdy nie są automatycznie ukrywane.
    // Status ukryta można ustawić wyłącznie ręcznie z panelu admina.
    const hidden = 0;

    // 3. Zapisz stan dla kolejnego syncu przyrostowego.
    await supabase
      .from("esti_sync_state")
      .update({
        last_successful_sync: new Date().toISOString(),
        last_update_date_used: toEstiDate(new Date()),
      })
      .eq("id", 1);

    const result: EstiSyncResult = {
      ok: true,
      mode: options.mode,
      added: counters.added,
      updated: counters.updated,
      hidden,
      errors: counters.errors,
      skipped: details.skipped.length,
      durationMs: Date.now() - startMs,
    };
    await writeLog(supabase, startedAt, result, details);
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const result: EstiSyncResult = {
      ...baseResult,
      ok: false,
      durationMs: Date.now() - startMs,
      message,
    };
    await writeLog(supabase, startedAt, result, details);
    return result;
  } finally {
    await releaseLock(supabase);
  }
}

/**
 * Tryb przyrostowy: pobiera zmienione oferty od ostatniego syncu.
 * Jeśli brak zapamiętanej daty (pierwszy raz), pobiera wszystkie aktywne.
 */
async function fetchAllActiveOffersIncremental(
  client: ReturnType<typeof createEstiClient>,
  args: { status: string; batchSize: number; updateDate?: string }
) {
  if (!args.updateDate) {
    return fetchAllActiveOffers(client, {
      status: args.status,
      batchSize: args.batchSize,
    });
  }

  const all = [];
  let skip = 0;
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

export type EstiSyncStatus = {
  lastSuccessfulSync: string | null;
  isRunning: boolean;
  lastLog: {
    finishedAt: string | null;
    success: boolean | null;
    mode: string;
    added: number;
    updated: number;
    hidden: number;
    errors: number;
    errorMessage: string | null;
  } | null;
};

export async function getEstiSyncStatus(): Promise<EstiSyncStatus> {
  const supabase = createAdminClient();

  const [{ data: state }, { data: logs }] = await Promise.all([
    supabase
      .from("esti_sync_state")
      .select("last_successful_sync, is_running")
      .eq("id", 1)
      .maybeSingle(),
    supabase
      .from("esti_sync_log")
      .select("finished_at, success, mode, added, updated, hidden, errors, error_message")
      .order("started_at", { ascending: false })
      .limit(1),
  ]);

  const log = (logs ?? [])[0];

  return {
    lastSuccessfulSync: state?.last_successful_sync ?? null,
    isRunning: state?.is_running ?? false,
    lastLog: log
      ? {
          finishedAt: log.finished_at,
          success: log.success,
          mode: log.mode,
          added: log.added,
          updated: log.updated,
          hidden: log.hidden,
          errors: log.errors,
          errorMessage: log.error_message,
        }
      : null,
  };
}
