import Link from "next/link";
import { CategoryCards } from "@/components/Categories";
import { fetchCategoryOfferCounts } from "@/lib/public-offers";

export default async function OfferExploreCategories() {
  const counts = await fetchCategoryOfferCounts();
  return (
    <section className="px-6 py-16 sm:py-20 bg-pastel-sky border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <span className="text-primary text-sm font-semibold tracking-[0.15em] uppercase">
            Szukasz czegoś innego?
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mt-3 mb-4">
            To nie to, czego szukasz?
          </h2>
          <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto">
            Wybierz kategorię i przeglądaj aktualne oferty nieruchomości — może znajdziesz
            coś lepiej dopasowanego do Twoich potrzeb.
          </p>
        </div>

        <CategoryCards counts={counts} />

        <div className="mt-8 text-center">
          <Link
            href="/oferty"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors"
          >
            Przeglądaj wszystkie oferty
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
