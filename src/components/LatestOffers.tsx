import Link from "next/link";
import { fetchPublicOffers, toOfferCardData } from "@/lib/public-offers";
import { OfferCardCompact } from "@/components/OfferCard";

export default async function LatestOffers() {
  // Wyróżnione na stronie głównej mają pierwszeństwo; brakujące miejsca
  // uzupełniamy najnowszymi widocznymi (w tym oferty Esti).
  const featured = await fetchPublicOffers({ limit: 6, featuredOnHomepage: true });
  const latest = await fetchPublicOffers({ limit: 6 });
  const featuredIds = new Set(featured.map((o) => o.id));
  const combined = [
    ...featured,
    ...latest.filter((o) => !featuredIds.has(o.id)),
  ].slice(0, 6);
  const cards = combined.map(toOfferCardData).filter((card) => card !== null);

  return (
    <section id="oferty" className="py-24 sm:py-32 px-6 bg-pastel-sky">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-primary text-sm font-semibold tracking-[0.15em] uppercase">
              Najnowsze oferty
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mt-4 mb-4">
              Świeżo dodane
            </h2>
            <p className="text-slate-500 text-lg max-w-xl">
              Sprawdź najnowsze nieruchomości dodane do naszej bazy
            </p>
          </div>
          <Link
            href="/oferty"
            className="text-primary font-semibold text-sm hover:text-primary-dark transition-colors flex items-center gap-2 shrink-0"
          >
            Zobacz wszystkie
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>

        {cards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {cards.map((offer, i) => (
              <OfferCardCompact key={offer.slug} offer={offer} index={i} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 px-6 py-16 text-center text-slate-500">
            Brak ofert do wyświetlenia. Dodaj pierwszą ofertę w panelu administracyjnym.
          </div>
        )}
      </div>
    </section>
  );
}
