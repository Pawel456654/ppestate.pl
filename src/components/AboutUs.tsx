"use client";

import { useEffect, useRef, useState } from "react";

export default function AboutUs() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="o-nas"
      className="relative overflow-hidden py-14 sm:py-20 px-6 sm:px-8 lg:px-12 bg-gradient-to-b from-sky-100 from-[15%] via-blue-50 via-50% to-sky-200/70"
    >
      <div
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(59,130,246,0.09)_1px,transparent_1px)] bg-[length:28px_28px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/35 to-transparent"
        aria-hidden
      />

      <div ref={ref} className="relative z-10 mx-auto max-w-7xl">
        <div
          className={`relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/45 shadow-[0_20px_60px_-20px_rgba(59,130,246,0.25)] backdrop-blur-md transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full border border-primary/10 bg-gradient-to-br from-sky-100/80 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-accent/5 blur-2xl"
            aria-hidden
          />

          <div className="relative grid gap-10 p-8 sm:p-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:gap-14 lg:p-12 xl:p-14">
            <div
              className={`transition-all duration-1000 delay-100 ${
                visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
              }`}
            >
              <span className="mb-5 block text-primary text-sm font-semibold tracking-[0.15em] uppercase">
                O nas
              </span>

              <h2 className="text-[1.75rem] font-bold leading-[1.15] sm:text-3xl md:text-[2.125rem] lg:text-4xl">
                <span className="block whitespace-nowrap text-logo sm:whitespace-normal">
                  Twój zaufany doradca
                </span>
                <span className="mt-1 block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  w świecie nieruchomości
                </span>
              </h2>
            </div>

            <div
              className={`relative transition-all duration-1000 delay-300 ${
                visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
              }`}
            >
              <div
                className="pointer-events-none absolute -left-3 top-2 bottom-2 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent lg:-left-5"
                aria-hidden
              />
              <p className="text-slate-600 text-base leading-[1.75] sm:text-lg sm:leading-relaxed">
                PP Estate z Wrocławia łączy klientów chcących sprzedać, kupić
                lub wynająć nieruchomość. Prowadzi kompleksowo transakcje
                począwszy od pierwszej rozmowy po podpisanie umowy i przekazanie
                protokolarne nieruchomości drugiej stronie.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
