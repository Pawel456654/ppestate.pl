export type OfertaZrodlo = "esti" | "strona";

export type OfertaStatus =
  | "aktywna"
  | "rezerwacja"
  | "sprzedana"
  | "wynajeta"
  | "ukryta";

export type OfertaTypNieruchomosci =
  | "mieszkanie"
  | "dom"
  | "dzialka"
  | "lokal_komercyjny"
  | "biuro"
  | "hala";

export type OfertaTypTransakcji = "sprzedaz" | "wynajem";

export type OfertaRynek = "pierwotny" | "wtorny";

export type Oferta = {
  id: string;
  data_utworzenia: string;
  data_aktualizacji: string;

  zrodlo: OfertaZrodlo;
  esti_id: string | null;
  slug: string | null;

  tytul: string;
  opis: string | null;

  status: OfertaStatus;
  typ_nieruchomosci: OfertaTypNieruchomosci;
  typ_transakcji: OfertaTypTransakcji;
  rynek: OfertaRynek | null;

  cena: number | null;
  waluta: string;
  cena_za_m2: number | null;

  powierzchnia: number | null;
  powierzchnia_uzytkowa: number | null;
  powierzchnia_dzialki: number | null;

  liczba_pokoi: number | null;
  pietro: number | null;
  liczba_pieter_w_budynku: number | null;

  rok_budowy: number | null;

  miasto: string | null;
  dzielnica: string | null;
  ulica: string | null;
  kod_pocztowy: string | null;

  szerokosc_geo: number | null;
  dlugosc_geo: number | null;
  link_google_maps: string | null;

  agent_id: string | null;

  wyrozniona: boolean;
  wyrozniona_na_stronie_glownej: boolean;

  seo_tytul: string | null;
  seo_opis: string | null;

  ostatnio_widziana_w_esti: string | null;
};

export type OfertaZdjecie = {
  id: string;
  oferta_id: string;
  url: string;
  sciezka: string;
  kolejnosc: number;
  czy_glowne: boolean;
  data_utworzenia: string;
};

export type OfertaZZdjeciami = Oferta & {
  oferty_zdjecia: OfertaZdjecie[];
};

export type ContactInquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  privacy_accepted: boolean;
  created_at: string;
};

type OfertaInsert = {
  id?: string;
  data_utworzenia?: string;
  data_aktualizacji?: string;
  zrodlo?: OfertaZrodlo;
  esti_id?: string | null;
  slug?: string | null;
  tytul: string;
  opis?: string | null;
  status?: OfertaStatus;
  typ_nieruchomosci: OfertaTypNieruchomosci;
  typ_transakcji?: OfertaTypTransakcji;
  rynek?: OfertaRynek | null;
  cena?: number | null;
  waluta?: string;
  cena_za_m2?: number | null;
  powierzchnia?: number | null;
  powierzchnia_uzytkowa?: number | null;
  powierzchnia_dzialki?: number | null;
  liczba_pokoi?: number | null;
  pietro?: number | null;
  liczba_pieter_w_budynku?: number | null;
  rok_budowy?: number | null;
  miasto?: string | null;
  dzielnica?: string | null;
  ulica?: string | null;
  kod_pocztowy?: string | null;
  szerokosc_geo?: number | null;
  dlugosc_geo?: number | null;
  link_google_maps?: string | null;
  agent_id?: string | null;
  wyrozniona?: boolean;
  wyrozniona_na_stronie_glownej?: boolean;
  seo_tytul?: string | null;
  seo_opis?: string | null;
  ostatnio_widziana_w_esti?: string | null;
};

type OfertaZdjecieInsert = {
  id?: string;
  oferta_id: string;
  url: string;
  sciezka: string;
  kolejnosc?: number;
  czy_glowne?: boolean;
  data_utworzenia?: string;
};

type OfertaZdjecieUpdate = {
  id?: string;
  oferta_id?: string;
  url?: string;
  sciezka?: string;
  kolejnosc?: number;
  czy_glowne?: boolean;
  data_utworzenia?: string;
};

export type Database = {
  public: {
    Tables: {
      oferty: {
        Row: Oferta;
        Insert: OfertaInsert;
        Update: Partial<Oferta>;
        Relationships: [];
      };
      oferty_zdjecia: {
        Row: OfertaZdjecie;
        Insert: OfertaZdjecieInsert;
        Update: OfertaZdjecieUpdate;
        Relationships: [
          {
            foreignKeyName: "oferty_zdjecia_oferta_id_fkey";
            columns: ["oferta_id"];
            isOneToOne: false;
            referencedRelation: "oferty";
            referencedColumns: ["id"];
          },
        ];
      };
      contact_inquiries: {
        Row: ContactInquiry;
        Insert: Omit<ContactInquiry, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<ContactInquiry>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
