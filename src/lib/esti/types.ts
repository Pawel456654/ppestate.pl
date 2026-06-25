/**
 * Typy odpowiedzi EstiCRM.
 *
 * UWAGA: dokładna struktura odpowiedzi Esti zależy od konta i wersji API
 * (v1.5). Do czasu weryfikacji na żywych danych (Faza 0 — discovery)
 * traktujemy ofertę jako luźny rekord i odczytujemy pola defensywnie przez
 * helpery w `map-offer.ts`. Pozwala to syncowi działać niezależnie od drobnych
 * różnic w nazewnictwie pól między kontami.
 */

export type EstiRawOffer = Record<string, unknown>;

/** Pojedyncze zdjęcie z Esti — może przyjść jako string lub obiekt. */
export type EstiRawPhoto = string | Record<string, unknown>;

/**
 * Koperta odpowiedzi listy ofert. Esti potrafi zwracać dane pod różnymi
 * kluczami (`data`, `offers`, `items`) lub jako gołą tablicę — obsługujemy
 * wszystkie warianty w kliencie.
 */
export type EstiListEnvelope = {
  /** Esti zwraca tablicę lub pojedynczy obiekt, gdy count = 1. */
  data?: EstiRawOffer[] | EstiRawOffer;
  offers?: EstiRawOffer[] | EstiRawOffer;
  items?: EstiRawOffer[] | EstiRawOffer;
  count?: number;
  total?: number;
  totalCount?: number;
  success?: boolean;
};

/** Lekki wpis z `basic-list` używany do reconciliacji ID. */
export type EstiBasicEntry = {
  estiId: string;
  updateDate: string | null;
};

export type EstiDictionary = {
  /** Słowniki Esti w surowej formie (id → etykieta / definicja). */
  raw: Record<string, unknown>;
  /** Mapowanie nazw pól → słowniki (z `/offer/mapping`). */
  mapping: Record<string, unknown>;
};
