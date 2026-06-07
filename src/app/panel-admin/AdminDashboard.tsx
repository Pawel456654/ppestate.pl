/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { OfertaZZdjeciami, OfertaTypNieruchomosci } from "@/types/database";
import {
  STATUS_BADGE_CLASSES,
  STATUS_LABELS,
  TYP_NIERUCHOMOSCI_OPTIONS,
  TYP_TRANSAKCJI_LABELS,
  formatCena,
} from "@/lib/offers";
import OfferForm from "./OfferForm";

type FormTarget = OfertaZZdjeciami | "new" | null;

export default function AdminDashboard() {
  const router = useRouter();
  const [oferty, setOferty] = useState<OfertaZZdjeciami[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormTarget>(null);
  const [deleteTarget, setDeleteTarget] = useState<OfertaZZdjeciami | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [katFilter, setKatFilter] = useState<string>("all");
  const [query, setQuery] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/offers", { cache: "no-store" });
      if (res.status === 401) {
        router.refresh();
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Błąd wczytywania ofert.");
      setOferty(data.oferty);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił błąd.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openDeleteDialog(o: OfertaZZdjeciami) {
    setDeleteTarget(o);
    setDeleteConfirmText("");
  }

  function closeDeleteDialog() {
    if (deleting) return;
    setDeleteTarget(null);
    setDeleteConfirmText("");
  }

  async function confirmDelete() {
    if (!deleteTarget || deleteConfirmText !== deleteTarget.tytul) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/offers/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setOferty((prev) => prev.filter((x) => x.id !== deleteTarget.id));
        setDeleteTarget(null);
        setDeleteConfirmText("");
      } else {
        alert("Nie udało się usunąć oferty.");
      }
    } finally {
      setDeleting(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return oferty.filter((o) => {
      if (katFilter !== "all" && o.typ_nieruchomosci !== katFilter) return false;
      if (q) {
        const hay = `${o.tytul} ${o.miasto ?? ""} ${o.dzielnica ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [oferty, katFilter, query]);

  const grouped = useMemo(() => {
    const map = new Map<OfertaTypNieruchomosci, OfertaZZdjeciami[]>();
    for (const o of filtered) {
      const arr = map.get(o.typ_nieruchomosci) ?? [];
      arr.push(o);
      map.set(o.typ_nieruchomosci, arr);
    }
    return map;
  }, [filtered]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div>
            <h1 className="text-lg font-bold text-slate-800">Panel ofert</h1>
            <p className="text-xs text-slate-400">PP Estate</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setForm("new")}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              + Dodaj ofertę
            </button>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Wyloguj
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Szukaj po tytule lub mieście…"
            className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <select
            value={katFilter}
            onChange={(e) => setKatFilter(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="all">Wszystkie kategorie</option>
            {TYP_NIERUCHOMOSCI_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <span className="ml-auto text-sm text-slate-400">
            {filtered.length}{" "}
            {filtered.length === 1 ? "oferta" : "ofert"}
          </span>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="py-16 text-center text-slate-400">Wczytywanie…</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-slate-400">
            Brak ofert. Kliknij „Dodaj ofertę”, aby utworzyć pierwszą.
          </div>
        ) : (
          <div className="space-y-8">
            {TYP_NIERUCHOMOSCI_OPTIONS.filter((kat) => grouped.has(kat.value)).map(
              (kat) => (
                <section key={kat.value}>
                  <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500">
                    {kat.label}
                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-600">
                      {grouped.get(kat.value)!.length}
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {grouped.get(kat.value)!.map((o) => (
                      <OfferCard
                        key={o.id}
                        offer={o}
                        onEdit={() => setForm(o)}
                        onDelete={() => openDeleteDialog(o)}
                      />
                    ))}
                  </div>
                </section>
              )
            )}
          </div>
        )}
      </main>

      {form && (
        <OfferForm
          offer={form === "new" ? null : form}
          onClose={() => setForm(null)}
          onSaved={() => {
            setForm(null);
            load();
          }}
        />
      )}

      {deleteTarget && (
        <DeleteOfferDialog
          title={deleteTarget.tytul}
          confirmText={deleteConfirmText}
          deleting={deleting}
          onConfirmTextChange={setDeleteConfirmText}
          onCancel={closeDeleteDialog}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

function DeleteOfferDialog({
  title,
  confirmText,
  deleting,
  onConfirmTextChange,
  onCancel,
  onConfirm,
}: {
  title: string;
  confirmText: string;
  deleting: boolean;
  onConfirmTextChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const canDelete = confirmText === title;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-800">Usuń ofertę</h2>
        </div>

        <div className="space-y-4 px-6 py-5">
          <p className="text-sm text-slate-600">
            Tej operacji nie można cofnąć. Aby potwierdzić, wpisz dokładnie nazwę
            oferty:
          </p>
          <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800">
            {title}
          </p>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              Nazwa oferty
            </label>
            <input
              autoFocus
              value={confirmText}
              onChange={(e) => onConfirmTextChange(e.target.value)}
              placeholder="Przepisz nazwę oferty"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
          >
            Anuluj
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!canDelete || deleting}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
          >
            {deleting ? "Usuwanie…" : "Usuń ofertę"}
          </button>
        </div>
      </div>
    </div>
  );
}

function OfferCard({
  offer,
  onEdit,
  onDelete,
}: {
  offer: OfertaZZdjeciami;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const main =
    offer.oferty_zdjecia.find((z) => z.czy_glowne) ?? offer.oferty_zdjecia[0];

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-40 bg-slate-100">
        {main ? (
          <img src={main.url} alt={offer.tytul} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <span
          className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_BADGE_CLASSES[offer.status]}`}
        >
          {STATUS_LABELS[offer.status]}
        </span>
        {offer.oferty_zdjecia.length > 0 && (
          <span className="absolute right-2 top-2 rounded-full bg-slate-900/70 px-2 py-0.5 text-[11px] font-medium text-white">
            {offer.oferty_zdjecia.length} zdj.
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="mb-1 flex items-center gap-2 text-xs text-slate-400">
          <span>{TYP_TRANSAKCJI_LABELS[offer.typ_transakcji]}</span>
          {offer.wyrozniona_na_stronie_glownej && (
            <span className="rounded bg-amber-100 px-1.5 py-0.5 font-semibold text-amber-700">
              ★ główna
            </span>
          )}
        </div>
        <h3 className="line-clamp-2 font-semibold text-slate-800">{offer.tytul}</h3>
        <p className="mt-1 text-sm text-slate-500">
          {[offer.miasto, offer.dzielnica].filter(Boolean).join(", ") || "—"}
        </p>
        <p className="mt-2 font-bold text-primary">
          {formatCena(offer.cena, offer.waluta)}
        </p>

        <div className="mt-4 flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Edytuj
          </button>
          <button
            onClick={onDelete}
            className="rounded-lg border border-rose-200 px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
          >
            Usuń
          </button>
        </div>
      </div>
    </article>
  );
}
