"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const slides = [
  { src: "/hero/domy.png", alt: "Piękne domy od deweloperów", label: "Domy" },
  { src: "/hero/mieszkania.png", alt: "Nowoczesne mieszkania", label: "Mieszkania" },
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
    <section className="relative mb-60 h-[50vh] w-full overflow-visible sm:mb-28 lg:mb-12">
      <div className="absolute inset-0 overflow-hidden">
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
      </div>
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        {/* Search bar placeholder */}
        <div className="absolute z-20 left-1/2 bottom-0 w-full max-w-3xl -translate-x-1/2 translate-y-[calc(100%+5rem)] px-4 animate-fade-in-up animation-delay-400 sm:translate-y-[62%] sm:px-6">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/25 ring-1 ring-slate-300/90 p-3">
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

        <div className="absolute left-0 bottom-0 z-10 w-full translate-y-full overflow-hidden bg-[#0d3479] py-2.5 ring-1 ring-white/20">
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
