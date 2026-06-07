import type { Metadata } from "next";
import { Suspense } from "react";
import OffersSearch from "@/components/OffersSearch";
import OffersGrid from "@/components/OffersGrid";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Oferty | PP Estate",
  description:
    "Przeglądaj oferty nieruchomości: domy, mieszkania, działki i obiekty przemysłowe. Zaawansowane filtrowanie pomaga szybko znaleźć odpowiednią ofertę.",
};

type OffersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OffersPage({ searchParams }: OffersPageProps) {
  const params = await searchParams;

  return (
    <>
      <main className="relative pt-16 overflow-hidden bg-gradient-to-b from-pastel-sky via-white to-pastel-blue/40">
        <div className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-primary-light/25 blur-3xl" />
        <div className="pointer-events-none absolute top-[28rem] -right-16 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-24 left-1/3 h-56 w-56 rounded-full bg-pastel-blue/70 blur-3xl" />
        <section className="relative px-6 py-14 sm:py-20 border-b border-slate-100 bg-[url('/oferty-hero.png')] bg-cover bg-center">
          <div className="absolute inset-0 bg-slate-900/65" />
          <div className="relative z-10 max-w-7xl mx-auto">
            <span className="text-primary-light text-sm font-semibold tracking-[0.15em] uppercase">
              Wyszukiwarka ofert
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 mb-4">
              Znajdź nieruchomość dla siebie
            </h1>
          </div>
        </section>

        <section className="relative z-10 px-6 py-10 sm:py-14">
          <div className="max-w-7xl mx-auto">
            <Suspense
              fallback={
                <div
                  className="relative overflow-hidden bg-gradient-to-br from-white via-pastel-sky/70 to-pastel-blue/50 rounded-2xl border border-primary-lighter p-5 sm:p-7 shadow-sm min-h-[280px] animate-pulse"
                  aria-hidden
                />
              }
            >
              <OffersSearch />
            </Suspense>
          </div>
        </section>

        <OffersGrid searchParams={params} />
      </main>

      <Footer />
    </>
  );
}
