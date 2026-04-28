"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const categories = [
  {
    title: "Domy",
    queryType: "domy",
    description: "Komfortowe domy jednorodzinne i bliźniaki w najlepszych lokalizacjach",
    count: 48,
    gradient: "from-blue-400 via-blue-500 to-indigo-500",
    hoverGradient: "group-hover:from-blue-500 group-hover:via-blue-600 group-hover:to-indigo-600",
    iconBg: "bg-blue-300/30",
    illustration: "house",
  },
  {
    title: "Mieszkania",
    queryType: "mieszkania",
    description: "Nowoczesne apartamenty i mieszkania w prestiżowych inwestycjach",
    count: 124,
    gradient: "from-violet-400 via-purple-500 to-indigo-500",
    hoverGradient: "group-hover:from-violet-500 group-hover:via-purple-600 group-hover:to-indigo-600",
    iconBg: "bg-violet-300/30",
    illustration: "apartment",
  },
  {
    title: "Działki",
    queryType: "dzialki",
    description: "Atrakcyjne działki budowlane, rolne i inwestycyjne",
    count: 67,
    gradient: "from-emerald-400 via-teal-500 to-cyan-500",
    hoverGradient: "group-hover:from-emerald-500 group-hover:via-teal-600 group-hover:to-cyan-600",
    iconBg: "bg-emerald-300/30",
    illustration: "land",
  },
  {
    title: "Komercyjne",
    queryType: "przemyslowe",
    description: "Hale, magazyny i obiekty komercyjne dla Twojego biznesu",
    count: 31,
    gradient: "from-amber-400 via-orange-400 to-rose-400",
    hoverGradient: "group-hover:from-amber-500 group-hover:via-orange-500 group-hover:to-rose-500",
    iconBg: "bg-amber-300/30",
    illustration: "warehouse",
  },
];

function HouseIllustration() {
  return (
    <svg viewBox="0 0 200 180" fill="none" className="w-full h-full">
      {/* Ground */}
      <ellipse cx="100" cy="165" rx="80" ry="8" className="fill-white/10" />

      {/* House body */}
      <rect x="45" y="85" width="110" height="75" rx="4" className="fill-white/20 animate-[fade-in_0.8s_ease-out]" />
      <rect x="50" y="90" width="100" height="65" rx="2" className="fill-white/10" />

      {/* Roof */}
      <path d="M30 90 L100 35 L170 90 Z" className="fill-white/25" />
      <path d="M40 90 L100 42 L160 90 Z" className="fill-white/15" />

      {/* Chimney */}
      <rect x="130" y="45" width="16" height="30" rx="2" className="fill-white/20" />
      {/* Smoke */}
      <circle cx="138" cy="38" r="4" className="fill-white/15 animate-[float_3s_ease-in-out_infinite]" />
      <circle cx="142" cy="28" r="3" className="fill-white/10 animate-[float_3s_ease-in-out_infinite_0.5s]" />
      <circle cx="136" cy="20" r="2.5" className="fill-white/8 animate-[float_3s_ease-in-out_infinite_1s]" />

      {/* Door */}
      <rect x="87" y="115" width="26" height="40" rx="13" className="fill-white/25" />
      <circle cx="107" cy="137" r="2" className="fill-white/40" />

      {/* Windows */}
      <rect x="58" y="100" width="22" height="20" rx="3" className="fill-white/30" />
      <line x1="69" y1="100" x2="69" y2="120" className="stroke-white/20" strokeWidth="1.5" />
      <line x1="58" y1="110" x2="80" y2="110" className="stroke-white/20" strokeWidth="1.5" />

      <rect x="120" y="100" width="22" height="20" rx="3" className="fill-white/30" />
      <line x1="131" y1="100" x2="131" y2="120" className="stroke-white/20" strokeWidth="1.5" />
      <line x1="120" y1="110" x2="142" y2="110" className="stroke-white/20" strokeWidth="1.5" />

      {/* Roof window */}
      <circle cx="100" cy="63" r="10" className="fill-white/25" />
      <circle cx="100" cy="63" r="7" className="fill-white/15" />

      {/* Garden elements */}
      <circle cx="30" cy="155" r="12" className="fill-white/8 animate-[float_4s_ease-in-out_infinite_0.3s]" />
      <circle cx="25" cy="148" r="9" className="fill-white/10 animate-[float_4s_ease-in-out_infinite_0.6s]" />
      <rect x="27" y="155" width="3" height="12" rx="1" className="fill-white/12" />

      <circle cx="175" cy="152" r="10" className="fill-white/8 animate-[float_4s_ease-in-out_infinite_1s]" />
      <circle cx="170" cy="146" r="8" className="fill-white/10 animate-[float_4s_ease-in-out_infinite_1.3s]" />
      <rect x="172" y="152" width="3" height="14" rx="1" className="fill-white/12" />
    </svg>
  );
}

function ApartmentIllustration() {
  return (
    <svg viewBox="0 0 200 180" fill="none" className="w-full h-full">
      {/* Ground */}
      <ellipse cx="100" cy="168" rx="85" ry="6" className="fill-white/10" />

      {/* Main building */}
      <rect x="55" y="30" width="70" height="135" rx="4" className="fill-white/20" />
      <rect x="60" y="35" width="60" height="125" rx="2" className="fill-white/10" />

      {/* Side building */}
      <rect x="125" y="70" width="40" height="95" rx="3" className="fill-white/15" />
      <rect x="130" y="75" width="30" height="85" rx="2" className="fill-white/8" />

      {/* Roof accent */}
      <rect x="55" y="25" width="70" height="8" rx="4" className="fill-white/25" />
      <rect x="125" y="65" width="40" height="8" rx="4" className="fill-white/20" />

      {/* Main windows - animated glow */}
      {[0, 1, 2, 3, 4].map((row) =>
        [0, 1, 2].map((col) => (
          <rect
            key={`main-${row}-${col}`}
            x={68 + col * 17}
            y={42 + row * 22}
            width="11"
            height="14"
            rx="2"
            className={`fill-white/${(row + col) % 3 === 0 ? "35" : "20"} ${
              (row + col) % 4 === 0
                ? "animate-[pulse_3s_ease-in-out_infinite]"
                : ""
            }`}
            style={{ animationDelay: `${(row * 3 + col) * 0.4}s` }}
          />
        ))
      )}

      {/* Side windows */}
      {[0, 1, 2, 3].map((row) => (
        <rect
          key={`side-${row}`}
          x={136}
          y={82 + row * 20}
          width="10"
          height="12"
          rx="2"
          className={`fill-white/${row % 2 === 0 ? "30" : "18"}`}
        />
      ))}

      {/* Entrance */}
      <rect x="82" y="140" width="16" height="22" rx="8" className="fill-white/25" />

      {/* Decorative floating elements */}
      <circle cx="35" cy="50" r="3" className="fill-white/15 animate-[float_5s_ease-in-out_infinite]" />
      <circle cx="180" cy="40" r="2" className="fill-white/12 animate-[float_4s_ease-in-out_infinite_1s]" />
      <circle cx="25" cy="90" r="2" className="fill-white/10 animate-[float_6s_ease-in-out_infinite_2s]" />
    </svg>
  );
}

function LandIllustration() {
  return (
    <svg viewBox="0 0 200 180" fill="none" className="w-full h-full">
      {/* Rolling hills */}
      <path d="M0 130 Q50 100 100 120 Q150 140 200 110 L200 180 L0 180 Z" className="fill-white/12" />
      <path d="M0 145 Q60 125 120 140 Q170 155 200 135 L200 180 L0 180 Z" className="fill-white/8" />

      {/* Plot lines */}
      <line x1="40" y1="100" x2="40" y2="160" className="stroke-white/20" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="100" y1="85" x2="100" y2="160" className="stroke-white/20" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="160" y1="95" x2="160" y2="160" className="stroke-white/20" strokeWidth="1" strokeDasharray="4 4" />

      {/* Flag / marker */}
      <line x1="100" y1="40" x2="100" y2="85" className="stroke-white/30" strokeWidth="2" />
      <path d="M100 40 L125 50 L100 60 Z" className="fill-white/30 animate-[pulse_2s_ease-in-out_infinite]" />

      {/* Corner markers */}
      <circle cx="40" cy="105" r="4" className="fill-white/25 animate-[pulse_3s_ease-in-out_infinite]" />
      <circle cx="160" cy="100" r="4" className="fill-white/25 animate-[pulse_3s_ease-in-out_infinite_1s]" />
      <circle cx="40" cy="155" r="4" className="fill-white/25 animate-[pulse_3s_ease-in-out_infinite_0.5s]" />
      <circle cx="160" cy="150" r="4" className="fill-white/25 animate-[pulse_3s_ease-in-out_infinite_1.5s]" />

      {/* Plot boundary */}
      <path d="M40 105 L160 100 L160 150 L40 155 Z" className="fill-white/8 stroke-white/20" strokeWidth="1.5" strokeDasharray="6 3" />

      {/* Tree */}
      <circle cx="60" cy="80" r="14" className="fill-white/12 animate-[float_4s_ease-in-out_infinite]" />
      <circle cx="53" cy="75" r="10" className="fill-white/15 animate-[float_4s_ease-in-out_infinite_0.5s]" />
      <circle cx="68" cy="76" r="11" className="fill-white/10 animate-[float_4s_ease-in-out_infinite_1s]" />
      <rect x="58" y="90" width="4" height="16" rx="2" className="fill-white/15" />

      {/* Sun */}
      <circle cx="165" cy="35" r="16" className="fill-white/15 animate-[pulse_4s_ease-in-out_infinite]" />
      <circle cx="165" cy="35" r="10" className="fill-white/20" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <line
          key={angle}
          x1={165 + Math.cos((angle * Math.PI) / 180) * 20}
          y1={35 + Math.sin((angle * Math.PI) / 180) * 20}
          x2={165 + Math.cos((angle * Math.PI) / 180) * 25}
          y2={35 + Math.sin((angle * Math.PI) / 180) * 25}
          className="stroke-white/15"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}

      {/* Small plants */}
      <path d="M130 130 Q132 120 134 130" className="stroke-white/20 fill-none" strokeWidth="1.5" />
      <path d="M128 130 Q132 118 136 130" className="stroke-white/15 fill-none" strokeWidth="1" />
      <path d="M80 140 Q82 132 84 140" className="stroke-white/20 fill-none" strokeWidth="1.5" />
    </svg>
  );
}

function WarehouseIllustration() {
  return (
    <svg viewBox="0 0 200 180" fill="none" className="w-full h-full">
      {/* Ground */}
      <ellipse cx="100" cy="165" rx="90" ry="7" className="fill-white/10" />

      {/* Main warehouse */}
      <rect x="25" y="75" width="130" height="85" rx="3" className="fill-white/18" />

      {/* Saw-tooth roof */}
      <path d="M25 75 L55 45 L55 75 L85 45 L85 75 L115 45 L115 75 L145 45 L155 55 L155 75 Z" className="fill-white/22" />
      <path d="M55 45 L55 75" className="stroke-white/15" strokeWidth="1" />
      <path d="M85 45 L85 75" className="stroke-white/15" strokeWidth="1" />
      <path d="M115 45 L115 75" className="stroke-white/15" strokeWidth="1" />

      {/* Roof windows */}
      <rect x="35" y="55" width="14" height="18" rx="2" className="fill-white/25" />
      <rect x="65" y="55" width="14" height="18" rx="2" className="fill-white/25" />
      <rect x="95" y="55" width="14" height="18" rx="2" className="fill-white/25" />

      {/* Wall panels */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={`panel-${i}`}
          x1={25 + (i + 1) * 21.67}
          y1={80}
          x2={25 + (i + 1) * 21.67}
          y2={160}
          className="stroke-white/10"
          strokeWidth="1"
        />
      ))}

      {/* Garage door */}
      <rect x="55" y="110" width="40" height="50" rx="3" className="fill-white/25" />
      {[0, 1, 2, 3].map((i) => (
        <line
          key={`door-${i}`}
          x1={55}
          y1={120 + i * 10}
          x2={95}
          y2={120 + i * 10}
          className="stroke-white/15"
          strokeWidth="1"
        />
      ))}

      {/* Small door */}
      <rect x="115" y="130" width="18" height="30" rx="2" className="fill-white/20" />
      <circle cx="129" cy="147" r="1.5" className="fill-white/30" />

      {/* Forklift / vehicle */}
      <rect x="165" y="140" width="22" height="14" rx="2" className="fill-white/15 animate-[slide-in-left_2s_ease-out]" />
      <rect x="162" y="135" width="10" height="14" rx="1" className="fill-white/12" />
      <circle cx="170" cy="157" r="4" className="fill-white/20" />
      <circle cx="183" cy="157" r="4" className="fill-white/20" />

      {/* Floating cargo boxes */}
      <rect x="10" y="130" width="12" height="12" rx="2" className="fill-white/15 animate-[float_3s_ease-in-out_infinite]" />
      <rect x="6" y="142" width="12" height="12" rx="2" className="fill-white/12 animate-[float_3s_ease-in-out_infinite_0.5s]" />
      <rect x="18" y="138" width="10" height="10" rx="2" className="fill-white/10 animate-[float_3s_ease-in-out_infinite_1s]" />

      {/* Crane arm */}
      <line x1="155" y1="30" x2="155" y2="75" className="stroke-white/20" strokeWidth="2" />
      <line x1="140" y1="30" x2="175" y2="30" className="stroke-white/20" strokeWidth="2" />
      <line x1="170" y1="30" x2="170" y2="50" className="stroke-white/15" strokeWidth="1" strokeDasharray="3 2" />
      <rect x="166" y="50" width="8" height="6" rx="1" className="fill-white/15 animate-[float_2s_ease-in-out_infinite]" />
    </svg>
  );
}

const illustrations: Record<string, React.FC> = {
  house: HouseIllustration,
  apartment: ApartmentIllustration,
  land: LandIllustration,
  warehouse: WarehouseIllustration,
};

function CategoryCard({
  category,
  index,
}: {
  category: (typeof categories)[0];
  index: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const Illustration = illustrations[category.illustration];

  return (
    <Link
      ref={ref}
      href={`/oferty?typ=${category.queryType}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div
        className={`relative h-80 sm:h-96 bg-gradient-to-br ${category.gradient} ${category.hoverGradient} transition-all duration-700 p-6`}
      >
        {/* Decorative floating circles */}
        <div
          className={`absolute top-6 right-6 w-24 h-24 rounded-full ${category.iconBg} transition-all duration-700 ${
            hovered ? "scale-150 opacity-50" : "scale-100 opacity-100"
          }`}
        />
        <div
          className={`absolute top-20 right-20 w-12 h-12 rounded-full ${category.iconBg} transition-all duration-700 delay-100 ${
            hovered ? "scale-125 translate-x-4 translate-y-4" : ""
          }`}
        />
        <div
          className={`absolute bottom-32 left-4 w-8 h-8 rounded-full ${category.iconBg} transition-all duration-500 ${
            hovered ? "scale-150" : ""
          }`}
        />

        {/* Illustration */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
            hovered ? "scale-110 -translate-y-2" : "scale-100"
          }`}
        >
          <div className="w-48 h-44">
            <Illustration />
          </div>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold transition-all duration-500 ${
                hovered ? "bg-white/30" : ""
              }`}
            >
              {category.count} ofert
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">{category.title}</h3>
          <p
            className={`text-white/70 text-sm leading-relaxed max-w-xs transition-all duration-500 ${
              hovered ? "text-white/90" : ""
            }`}
          >
            {category.description}
          </p>
          <div
            className={`mt-4 flex items-center gap-2 text-white/80 text-sm font-medium transition-all duration-500 ${
              hovered ? "text-white gap-3" : ""
            }`}
          >
            <span>Zobacz oferty</span>
            <svg
              className={`w-4 h-4 transition-transform duration-500 ${
                hovered ? "translate-x-1" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Categories() {
  return (
    <section id="kategorie" className="py-24 sm:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold tracking-[0.15em] uppercase">
            Nasza oferta
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mt-4 mb-6">
            Czego szukasz?
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Wybierz kategorię i przeglądaj setki ofert bezpośrednio od
            sprawdzonych deweloperów
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, i) => (
            <CategoryCard key={category.title} category={category} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
