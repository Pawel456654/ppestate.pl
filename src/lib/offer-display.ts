import {
  buildGoogleMapsEmbedUrl,
  getMapLabel,
  parseGoogleMapsUrl,
} from "@/lib/google-maps";
import {
  formatCena,
  STATUS_BADGE_CLASSES,
  STATUS_LABELS,
  TYP_NIERUCHOMOSCI_LABELS,
  TYP_TRANSAKCJI_LABELS,
} from "@/lib/offers";
import type { Oferta, OfertaStatus, OfertaZZdjeciami, OfertaZdjecie } from "@/types/database";

const DEFAULT_IMAGES: Record<string, string> = {
  mieszkanie: "/hero/mieszkania.png",
  dom: "/hero/domy.png",
  dzialka: "/hero/biura.jpg",
  lokal_komercyjny: "/hero/biura.jpg",
  biuro: "/hero/biura.jpg",
  hala: "/hero/domy.png",
};

export type OfferCardData = {
  slug: string;
  title: string;
  location: string;
  price: string;
  area: string | null;
  rooms: number | null;
  typeLabel: string;
  transactionLabel: string;
  imageUrl: string;
  badge: string | null;
  status: OfertaStatus;
  statusLabel: string;
  statusBadgeClass: string;
};

const DEFAULT_SITE_URL = "https://ppestate.pl";

function extractSiteOrigin(value: string): string | null {
  const match = value.match(/https?:\/\/[^/\s]+/i);
  if (!match) return null;

  try {
    const parsed = new URL(match[0]);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return null;
  }
}

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    const origin = extractSiteOrigin(fromEnv);
    if (origin && !origin.includes(".supabase.co")) {
      return origin;
    }
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  return DEFAULT_SITE_URL;
}

export function getOfferPath(slug: string): string {
  return `/oferty/${slug}`;
}

export function getOfferUrl(slug: string): string {
  return `${getSiteUrl()}${getOfferPath(slug)}`;
}

export function getMainImage(
  images: OfertaZdjecie[],
  typNieruchomosci: Oferta["typ_nieruchomosci"]
): string {
  const main = images.find((z) => z.czy_glowne) ?? images[0];
  return main?.url ?? DEFAULT_IMAGES[typNieruchomosci] ?? "/hero/mieszkania.png";
}

export function formatLocation(offer: Pick<Oferta, "miasto" | "dzielnica" | "ulica">): string {
  const parts = [offer.miasto, offer.dzielnica].filter(Boolean);
  if (parts.length === 0 && offer.ulica) return offer.ulica;
  return parts.join(", ") || "Lokalizacja do ustalenia";
}

export function formatFullAddress(
  offer: Pick<Oferta, "ulica" | "dzielnica" | "miasto" | "kod_pocztowy">
): string | null {
  if (!offer.ulica && !offer.miasto && !offer.dzielnica) return null;

  const cityLine = [offer.kod_pocztowy, offer.miasto].filter(Boolean).join(" ");
  const parts = [offer.ulica, cityLine, offer.dzielnica, "Polska"].filter(Boolean);

  return parts.join(", ");
}

export function getOfferMapData(
  offer: Pick<
    Oferta,
    | "ulica"
    | "dzielnica"
    | "miasto"
    | "kod_pocztowy"
    | "szerokosc_geo"
    | "dlugosc_geo"
    | "link_google_maps"
  >
): { embedUrl: string; label: string } | null {
  const address = formatFullAddress(offer);

  if (offer.link_google_maps) {
    const parsed = parseGoogleMapsUrl(offer.link_google_maps);
    if (parsed) {
      return {
        embedUrl: buildGoogleMapsEmbedUrl(parsed),
        label: getMapLabel(parsed, address),
      };
    }
  }

  if (offer.szerokosc_geo != null && offer.dlugosc_geo != null) {
    const coords = `${offer.szerokosc_geo},${offer.dlugosc_geo}`;
    return {
      embedUrl: `https://maps.google.com/maps?q=${coords}&z=17&output=embed`,
      label: address ?? coords,
    };
  }

  if (address) {
    return {
      embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=15&output=embed`,
      label: address,
    };
  }

  return null;
}

export function formatPowierzchnia(offer: Pick<Oferta, "powierzchnia">): string | null {
  if (offer.powierzchnia == null) return null;
  return `${new Intl.NumberFormat("pl-PL").format(offer.powierzchnia)} m²`;
}

export function formatOfferPrice(offer: Pick<Oferta, "cena" | "waluta" | "typ_transakcji">): string {
  const base = formatCena(offer.cena, offer.waluta);
  if (offer.cena == null) return base;
  return offer.typ_transakcji === "wynajem" ? `${base} / mies.` : base;
}

export function toOfferCardData(offer: OfertaZZdjeciami): OfferCardData | null {
  if (!offer.slug) return null;

  return {
    slug: offer.slug,
    title: offer.tytul,
    location: formatLocation(offer),
    price: formatOfferPrice(offer),
    area: formatPowierzchnia(offer),
    rooms: offer.liczba_pokoi,
    typeLabel: TYP_NIERUCHOMOSCI_LABELS[offer.typ_nieruchomosci],
    transactionLabel: TYP_TRANSAKCJI_LABELS[offer.typ_transakcji],
    imageUrl: getMainImage(offer.oferty_zdjecia, offer.typ_nieruchomosci),
    badge: offer.wyrozniona ? "Wyróżniona" : null,
    status: offer.status,
    statusLabel: STATUS_LABELS[offer.status],
    statusBadgeClass: STATUS_BADGE_CLASSES[offer.status],
  };
}

export function buildRealEstateSchema(offer: OfertaZZdjeciami, url: string) {
  const images = offer.oferty_zdjecia.map((z) => z.url);
  const addressParts = [offer.ulica, offer.dzielnica, offer.miasto].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: offer.tytul,
    description: offer.opis ?? offer.seo_opis ?? undefined,
    url,
    datePosted: offer.data_utworzenia,
    image: images.length > 0 ? images : undefined,
    address: addressParts.length
      ? {
          "@type": "PostalAddress",
          streetAddress: offer.ulica ?? undefined,
          addressLocality: offer.miasto ?? undefined,
          addressRegion: offer.dzielnica ?? undefined,
          postalCode: offer.kod_pocztowy ?? undefined,
          addressCountry: "PL",
        }
      : undefined,
    geo:
      offer.szerokosc_geo != null && offer.dlugosc_geo != null
        ? {
            "@type": "GeoCoordinates",
            latitude: offer.szerokosc_geo,
            longitude: offer.dlugosc_geo,
          }
        : undefined,
    offers: offer.cena != null
      ? {
          "@type": "Offer",
          price: offer.cena,
          priceCurrency: offer.waluta,
          availability:
            offer.status === "aktywna" || offer.status === "rezerwacja"
              ? "https://schema.org/InStock"
              : "https://schema.org/SoldOut",
        }
      : undefined,
    floorSize: offer.powierzchnia
      ? {
          "@type": "QuantitativeValue",
          value: offer.powierzchnia,
          unitCode: "MTK",
        }
      : undefined,
    numberOfRooms: offer.liczba_pokoi ?? undefined,
  };
}
