"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const PROPERTY_TYPES = ["Dom", "Mieszkanie", "Działka", "Przemysłowe"] as const;

const CATEGORY_TO_TYPE: Record<string, (typeof PROPERTY_TYPES)[number]> = {
  domy: "Dom",
  mieszkania: "Mieszkanie",
  dzialki: "Działka",
  przemyslowe: "Przemysłowe",
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function OffersSearch() {
  const searchParams = useSearchParams();

  const initialPropertyType = useMemo(() => {
    const param = searchParams.get("typ");
    if (!param) return "";
    return CATEGORY_TO_TYPE[normalize(param)] ?? "";
  }, [searchParams]);

  const [filters, setFilters] = useState({
    offerType: "Sprzedaż",
    propertyType: initialPropertyType,
    location: "",
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
  });

  const [advancedOpen, setAdvancedOpen] = useState(false);

  function updateFilter(name: keyof typeof filters, value: string) {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative overflow-hidden bg-gradient-to-br from-white via-pastel-sky/70 to-pastel-blue/50 rounded-2xl border border-primary-lighter p-5 sm:p-7 shadow-sm"
    >
      <div className="pointer-events-none absolute -top-16 right-0 h-40 w-40 rounded-full bg-primary-light/35 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 left-10 h-36 w-36 rounded-full bg-accent/20 blur-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm text-slate-600 font-medium">Sprzedaż / wynajem</span>
          <select
            value={filters.offerType}
            onChange={(e) => updateFilter("offerType", e.target.value)}
            className="h-11 rounded-xl border border-slate-200/90 bg-white/90 px-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/25"
          >
            <option>Sprzedaż</option>
            <option>Wynajem</option>
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-slate-600 font-medium">Rodzaj nieruchomości</span>
          <select
            value={filters.propertyType}
            onChange={(e) => updateFilter("propertyType", e.target.value)}
            className="h-11 rounded-xl border border-slate-200/90 bg-white/90 px-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/25"
          >
            <option value="">Wszystkie</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-slate-600 font-medium">Lokalizacja</span>
          <input
            value={filters.location}
            onChange={(e) => updateFilter("location", e.target.value)}
            type="text"
            placeholder="Miasto lub dzielnica"
            className="h-11 rounded-xl border border-slate-200/90 bg-white/90 px-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/25"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-slate-600 font-medium">Cena od</span>
          <input
            value={filters.priceMin}
            onChange={(e) => updateFilter("priceMin", e.target.value)}
            type="number"
            min={0}
            placeholder="np. 300000"
            className="h-11 rounded-xl border border-slate-200/90 bg-white/90 px-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/25"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-slate-600 font-medium">Cena do</span>
          <input
            value={filters.priceMax}
            onChange={(e) => updateFilter("priceMax", e.target.value)}
            type="number"
            min={0}
            placeholder="np. 1200000"
            className="h-11 rounded-xl border border-slate-200/90 bg-white/90 px-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/25"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-slate-600 font-medium">Powierzchnia od (m²)</span>
          <input
            value={filters.areaMin}
            onChange={(e) => updateFilter("areaMin", e.target.value)}
            type="number"
            min={0}
            placeholder="np. 40"
            className="h-11 rounded-xl border border-slate-200/90 bg-white/90 px-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/25"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-slate-600 font-medium">Powierzchnia do (m²)</span>
          <input
            value={filters.areaMax}
            onChange={(e) => updateFilter("areaMax", e.target.value)}
            type="number"
            min={0}
            placeholder="np. 120"
            className="h-11 rounded-xl border border-slate-200/90 bg-white/90 px-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/25"
          />
        </label>
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={() => setAdvancedOpen((prev) => !prev)}
          className="text-primary font-semibold text-sm hover:text-primary-dark transition-colors"
        >
          {advancedOpen ? "Ukryj filtry zaawansowane" : "Pokaż filtry zaawansowane"}
        </button>
      </div>

      {advancedOpen && (
        <div className="mt-5 pt-5 border-t border-primary-lighter grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm text-slate-600 font-medium">Cena za metr (max)</span>
            <input
              value={filters.pricePerMeter}
              onChange={(e) => updateFilter("pricePerMeter", e.target.value)}
              type="number"
              min={0}
              placeholder="np. 15000"
              className="h-11 rounded-xl border border-slate-200/90 bg-white/90 px-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/25"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-slate-600 font-medium">Liczba pokoi</span>
            <input
              value={filters.rooms}
              onChange={(e) => updateFilter("rooms", e.target.value)}
              type="number"
              min={0}
              placeholder="np. 3"
              className="h-11 rounded-xl border border-slate-200/90 bg-white/90 px-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/25"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-slate-600 font-medium">Winda</span>
            <select
              value={filters.hasElevator}
              onChange={(e) => updateFilter("hasElevator", e.target.value)}
              className="h-11 rounded-xl border border-slate-200/90 bg-white/90 px-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/25"
            >
              <option value="">Dowolnie</option>
              <option value="tak">Tak</option>
              <option value="nie">Nie</option>
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-slate-600 font-medium">Piętro</span>
            <input
              value={filters.floor}
              onChange={(e) => updateFilter("floor", e.target.value)}
              type="number"
              min={0}
              placeholder="np. 2"
              className="h-11 rounded-xl border border-slate-200/90 bg-white/90 px-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/25"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-slate-600 font-medium">Rok budowy</span>
            <input
              value={filters.buildYear}
              onChange={(e) => updateFilter("buildYear", e.target.value)}
              type="number"
              min={1800}
              placeholder="np. 2018"
              className="h-11 rounded-xl border border-slate-200/90 bg-white/90 px-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/25"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-slate-600 font-medium">Rodzaj rynku</span>
            <select
              value={filters.marketType}
              onChange={(e) => updateFilter("marketType", e.target.value)}
              className="h-11 rounded-xl border border-slate-200/90 bg-white/90 px-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/25"
            >
              <option value="">Dowolnie</option>
              <option value="pierwotny">Pierwotny</option>
              <option value="wtorny">Wtórny</option>
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-slate-600 font-medium">Umeblowanie</span>
            <select
              value={filters.furnished}
              onChange={(e) => updateFilter("furnished", e.target.value)}
              className="h-11 rounded-xl border border-slate-200/90 bg-white/90 px-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/25"
            >
              <option value="">Dowolnie</option>
              <option value="umeblowane">Umeblowane</option>
              <option value="nieumeblowane">Nieumeblowane</option>
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-slate-600 font-medium">Liczba pięter w budynku</span>
            <input
              value={filters.buildingFloors}
              onChange={(e) => updateFilter("buildingFloors", e.target.value)}
              type="number"
              min={0}
              placeholder="np. 4"
              className="h-11 rounded-xl border border-slate-200/90 bg-white/90 px-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/25"
            />
          </label>
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          className="bg-primary hover:bg-primary-dark text-white font-semibold px-7 h-11 rounded-xl transition-colors shadow-lg shadow-primary/20"
        >
          Szukaj ofert
        </button>
        <button
          type="button"
          onClick={() =>
            setFilters({
              offerType: "Sprzedaż",
              propertyType: initialPropertyType,
              location: "",
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
            })
          }
          className="border border-primary-lighter bg-white/80 text-slate-700 font-semibold px-7 h-11 rounded-xl hover:bg-white transition-colors"
        >
          Wyczyść filtry
        </button>
      </div>
    </form>
  );
}
