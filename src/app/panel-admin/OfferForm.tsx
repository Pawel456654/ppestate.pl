/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import type { OfertaZdjecie, OfertaZZdjeciami } from "@/types/database";
import {
  RYNEK_OPTIONS,
  STATUS_OPTIONS,
  TYP_NIERUCHOMOSCI_OPTIONS,
  TYP_TRANSAKCJI_OPTIONS,
  ZRODLO_OPTIONS,
} from "@/lib/offers";
import { parseGoogleMapsUrl } from "@/lib/google-maps";
import { generateOfferSeo } from "@/lib/offer-seo";
import { formatOfferDescription } from "@/lib/offer-text";
import { getYouTubeThumbnailFromUrl, isYouTubeUrl } from "@/lib/youtube";

type FieldsState = Record<string, string | boolean>;

type MediaItem =
  | { key: string; kind: "existing"; item: OfertaZdjecie }
  | { key: string; kind: "file"; file: File }
  | { key: string; kind: "url"; url: string }
  | { key: string; kind: "youtube"; url: string };

function numStr(n: number | null | undefined): string {
  return n == null ? "" : String(n);
}

function initForm(o?: OfertaZZdjeciami | null): FieldsState {
  return {
    tytul: o?.tytul ?? "",
    opis: o?.opis ? formatOfferDescription(o.opis) : "",
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
    status_reczny: o?.status_reczny ?? false,
  };
}

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";
const labelClass = "block text-xs font-semibold text-slate-600 mb-1.5";

function initMediaItems(offer?: OfertaZZdjeciami | null): MediaItem[] {
  return [...(offer?.oferty_zdjecia ?? [])]
    .sort((a, b) => a.kolejnosc - b.kolejnosc)
    .map((item) => ({ key: item.id, kind: "existing" as const, item }));
}

function isPhotoItem(item: MediaItem): boolean {
  if (item.kind === "existing") return (item.item.typ ?? "zdjecie") !== "film";
  return item.kind === "file" || item.kind === "url";
}

function mediaPreviewUrl(item: MediaItem): string {
  if (item.kind === "existing") {
    if ((item.item.typ ?? "zdjecie") === "film") {
      return getYouTubeThumbnailFromUrl(item.item.url) ?? item.item.url;
    }
    return item.item.url;
  }
  if (item.kind === "youtube") {
    return getYouTubeThumbnailFromUrl(item.url) ?? item.url;
  }
  if (item.kind === "file") {
    return URL.createObjectURL(item.file);
  }
  return item.url;
}

function mediaBadge(item: MediaItem): { label: string; className: string } {
  if (item.kind === "youtube") {
    return { label: "YouTube", className: "bg-rose-500" };
  }
  if (item.kind === "url") {
    return { label: "link", className: "bg-violet-500" };
  }
  if (item.kind === "file") {
    return { label: "nowe", className: "bg-amber-500" };
  }
  if ((item.item.typ ?? "zdjecie") === "film") {
    return { label: "YouTube", className: "bg-rose-500" };
  }
  if (item.item.zrodlo === "esti") {
    return { label: "Esti", className: "bg-sky-500" };
  }
  if (item.item.zrodlo === "url") {
    return { label: "link", className: "bg-violet-500" };
  }
  return { label: "plik", className: "bg-slate-500" };
}

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
  const isEsti = offer?.zrodlo === "esti";
  const [fields, setFields] = useState<FieldsState>(() => initForm(offer));
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => initMediaItems(offer));
  const [urlDraft, setUrlDraft] = useState("");
  const [youtubeDraft, setYoutubeDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaKeyRef = useRef(0);

  const mainImageKey = useMemo(() => {
    const firstPhoto = mediaItems.find((item) => isPhotoItem(item));
    return firstPhoto?.key ?? null;
  }, [mediaItems]);

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

  function nextMediaKey(prefix: string) {
    mediaKeyRef.current += 1;
    return `${prefix}-${mediaKeyRef.current}`;
  }

  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    setMediaItems((prev) => [
      ...prev,
      ...picked.map((file) => ({ key: nextMediaKey("file"), kind: "file" as const, file })),
    ]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function removeMediaItem(item: MediaItem) {
    if (item.kind === "existing") {
      const res = await fetch(`/api/admin/images/${item.item.id}`, { method: "DELETE" });
      if (!res.ok) {
        setError("Nie udało się usunąć medium.");
        return;
      }
    }
    setMediaItems((prev) => prev.filter((entry) => entry.key !== item.key));
    setError("");
  }

  function moveMedia(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= mediaItems.length) return;
    setMediaItems((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function saveMediaItems(offerId: string) {
    const finalIds: string[] = [];

    for (const item of mediaItems) {
      if (item.kind === "existing") {
        finalIds.push(item.item.id);
        continue;
      }

      if (item.kind === "file") {
        const form = new FormData();
        form.append("offerId", offerId);
        form.append("file", item.file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: form });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.message ?? "Błąd przesyłania zdjęcia.");
        }
        finalIds.push(data.zdjecie.id);
        continue;
      }

      const res = await fetch("/api/admin/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerId,
          url: item.url,
          typ: item.kind === "youtube" ? "film" : "zdjecie",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          data.message ??
            (item.kind === "youtube"
              ? "Błąd dodawania filmu YouTube."
              : "Błąd dodawania zdjęcia z linku.")
        );
      }
      finalIds.push(data.zdjecie.id);
    }

    if (finalIds.length > 0) {
      const res = await fetch("/api/admin/images/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerId, ids: finalIds }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message ?? "Błąd zmiany kolejności mediów.");
      }
    }
  }

  function addPendingUrl() {
    const url = urlDraft.trim();
    if (!url) return;
    if (!/^https:\/\//i.test(url)) {
      setError("Link do zdjęcia musi zaczynać się od https://");
      return;
    }
    if (isYouTubeUrl(url)) {
      setError("Link YouTube dodaj w polu filmu poniżej.");
      return;
    }
    setMediaItems((prev) => [...prev, { key: nextMediaKey("url"), kind: "url", url }]);
    setUrlDraft("");
    setError("");
  }

  function addPendingYoutube() {
    const url = youtubeDraft.trim();
    if (!url) return;
    if (!isYouTubeUrl(url)) {
      setError("Podaj prawidłowy link do filmu YouTube.");
      return;
    }
    setMediaItems((prev) => [...prev, { key: nextMediaKey("youtube"), kind: "youtube", url }]);
    setYoutubeDraft("");
    setError("");
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
      await saveMediaItems(offerId);
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
          {isEsti && (
            <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
              <p className="font-semibold">Oferta synchronizowana z EstiCRM</p>
              <p className="mt-1 text-sky-700">
                Pola opisowe (tytuł, cena, opis, lokalizacja, zdjęcia z Esti) są
                zarządzane w EstiCRM i zostaną nadpisane przy kolejnej
                synchronizacji. Bezpiecznie możesz tu zmieniać: <strong>status</strong>,
                wyróżnienie oraz dodawać własne zdjęcia (plik lub link), które sync zachowa.
              </p>
              {fields.status_reczny && (
                <div className="mt-2 flex items-center justify-between gap-3 rounded border border-amber-200 bg-amber-50 px-3 py-2">
                  <p className="text-amber-800 text-xs font-medium">
                    Status ustawiony ręcznie — sync Esti go nie nadpisze.
                  </p>
                  <button
                    type="button"
                    onClick={() => set("status_reczny", false)}
                    className="shrink-0 rounded bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-200"
                  >
                    Przywróć status z Esti
                  </button>
                </div>
              )}
            </div>
          )}

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
              Zdjęcia i filmy
            </h3>
            {mediaItems.length > 0 && (
              <p className="mb-3 text-xs text-slate-400">
                Użyj strzałek, aby zmienić kolejność. Pierwsze zdjęcie będzie
                zdjęciem głównym na listach ofert.
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              {mediaItems.map((item, index) => {
                const badge = mediaBadge(item);
                const isFilm =
                  item.kind === "youtube" ||
                  (item.kind === "existing" && (item.item.typ ?? "zdjecie") === "film");

                return (
                  <div
                    key={item.key}
                    className="relative h-28 w-36 overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
                  >
                    <img
                      src={mediaPreviewUrl(item)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute left-1 top-1 flex flex-col items-start gap-0.5">
                      {item.key === mainImageKey && (
                        <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-white">
                          główne
                        </span>
                      )}
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold text-white ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                    {isFilm && (
                      <span className="absolute inset-0 flex items-center justify-center bg-slate-900/30">
                        <svg
                          className="h-7 w-7 text-white drop-shadow"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    )}
                    <div className="absolute bottom-1 left-1 flex gap-0.5">
                      <button
                        type="button"
                        onClick={() => moveMedia(index, -1)}
                        disabled={index === 0}
                        className="rounded bg-white/90 p-1 text-slate-600 shadow hover:bg-white disabled:opacity-40"
                        aria-label="Przesuń w lewo"
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => moveMedia(index, 1)}
                        disabled={index === mediaItems.length - 1}
                        className="rounded bg-white/90 p-1 text-slate-600 shadow hover:bg-white disabled:opacity-40"
                        aria-label="Przesuń w prawo"
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMediaItem(item)}
                      className="absolute right-1 top-1 rounded-full bg-rose-600/90 p-1 text-white hover:bg-rose-700"
                      aria-label="Usuń"
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                );
              })}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-28 w-36 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-300 text-slate-400 hover:border-primary hover:text-primary"
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

            <div className="mt-4">
              <label className={labelClass}>Dodaj zdjęcie z linku (URL)</label>
              <div className="flex gap-2">
                <input
                  className={inputClass}
                  value={urlDraft}
                  placeholder="https://… (link do zdjęcia)"
                  onChange={(e) => setUrlDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addPendingUrl();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addPendingUrl}
                  className="shrink-0 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Dodaj link
                </button>
              </div>
            </div>

            <div className="mt-4">
              <label className={labelClass}>Dodaj film z YouTube</label>
              <div className="flex gap-2">
                <input
                  className={inputClass}
                  value={youtubeDraft}
                  placeholder="https://www.youtube.com/watch?v=…"
                  onChange={(e) => setYoutubeDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addPendingYoutube();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addPendingYoutube}
                  className="shrink-0 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Dodaj film
                </button>
              </div>
              <p className="mt-1.5 text-xs text-slate-400">
                Film pojawi się w galerii na stronie oferty. Kolejność możesz
                zmienić strzałkami — zostanie zapisana po kliknięciu „Zapisz
                zmiany”.
              </p>
            </div>
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
