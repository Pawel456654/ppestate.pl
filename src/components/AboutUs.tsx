"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: "500+", label: "Sprzedanych nieruchomości" },
  { value: "12", label: "Lat doświadczenia" },
  { value: "98%", label: "Zadowolonych klientów" },
  { value: "50+", label: "Współpracujących deweloperów" },
];

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
      className="relative overflow-hidden py-24 sm:py-32 px-6 bg-gradient-to-b from-sky-100 from-[15%] via-blue-50 via-50% to-sky-200/70"
    >
      {/* Soft radial glow — wyraźniejszy pastelowy niebieski */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[min(110%,920px)] -translate-x-1/2 rounded-full bg-sky-400/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-sky-300/25 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/35 to-transparent"
        aria-hidden
      />
      {/* Siatka kropek — mocniejszy niebieski */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(59,130,246,0.11)_1px,transparent_1px)] bg-[length:26px_26px]"
        aria-hidden
      />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div
            className={`transition-all duration-1000 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            <span className="text-primary text-sm font-semibold tracking-[0.15em] uppercase">
              O nas
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mt-4 mb-8 leading-tight">
              Twój zaufany partner
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                w świecie nieruchomości
              </span>
            </h2>
            <div className="space-y-5 text-slate-600 leading-relaxed">
              <p>
                <strong className="text-slate-800">Paweł Development</strong> to
                firma specjalizująca się w profesjonalnym pośrednictwie między
                deweloperami a klientami poszukującymi idealnej nieruchomości.
                Dzięki wieloletniemu doświadczeniu na rynku nieruchomości
                doskonale rozumiemy potrzeby obu stron transakcji.
              </p>
              <p>
                Współpracujemy z najlepszymi deweloperami w Polsce, oferując
                naszym klientom dostęp do ekskluzywnych inwestycji jeszcze przed
                ich oficjalną premierą. Nasz zespół ekspertów zapewnia pełne
                wsparcie na każdym etapie procesu zakupu — od wyboru
                nieruchomości, przez negocjacje warunków, aż po finalizację
                transakcji.
              </p>
              <p>
                Stawiamy na transparentność, profesjonalizm i indywidualne
                podejście do każdego klienta. Niezależnie czy szukasz
                wymarzowego domu, nowoczesnego mieszkania, działki pod
                inwestycję czy obiektu komercyjnego — jesteśmy tutaj, aby
                pomóc Ci podjąć najlepszą decyzję.
              </p>
            </div>
          </div>

          <div
            className={`transition-all duration-1000 delay-300 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            <div className="grid grid-cols-2 gap-5">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`bg-white rounded-2xl p-7 shadow-sm border border-slate-100 hover:border-primary/20 hover:shadow-lg transition-all duration-500 group ${
                    i === 1 ? "translate-y-6" : ""
                  } ${i === 3 ? "translate-y-6" : ""}`}
                >
                  <div className="text-3xl sm:text-4xl font-bold text-primary mb-2 group-hover:scale-105 transition-transform origin-left">
                    {stat.value}
                  </div>
                  <div className="text-slate-500 text-sm leading-snug">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-4">
              <div className="flex -space-x-3">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white text-xs font-bold"
                  >
                    {["PD", "AK", "MN", "JW"][i]}
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="text-slate-800 font-semibold">Nasz zespół</div>
                <div className="text-slate-400">
                  Doświadczeni specjaliści do Twojej dyspozycji
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
