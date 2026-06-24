"use client";

import { useCallback, useEffect, useState } from "react";

type SyncStatus = {
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

function formatDate(value: string | null): string {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString("pl-PL", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return value;
  }
}

export default function SyncBar({ onSynced }: { onSynced: () => void }) {
  const [status, setStatus] = useState<SyncStatus | null>(null);
  const [configured, setConfigured] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/sync-esti", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setStatus(data.status as SyncStatus);
      setConfigured(Boolean(data.configured));
    } catch {
      // status to informacja pomocnicza — błąd ignorujemy
    }
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  async function runSync(mode: "incremental" | "full") {
    if (syncing) return;
    setSyncing(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch(`/api/admin/sync-esti?mode=${mode}`, {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message ?? "Synchronizacja nie powiodła się.");
      }
      setMessage(
        `Gotowe: dodano ${data.added}, zaktualizowano ${data.updated}, ukryto ${data.hidden}` +
          (data.errors ? `, błędy: ${data.errors}` : "")
      );
      await loadStatus();
      onSynced();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił błąd.");
    } finally {
      setSyncing(false);
    }
  }

  const last = status?.lastLog;

  return (
    <div className="mb-6 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-slate-600">
          <span className="font-semibold text-slate-800">Synchronizacja EstiCRM</span>
          {!configured ? (
            <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
              Brak konfiguracji (ESTI_COMPANY_ID / ESTI_API_TOKEN)
            </span>
          ) : (
            <span className="ml-2 text-xs text-slate-400">
              Ostatni sync: {formatDate(status?.lastSuccessfulSync ?? null)}
              {last
                ? ` · dodano ${last.added}, zaktualizowano ${last.updated}, ukryto ${last.hidden}` +
                  (last.errors ? `, błędy ${last.errors}` : "")
                : ""}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => runSync("incremental")}
            disabled={syncing || !configured}
            className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
          >
            {syncing ? "Synchronizuję…" : "Synchronizuj teraz"}
          </button>
          <button
            onClick={() => runSync("full")}
            disabled={syncing || !configured}
            title="Pełny import wszystkich aktywnych ofert"
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
          >
            Pełny sync
          </button>
        </div>
      </div>

      {message && (
        <p className="mt-2 text-xs font-medium text-emerald-600">{message}</p>
      )}
      {error && <p className="mt-2 text-xs font-medium text-rose-600">{error}</p>}
      {last?.success === false && last.errorMessage && !error && (
        <p className="mt-2 text-xs font-medium text-rose-600">
          Ostatni sync zakończył się błędem: {last.errorMessage}
        </p>
      )}
    </div>
  );
}
