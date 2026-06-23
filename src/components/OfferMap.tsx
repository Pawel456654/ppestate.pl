"use client";

import type { Oferta } from "@/types/database";
import { getOfferMapData } from "@/lib/offer-display";
import { useCookieConsent } from "@/components/CookieConsentProvider";

export default function OfferMap({
  offer,
}: {
  offer: Pick<
    Oferta,
    | "ulica"
    | "dzielnica"
    | "miasto"
    | "kod_pocztowy"
    | "szerokosc_geo"
    | "dlugosc_geo"
    | "link_google_maps"
  >;
}) {
  const { hasConsent } = useCookieConsent();
  const map = getOfferMapData(offer);

  if (!map) return null;

  return (
    <section className="w-full border-t border-slate-200">
      <div className="px-6 py-8 sm:py-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">Lokalizacja</h2>
          <p className="text-slate-500 text-sm sm:text-base">{map.label}</p>
        </div>
      </div>

      <div className="relative w-full h-[360px] sm:h-[420px] md:h-[480px] bg-slate-50 overflow-hidden">
        {hasConsent === null ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50 animate-pulse" />
        ) : hasConsent ? (
          <iframe
            title={`Mapa — ${map.label}`}
            src={map.embedUrl}
            className="block w-full h-full border-0 animate-fade-in"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-6 bg-slate-100">
            <p className="max-w-md text-center text-sm text-slate-600 sm:text-base">
              Mapa wymaga plików cookies. Zaakceptuj je na pasku u dołu strony.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
