import { fetchPublicOffers, toOfferCardData } from "@/lib/public-offers";
import {
  hasActiveFilters,
  parseOfferSearchParams,
} from "@/lib/offer-search";
import { OfferCardWide } from "@/components/OfferCard";

type OffersGridProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function OffersGrid({ searchParams = {} }: OffersGridProps) {
  const filters = parseOfferSearchParams(searchParams);
  const offers = await fetchPublicOffers({ filters });
  const cards = offers.map(toOfferCardData).filter((card) => card !== null);
  const filtered = hasActiveFilters(filters);

  return (
    <section
      id="wyniki-ofert"
      className="relative z-10 px-6 pb-16 sm:pb-20 scroll-mt-28"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
            {cards.length > 0
              ? filtered
                ? "Wyniki wyszukiwania"
                : "Dostępne oferty"
              : filtered
                ? "Brak wyników"
                : "Brak ofert"}
          </h2>
          <p className="text-slate-500 mt-2">
            {cards.length > 0
              ? `Znaleziono ${cards.length} ${cards.length === 1 ? "ofertę" : cards.length < 5 ? "oferty" : "ofert"}.`
              : filtered
                ? "Zmień kryteria wyszukiwania lub wyczyść filtry, aby zobaczyć więcej ofert."
                : "Wkrótce pojawią się nowe nieruchomości."}
          </p>
        </div>

        {cards.length > 0 ? (
          <div className="flex flex-col gap-5">
            {cards.map((offer) => (
              <OfferCardWide key={offer.slug} offer={offer} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 px-6 py-16 text-center text-slate-500">
            {filtered
              ? "Nie znaleziono ofert spełniających wybrane kryteria."
              : "Nie ma jeszcze opublikowanych ofert. Sprawdź ponownie wkrótce."}
          </div>
        )}
      </div>
    </section>
  );
}
