"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const slides = [
  { src: "/hero/domy.png", alt: "Piękne domy od deweloperów", label: "Domy" },
  { src: "/hero/mieszkania.png", alt: "Nowoczesne mieszkania", label: "Mieszkania" },
  { src: "/hero/dzialki.png", alt: "Działki budowlane", label: "Działki" },
  { src: "/hero/magazyny.png", alt: "Obiekty przemysłowe", label: "Przemysłowe" },
  { src: "/hero/biura.jpg", alt: "Nowoczesne powierzchnie biurowe", label: "Biura" },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {slides.map((slide, i) => {
        // Only mount the current slide and its immediate neighbors. This
        // prevents the dev server from being asked to optimize all 5 large
        // hero images on first paint (which can OOM low-RAM machines when
        // one of them is a 1.7 MB JPEG).
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

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[min(92vw,52rem)] -translate-x-1/2 -translate-y-1/2 rounded-[3rem] bg-gradient-to-b from-slate-900/72 via-slate-900/52 to-slate-900/20 blur-2xl" />

        <div className="relative z-10 text-center mb-12 animate-fade-in-up">
          <p className="text-primary-light text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Twój zaufany doradca w nieruchomościach
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            Znajdź swoją
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">
              wymarzoną nieruchomość
            </span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
            Najlepsze oferty domów, mieszkań, działek i obiektów przemysłowych.
          </p>
        </div>

        {/* Search bar placeholder */}
        <div className="relative z-10 w-full max-w-3xl animate-fade-in-up animation-delay-400">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/10 p-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Szukaj nieruchomości..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>
              <select className="px-4 py-4 rounded-xl bg-slate-50 text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer">
                <option>Typ nieruchomości</option>
                <option>Domy</option>
                <option>Mieszkania</option>
                <option>Działki</option>
                <option>Przemysłowe</option>
              </select>
              <button className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-primary/25">
                Szukaj
              </button>
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
          {slides.map((slide, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`group flex items-center gap-2 transition-all duration-500 ${
                i === current ? "opacity-100" : "opacity-50 hover:opacity-75"
              }`}
              aria-label={`Przejdź do: ${slide.label}`}
            >
              <div
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === current
                    ? "w-12 bg-white"
                    : "w-6 bg-white/60 group-hover:bg-white/80"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
