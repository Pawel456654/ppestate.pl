"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  buildOfferSearchQuery,
  formStateToFilters,
  type OfferSearchFormState,
} from "@/lib/offer-search";
import type { CategoryQueryType } from "@/lib/offers";

const slides = [
  { src: "/hero/domy.png", alt: "Piękne domy od deweloperów", label: "Domy" },
  { src: "/hero/mieszkania.png", alt: "Nowoczesne mieszkania", label: "Mieszkania" },
  { src: "/hero/dzialki.jpg", alt: "Atrakcyjne działki budowlane", label: "Działki" },
];

const HERO_PROPERTY_TYPES: { value: CategoryQueryType | ""; label: string }[] = [
  { value: "", label: "Wszystkie typy" },
  { value: "domy", label: "Domy" },
  { value: "mieszkania", label: "Mieszkania" },
  { value: "dzialki", label: "Działki" },
  { value: "przemyslowe", label: "Przemysłowe" },
];

type HeroSliderProps = {
  cities?: string[];
};

export default function HeroSlider({ cities = [] }: HeroSliderProps) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [city, setCity] = useState("");
  const [propertyType, setPropertyType] = useState<CategoryQueryType | "">("");
  const [transactionType, setTransactionType] = useState<"kupno" | "wynajem">("kupno");

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning || index === current) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 800);
    },
    [isTransitioning, current]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [current, goTo]);

  function handleSearch() {
    const form: OfferSearchFormState = {
      offerType: transactionType === "wynajem" ? "Wynajem" : "Sprzedaż",
      propertyType:
        propertyType === "domy"
          ? "Dom"
          : propertyType === "mieszkania"
            ? "Mieszkanie"
            : propertyType === "dzialki"
              ? "Działka"
              : propertyType === "przemyslowe"
                ? "Komercyjne"
                : "",
      location: city,
      priceMin: "",
      priceMax: "",
      areaMin: "",
      areaMax: "",
      pricePerMeter: "",
      rooms: "",
      hasElevator: "",
      floor: "",
      buildYear: "",
      marketType: "",
      furnished: "",
      buildingFloors: "",
    };

    const query = buildOfferSearchQuery(formStateToFilters(form));
    router.push(query ? `/oferty?${query}` : "/oferty");
  }

  const selectClassName =
    "w-full px-4 py-4 rounded-xl bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer";

  const searchForm = (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/25 ring-1 ring-slate-300/90 p-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={selectClassName}
          aria-label="Miasto"
        >
          <option value="">Miasto</option>
          {cities.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={propertyType}
          onChange={(e) =>
            setPropertyType(e.target.value as CategoryQueryType | "")
          }
          className={selectClassName}
          aria-label="Typ nieruchomości"
        >
          {HERO_PROPERTY_TYPES.map((type) => (
            <option key={type.value || "all"} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        <select
          value={transactionType}
          onChange={(e) =>
            setTransactionType(e.target.value as "kupno" | "wynajem")
          }
          className={selectClassName}
          aria-label="Rodzaj transakcji"
        >
          <option value="kupno">Kupno</option>
          <option value="wynajem">Wynajem</option>
        </select>

        <button
          type="button"
          onClick={handleSearch}
          className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-primary/25 whitespace-nowrap"
        >
          Szukaj
        </button>
      </div>
    </div>
  );

  return (
    <section className="relative w-full sm:h-[50vh] sm:mb-28 lg:mb-12">
      <div className="relative h-[45vh] sm:absolute sm:inset-0 overflow-hidden">
        {slides.map((slide, i) => {
          const isActive = i === current;
          const isNeighbor =
            i === (current + 1) % slides.length ||
            i === (current - 1 + slides.length) % slides.length;
          if (!isActive && !isNeighbor) return null;

          return (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                isActive ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover"
                preload={i === 0}
                loading={i === 0 ? "eager" : "lazy"}
                sizes="100vw"
              />
            </div>
          );
        })}

        <div className="absolute left-0 bottom-0 z-10 w-full sm:translate-y-full overflow-hidden bg-[#0d3479] py-2.5 ring-1 ring-white/20">
          <div className="marquee-track text-[11px] font-semibold uppercase tracking-[0.08em] text-white sm:text-sm sm:tracking-[0.12em]">
            <div className="marquee-segment whitespace-nowrap">
              <span className="inline-block px-8">Twój zaufany doradca w nieruchomościach</span>
              <span className="inline-block px-4 text-white">•</span>
              <span className="inline-block px-8">Twój zaufany doradca w nieruchomościach</span>
              <span className="inline-block px-4 text-white">•</span>
              <span className="inline-block px-8">Twój zaufany doradca w nieruchomościach</span>
            </div>
            <div className="marquee-segment whitespace-nowrap" aria-hidden="true">
              <span className="inline-block px-8">Twój zaufany doradca w nieruchomościach</span>
              <span className="inline-block px-4 text-white">•</span>
              <span className="inline-block px-8">Twój zaufany doradca w nieruchomościach</span>
              <span className="inline-block px-4 text-white">•</span>
              <span className="inline-block px-8">Twój zaufany doradca w nieruchomościach</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-20 mx-auto w-full max-w-3xl px-4 pt-5 sm:absolute sm:left-1/2 sm:bottom-0 sm:px-6 sm:pt-0 sm:-translate-x-1/2 sm:translate-y-[62%] animate-fade-in-up animation-delay-400">
        {searchForm}
      </div>
      <style jsx>{`
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 20s linear infinite;
        }

        .marquee-segment {
          flex-shrink: 0;
        }

        @media (min-width: 640px) {
          .marquee-track {
            animation-duration: 16s;
          }
        }

        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
