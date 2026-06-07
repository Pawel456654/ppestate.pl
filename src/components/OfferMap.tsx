import type { Oferta } from "@/types/database";
import { getOfferMapData } from "@/lib/offer-display";

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

      <iframe
        title={`Mapa — ${map.label}`}
        src={map.embedUrl}
        className="block w-full h-[360px] sm:h-[420px] md:h-[480px] border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </section>
  );
}
