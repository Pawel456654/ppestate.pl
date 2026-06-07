/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import type { OfertaZZdjeciami } from "@/types/database";
import {
  RYNEK_OPTIONS,
  STATUS_OPTIONS,
  TYP_NIERUCHOMOSCI_OPTIONS,
  TYP_TRANSAKCJI_OPTIONS,
  ZRODLO_OPTIONS,
} from "@/lib/offers";
import { parseGoogleMapsUrl } from "@/lib/google-maps";
import { generateOfferSeo } from "@/lib/offer-seo";

type FieldsState = Record<string, string | boolean>;

function numStr(n: number | null | undefined): string {
  return n == null ? "" : String(n);
}

function initForm(o?: OfertaZZdjeciami | null): FieldsState {
  return {
    tytul: o?.tytul ?? "",
    opis: o?.opis ?? "",
    status: o?.status ?? "aktywna",
    typ_nieruchomosci: o?.typ_nieruchomosci ?? "",
    typ_transakcji: o?.typ_transakcji ?? "sprzedaz",
    rynek: o?.rynek ?? "",
    zrodlo: o?.zrodlo ?? "strona",
    cena: numStr(o?.cena),
    waluta: o?.waluta ?? "PLN",
    cena_za_m2: numStr(o?.cena_za_m2),
    powierzchnia: numStr(o?.powierzchnia),
    powierzchnia_uzytkowa: numStr(o?.powierzchnia_uzytkowa),
    powierzchnia_dzialki: numStr(o?.powierzchnia_dzialki),
    liczba_pokoi: numStr(o?.liczba_pokoi),
    pietro: numStr(o?.pietro),
    liczba_pieter_w_budynku: numStr(o?.liczba_pieter_w_budynku),
    rok_budowy: numStr(o?.rok_budowy),
    miasto: o?.miasto ?? "",
    dzielnica: o?.dzielnica ?? "",
    ulica: o?.ulica ?? "",
    kod_pocztowy: o?.kod_pocztowy ?? "",
    szerokosc_geo: numStr(o?.szerokosc_geo),
    dlugosc_geo: numStr(o?.dlugosc_geo),
    link_google_maps: o?.link_google_maps ?? "",
    esti_id: o?.esti_id ?? "",
    slug: o?.slug ?? "",
    agent_id: o?.agent_id ?? "",
    ostatnio_widziana_w_esti: o?.ostatnio_widziana_w_esti
      ? o.ostatnio_widziana_w_esti.slice(0, 16)
      : "",
    wyrozniona: o?.wyrozniona ?? false,
    wyrozniona_na_stronie_glownej: o?.wyrozniona_na_stronie_glownej ?? false,
  };
}

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";
const labelClass = "block text-xs font-semibold text-slate-600 mb-1.5";

export default function OfferForm({
  offer,
  onClose,
  onSaved,
}: {
  offer: OfertaZZdjeciami | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const editing = Boolean(offer);
  const [fields, setFields] = useState<FieldsState>(() => initForm(offer));
  const [existingImages, setExistingImages] = useState(offer?.oferty_zdjecia ?? []);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mapsPreview = useMemo(() => {
    const link = String(fields.link_google_maps ?? "").trim();
    if (!link) return null;
    return parseGoogleMapsUrl(link);
  }, [fields.link_google_maps]);

  const seoPreview = useMemo(() => {
    const tytul = String(fields.tytul ?? "").trim();
    const typ = String(fields.typ_nieruchomosci ?? "");
    if (!tytul || !typ) return null;

    return generateOfferSeo({
      tytul,
      opis: String(fields.opis ?? ""),
      typ_nieruchomosci: typ,
      typ_transakcji: String(fields.typ_transakcji ?? "sprzedaz"),
      rynek: String(fields.rynek ?? "") || null,
      cena: fields.cena ? Number(fields.cena) : null,
      waluta: String(fields.waluta ?? "PLN"),
      powierzchnia: fields.powierzchnia ? Number(fields.powierzchnia) : null,
      liczba_pokoi: fields.liczba_pokoi ? Number(fields.liczba_pokoi) : null,
      miasto: String(fields.miasto ?? "") || null,
      dzielnica: String(fields.dzielnica ?? "") || null,
      rok_budowy: fields.rok_budowy ? Number(fields.rok_budowy) : null,
    });
  }, [fields]);

  function set(name: string, value: string | boolean) {
    setFields((prev) => ({ ...prev, [name]: value }));
  }

  function text(name: string, label: string, opts?: { full?: boolean; placeholder?: string }) {
    return (
      <div className={opts?.full ? "sm:col-span-2 lg:col-span-3" : ""}>
        <label className={labelClass}>{label}</label>
        <input
          className={inputClass}
          value={String(fields[name] ?? "")}
          placeholder={opts?.placeholder}
          onChange={(e) => set(name, e.target.value)}
        />
      </div>
    );
  }

  function number(name: string, label: string, step = "any") {
    return (
      <div>
        <label className={labelClass}>{label}</label>
        <input
          type="number"
          step={step}
          className={inputClass}
          value={String(fields[name] ?? "")}
          onChange={(e) => set(name, e.target.value)}
        />
      </div>
    );
  }

  function select(
    name: string,
    label: string,
    options: { value: string; label: string }[],
    opts?: { placeholder?: string }
  ) {
    return (
      <div>
        <label className={labelClass}>{label}</label>
        <select
          className={inputClass}
          value={String(fields[name] ?? "")}
          onChange={(e) => set(name, e.target.value)}
        >
          {opts?.placeholder !== undefined && <option value="">{opts.placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  function checkbox(name: string, label: string) {
    return (
      <label className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={Boolean(fields[name])}
          onChange={(e) => set(name, e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/40"
        />
        <span className="text-sm text-slate-700">{label}</span>
      </label>
    );
  }

  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    setNewFiles((prev) => [...prev, ...picked]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function deleteExistingImage(id: string) {
    const res = await fetch(`/api/admin/images/${id}`, { method: "DELETE" });
    if (res.ok) {
      setExistingImages((prev) => prev.filter((img) => img.id !== id));
    }
  }

  async function uploadFiles(offerId: string) {
    for (const file of newFiles) {
      const form = new FormData();
      form.append("offerId", offerId);
      form.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? "Błąd przesyłania zdjęcia.");
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!fields.tytul) {
      setError("Tytuł jest wymagany.");
      return;
    }
    if (!fields.typ_nieruchomosci) {
      setError("Wybierz typ nieruchomości.");
      return;
    }
    setSaving(true);
    try {
      const url = editing ? `/api/admin/offers/${offer!.id}` : "/api/admin/offers";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message ?? "Nie udało się zapisać oferty.");
      }
      const offerId: string = editing ? offer!.id : data.oferta.id;
      if (newFiles.length > 0) {
        await uploadFiles(offerId);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił błąd.");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 p-4 sm:p-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-800">
            {editing ? "Edytuj ofertę" : "Nowa oferta"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Zamknij"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="max-h-[70vh] space-y-7 overflow-y-auto px-6 py-5">
          <Section title="Podstawowe">
            {text("tytul", "Tytuł *", { full: true })}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className={labelClass}>Opis</label>
              <textarea
                className={`${inputClass} min-h-[100px] resize-y`}
                value={String(fields.opis ?? "")}
                onChange={(e) => set("opis", e.target.value)}
              />
            </div>
          </Section>

          <Section title="Klasyfikacja">
            {select("typ_nieruchomosci", "Typ nieruchomości *", TYP_NIERUCHOMOSCI_OPTIONS, {
              placeholder: "— wybierz —",
            })}
            {select("typ_transakcji", "Typ transakcji", TYP_TRANSAKCJI_OPTIONS)}
            {select("status", "Status", STATUS_OPTIONS)}
            {select("rynek", "Rynek", RYNEK_OPTIONS, { placeholder: "— brak —" })}
            {select("zrodlo", "Źródło", ZRODLO_OPTIONS)}
          </Section>

          <Section title="Cena">
            {number("cena", "Cena")}
            {text("waluta", "Waluta")}
            {number("cena_za_m2", "Cena za m²")}
          </Section>

          <Section title="Powierzchnia">
            {number("powierzchnia", "Powierzchnia (m²)")}
            {number("powierzchnia_uzytkowa", "Powierzchnia użytkowa (m²)")}
            {number("powierzchnia_dzialki", "Powierzchnia działki (m²)")}
          </Section>

          <Section title="Pomieszczenia / budynek">
            {number("liczba_pokoi", "Liczba pokoi", "1")}
            {number("pietro", "Piętro", "1")}
            {number("liczba_pieter_w_budynku", "Liczba pięter w budynku", "1")}
            {number("rok_budowy", "Rok budowy", "1")}
          </Section>

          <Section title="Lokalizacja">
            {text("miasto", "Miasto")}
            {text("dzielnica", "Dzielnica")}
            {text("ulica", "Ulica")}
            {text("kod_pocztowy", "Kod pocztowy")}
            {number("szerokosc_geo", "Szerokość geograficzna (lat)")}
            {number("dlugosc_geo", "Długość geograficzna (lng)")}
            <div className="sm:col-span-2 lg:col-span-3">
              <p className="mb-3 text-xs text-slate-400">
                Mapa na stronie oferty korzysta w kolejności z: linku Google Maps,
                współrzędnych, a na końcu z adresu.
              </p>
              <label className={labelClass}>Link Google Maps</label>
              <input
                className={inputClass}
                value={String(fields.link_google_maps ?? "")}
                placeholder="https://www.google.com/maps/place/..."
                onChange={(e) => set("link_google_maps", e.target.value)}
              />
              <p className="mt-1.5 text-xs text-slate-400">
                Wklej link z Google Maps (Udostępnij → Kopiuj link), aby na stronie
                oferty wyświetlić pinezkę w dokładnym miejscu.
              </p>
              {mapsPreview ? (
                <p className="mt-1 text-xs font-medium text-emerald-600">
                  {mapsPreview.kind === "coords"
                    ? `Wykryto współrzędne: ${mapsPreview.lat}, ${mapsPreview.lng}`
                    : mapsPreview.kind === "embed"
                      ? "Wykryto link do osadzenia mapy."
                      : `Wykryto lokalizację: ${mapsPreview.query}`}
                </p>
              ) : fields.link_google_maps ? (
                <p className="mt-1 text-xs font-medium text-amber-600">
                  Nie udało się odczytać lokalizacji z linku — sprawdź adres URL.
                </p>
              ) : null}
            </div>
          </Section>

          <Section title="Źródło / Esti">
            {text("esti_id", "Esti ID")}
            {text("slug", "Slug (auto, jeśli puste)")}
            {text("agent_id", "Agent ID")}
            <div>
              <label className={labelClass}>Ostatnio widziana w Esti</label>
              <input
                type="datetime-local"
                className={inputClass}
                value={String(fields.ostatnio_widziana_w_esti ?? "")}
                onChange={(e) => set("ostatnio_widziana_w_esti", e.target.value)}
              />
            </div>
          </Section>

          <Section title="Wyróżnienie">
            {checkbox("wyrozniona", "Wyróżniona")}
            {checkbox("wyrozniona_na_stronie_glownej", "Wyróżniona na stronie głównej")}
          </Section>

          <Section title="SEO (generowane automatycznie)">
            <div className="sm:col-span-2 lg:col-span-3 space-y-4">
              <p className="text-xs text-slate-500">
                Tytuł i opis SEO są tworzone automatycznie na podstawie danych oferty
                i nie mogą być edytowane ręcznie.
              </p>
              {seoPreview ? (
                <>
                  <div>
                    <label className={labelClass}>Tytuł SEO</label>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
                      {seoPreview.seo_tytul}
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      {seoPreview.seo_tytul.length} znaków (zalecane do 60)
                    </p>
                  </div>
                  <div>
                    <label className={labelClass}>Opis SEO</label>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
                      {seoPreview.seo_opis}
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      {seoPreview.seo_opis.length} znaków (zalecane do 160)
                    </p>
                  </div>
                </>
              ) : (
                <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-500">
                  Uzupełnij tytuł i typ nieruchomości, aby zobaczyć podgląd SEO.
                </p>
              )}
            </div>
          </Section>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-400">
              Zdjęcia
            </h3>
            <div className="flex flex-wrap gap-3">
              {existingImages.map((img) => (
                <div key={img.id} className="relative h-24 w-32 overflow-hidden rounded-lg border border-slate-200">
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                  {img.czy_glowne && (
                    <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      główne
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteExistingImage(img.id)}
                    className="absolute right-1 top-1 rounded-full bg-rose-600/90 p-1 text-white hover:bg-rose-700"
                    aria-label="Usuń zdjęcie"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              {newFiles.map((file, i) => (
                <div key={i} className="relative h-24 w-32 overflow-hidden rounded-lg border border-dashed border-primary/50">
                  <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
                  <span className="absolute left-1 top-1 rounded bg-amber-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    nowe
                  </span>
                  <button
                    type="button"
                    onClick={() => setNewFiles((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute right-1 top-1 rounded-full bg-slate-700/90 p-1 text-white hover:bg-slate-900"
                    aria-label="Usuń"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-24 w-32 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-300 text-slate-400 hover:border-primary hover:text-primary"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs font-medium">Dodaj zdjęcia</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={onPickFiles}
              />
            </div>
            {editing ? (
              <p className="mt-2 text-xs text-slate-400">
                Nowe zdjęcia zostaną przesłane po zapisaniu.
              </p>
            ) : (
              <p className="mt-2 text-xs text-slate-400">
                Zdjęcia zostaną przesłane po utworzeniu oferty.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-6 py-4">
          {error ? (
            <p className="text-sm font-medium text-rose-600">{error}</p>
          ) : (
            <span />
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
            >
              {saving ? "Zapisywanie…" : editing ? "Zapisz zmiany" : "Utwórz ofertę"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-400">
        {title}
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  );
}
