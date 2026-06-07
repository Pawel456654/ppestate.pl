import type {
  OfertaRynek,
  OfertaStatus,
  OfertaTypNieruchomosci,
  OfertaTypTransakcji,
  OfertaZrodlo,
} from "@/types/database";

export type Option<T extends string> = { value: T; label: string };

export const CATEGORY_QUERY_TYPES = [
  "domy",
  "mieszkania",
  "dzialki",
  "przemyslowe",
] as const;

export type CategoryQueryType = (typeof CATEGORY_QUERY_TYPES)[number];

export const CATEGORY_TYPE_MAP: Record<
  CategoryQueryType,
  OfertaTypNieruchomosci[]
> = {
  domy: ["dom"],
  mieszkania: ["mieszkanie"],
  dzialki: ["dzialka"],
  przemyslowe: ["lokal_komercyjny", "biuro", "hala"],
};

export const ZRODLO_OPTIONS: Option<OfertaZrodlo>[] = [
  { value: "strona", label: "Strona" },
  { value: "esti", label: "Esti" },
];

export const STATUS_OPTIONS: Option<OfertaStatus>[] = [
  { value: "aktywna", label: "Aktywna" },
  { value: "rezerwacja", label: "Rezerwacja" },
  { value: "sprzedana", label: "Sprzedana" },
  { value: "wynajeta", label: "Wynajęta" },
  { value: "ukryta", label: "Ukryta" },
];

export const TYP_NIERUCHOMOSCI_OPTIONS: Option<OfertaTypNieruchomosci>[] = [
  { value: "mieszkanie", label: "Mieszkanie" },
  { value: "dom", label: "Dom" },
  { value: "dzialka", label: "Działka" },
  { value: "lokal_komercyjny", label: "Lokal komercyjny" },
  { value: "biuro", label: "Biuro" },
  { value: "hala", label: "Hala" },
];

export const TYP_TRANSAKCJI_OPTIONS: Option<OfertaTypTransakcji>[] = [
  { value: "sprzedaz", label: "Sprzedaż" },
  { value: "wynajem", label: "Wynajem" },
];

export const RYNEK_OPTIONS: Option<OfertaRynek>[] = [
  { value: "pierwotny", label: "Pierwotny" },
  { value: "wtorny", label: "Wtórny" },
];

function toLabelMap<T extends string>(options: Option<T>[]): Record<T, string> {
  return options.reduce(
    (acc, o) => {
      acc[o.value] = o.label;
      return acc;
    },
    {} as Record<T, string>
  );
}

export const STATUS_LABELS = toLabelMap(STATUS_OPTIONS);
export const TYP_NIERUCHOMOSCI_LABELS = toLabelMap(TYP_NIERUCHOMOSCI_OPTIONS);
export const TYP_TRANSAKCJI_LABELS = toLabelMap(TYP_TRANSAKCJI_OPTIONS);
export const RYNEK_LABELS = toLabelMap(RYNEK_OPTIONS);
export const ZRODLO_LABELS = toLabelMap(ZRODLO_OPTIONS);

export const STATUS_BADGE_CLASSES: Record<OfertaStatus, string> = {
  aktywna: "bg-emerald-100 text-emerald-700",
  rezerwacja: "bg-amber-100 text-amber-700",
  sprzedana: "bg-slate-200 text-slate-600",
  wynajeta: "bg-slate-200 text-slate-600",
  ukryta: "bg-rose-100 text-rose-700",
};

const POLISH_MAP: Record<string, string> = {
  ą: "a", ć: "c", ę: "e", ł: "l", ń: "n", ó: "o", ś: "s", ż: "z", ź: "z",
};

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[ąćęłńóśżź]/g, (c) => POLISH_MAP[c] ?? c)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function formatCena(cena: number | null, waluta: string): string {
  if (cena == null) return "—";
  return `${new Intl.NumberFormat("pl-PL").format(cena)} ${waluta}`;
}

export function buildOfferSlug(input: {
  tytul: string;
  typ_nieruchomosci: string;
  powierzchnia?: number | null;
  miasto?: string | null;
  ulica?: string | null;
  esti_id?: string | null;
  id?: string;
}): string {
  const typePart = input.typ_nieruchomosci.replace(/_/g, "-");
  const areaPart =
    input.powierzchnia != null
      ? `${String(input.powierzchnia).replace(/\.0+$/, "").replace(".", "-")}m2`
      : null;
  const locationPart = [input.miasto, input.ulica].filter(Boolean).join(" ");

  const base = slugify(
    [typePart, areaPart, locationPart].filter(Boolean).join(" ") || input.tytul
  );

  const suffix =
    input.esti_id?.trim() ||
    input.id?.slice(0, 8) ||
    Math.random().toString(36).slice(2, 7);

  return `${base || "oferta"}-${slugify(suffix)}`.slice(0, 120);
}
