import {
  RYNEK_LABELS,
  TYP_NIERUCHOMOSCI_LABELS,
  formatCena,
} from "@/lib/offers";
import type {
  OfertaRynek,
  OfertaTypNieruchomosci,
  OfertaTypTransakcji,
} from "@/types/database";

const BRAND = "PP Estate";
const TITLE_MAX = 60;
const DESC_MAX = 160;

export type OfferSeoInput = {
  tytul: string;
  opis?: string | null;
  typ_nieruchomosci: OfertaTypNieruchomosci | string;
  typ_transakcji?: OfertaTypTransakcji | string | null;
  rynek?: OfertaRynek | string | null;
  cena?: number | null;
  waluta?: string | null;
  powierzchnia?: number | null;
  liczba_pokoi?: number | null;
  miasto?: string | null;
  dzielnica?: string | null;
  rok_budowy?: number | null;
};

function transactionPhrase(
  typ: OfertaTypTransakcji | string | null | undefined
): string {
  return typ === "wynajem" ? "do wynajęcia" : "na sprzedaż";
}

function formatArea(area: number | null | undefined): string | null {
  if (area == null) return null;
  return `${new Intl.NumberFormat("pl-PL").format(area)} m²`;
}

function locationPhrase(
  miasto?: string | null,
  dzielnica?: string | null
): string | null {
  const parts = [miasto, dzielnica].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
}

function roomsPhrase(rooms: number | null | undefined): string | null {
  if (rooms == null) return null;
  return `${rooms}-pokojowe`;
}

function truncate(text: string, max: number): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  const cut = normalized.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const trimmed = lastSpace > max * 0.55 ? cut.slice(0, lastSpace) : cut;
  return `${trimmed.trimEnd()}…`;
}

function stripText(text: string): string {
  return text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function generateOfferSeo(input: OfferSeoInput): {
  seo_tytul: string;
  seo_opis: string;
} {
  const typeLabel =
    TYP_NIERUCHOMOSCI_LABELS[input.typ_nieruchomosci as OfertaTypNieruchomosci] ??
    "Nieruchomość";
  const trans = transactionPhrase(input.typ_transakcji);
  const area = formatArea(input.powierzchnia);
  const location = locationPhrase(input.miasto, input.dzielnica);

  const titleParts = [typeLabel, trans];
  if (area) titleParts.push(area);

  let titleCore = titleParts.join(" ");
  if (location) {
    titleCore = `${titleCore} — ${location}`;
  } else if (input.tytul.trim()) {
    titleCore = `${input.tytul.trim()} — ${typeLabel} ${trans}`;
  }

  const suffix = ` | ${BRAND}`;
  const seo_tytul = truncate(
    `${truncate(titleCore, TITLE_MAX - suffix.length)}${suffix}`,
    TITLE_MAX
  );

  const descParts: string[] = [];
  const rooms = roomsPhrase(input.liczba_pokoi);

  let opening = typeLabel;
  if (rooms) opening += ` ${rooms}`;
  if (area) opening += ` ${area}`;
  opening += ` ${trans}`;
  if (input.miasto) {
    opening += ` we ${input.miasto}${input.dzielnica ? ` (${input.dzielnica})` : ""}`;
  }
  descParts.push(`${opening}.`);

  if (input.cena != null) {
    const price = formatCena(input.cena, input.waluta ?? "PLN");
    const priceSuffix = input.typ_transakcji === "wynajem" ? " / mies." : "";
    descParts.push(`Cena: ${price}${priceSuffix}.`);
  }

  if (input.rynek) {
    const rynekLabel = RYNEK_LABELS[input.rynek as OfertaRynek];
    if (rynekLabel) descParts.push(`Rynek ${rynekLabel.toLowerCase()}.`);
  }

  if (input.rok_budowy) {
    descParts.push(`Rok budowy: ${input.rok_budowy}.`);
  }

  const opisClean = input.opis ? stripText(input.opis) : null;
  if (opisClean && opisClean.length > 20) {
    descParts.push(opisClean);
  }

  descParts.push(`Zobacz szczegóły oferty w ${BRAND}.`);

  const seo_opis = truncate(descParts.join(" "), DESC_MAX);

  return { seo_tytul, seo_opis };
}

export function seoInputFromRecord(
  record: Record<string, unknown>
): OfferSeoInput | null {
  const tytul = typeof record.tytul === "string" ? record.tytul.trim() : "";
  const typ = record.typ_nieruchomosci;
  if (!tytul || typeof typ !== "string" || !typ) return null;

  return {
    tytul,
    opis: typeof record.opis === "string" ? record.opis : null,
    typ_nieruchomosci: typ,
    typ_transakcji:
      record.typ_transakcji === "wynajem" || record.typ_transakcji === "sprzedaz"
        ? record.typ_transakcji
        : "sprzedaz",
    rynek:
      record.rynek === "pierwotny" || record.rynek === "wtorny"
        ? record.rynek
        : null,
    cena: typeof record.cena === "number" ? record.cena : null,
    waluta: typeof record.waluta === "string" ? record.waluta : "PLN",
    powierzchnia:
      typeof record.powierzchnia === "number" ? record.powierzchnia : null,
    liczba_pokoi:
      typeof record.liczba_pokoi === "number" ? record.liczba_pokoi : null,
    miasto: typeof record.miasto === "string" ? record.miasto : null,
    dzielnica: typeof record.dzielnica === "string" ? record.dzielnica : null,
    rok_budowy:
      typeof record.rok_budowy === "number" ? record.rok_budowy : null,
  };
}

export function applyGeneratedSeo<T extends Record<string, unknown>>(payload: T): T {
  const input = seoInputFromRecord(payload);
  if (!input) return payload;

  const seo = generateOfferSeo(input);
  return { ...payload, seo_tytul: seo.seo_tytul, seo_opis: seo.seo_opis };
}
