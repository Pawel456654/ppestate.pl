"use client";

import { useState, useEffect } from "react";
import type { Oferta } from "@/types/database";
import { getOfferMapData } from "@/lib/offer-display";
import Link from "next/link";

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
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);
  const map = getOfferMapData(offer);

  useEffect(() => {
    const consent = localStorage.getItem("google-maps-consent") === "true";
    setHasConsent(consent);
  }, []);

  if (!map) return null;

  const handleAccept = () => {
    localStorage.setItem("google-maps-consent", "true");
    setHasConsent(true);
  };

  const showMap = hasConsent === true;

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
          // Skeleton/Loading container during hydration
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50 animate-pulse" />
        ) : showMap ? (
          <iframe
            title={`Mapa — ${map.label}`}
            src={map.embedUrl}
            className="block w-full h-full border-0 animate-fade-in"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          // Premium Consent Overlay
          <div className="absolute inset-0 flex items-center justify-center p-4 bg-slate-100/50 backdrop-blur-[2px]">
            {/* Visual background simulation of a map to look premium */}
            <div className="absolute inset-0 opacity-[0.08] pointer-events-none select-none bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none select-none flex items-center justify-center">
              <svg className="w-[500px] h-[500px] text-primary" fill="currentColor" viewBox="0 0 100 100">
                <path d="M50 0C25 0 5 20 5 45c0 28 36 51 40 54.2.8.6 1.8.8 2.7.4.9-.4 4.8-3.1 9.8-7.2l-3.3-3.3C49 83 45 86 45 86c-17.6-13.4-35-31.5-35-41 0-22.1 18-40 40-40s40 17.9 40 40c0 4.1-.3 8.3-1 12.4l5.1 2.5C99.2 56 100 50.5 100 45 100 20 80 0 50 0z" />
                <path d="M50 25c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20zm0 35c-8.3 0-15-6.7-15-15s6.7-15 15-15 15 6.7 15 15-6.7 15-15 15z" />
              </svg>
            </div>

            <div className="relative max-w-lg w-full bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200/80 text-center animate-fade-in-up">
              {/* Map pin icon */}
              <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary mb-5 shadow-inner">
                <svg className="w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>

              <p className="text-slate-700 text-sm sm:text-base mb-4 leading-relaxed font-medium">
                Ta mapa jest dostarczana przez Google Maps. Po jej załadowaniu Google może przetwarzać dane techniczne użytkownika, w tym adres IP, informacje o urządzeniu oraz pliki cookies.
              </p>
              
              <p className="text-slate-500 text-xs sm:text-sm mb-6 leading-relaxed">
                Klikając „Załaduj mapę”, wyrażasz zgodę na połączenie z usługami Google i wyświetlenie treści zewnętrznych zgodnie z{" "}
                <Link
                  href="/polityka-prywatnosci"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-primary hover:text-primary-dark transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 rounded"
                >
                  Polityką Prywatności
                </Link>
                .
              </p>

              <button
                onClick={handleAccept}
                className="w-full sm:w-auto px-8 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl shadow-md active:scale-[0.98] transition-all duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer"
              >
                Załaduj mapę
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
