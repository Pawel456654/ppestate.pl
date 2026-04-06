"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const offers = [
  {
    id: 1,
    title: "Nowoczesny dom w zabudowie bliźniaczej",
    location: "Kraków, Podgórze",
    price: "890 000 zł",
    area: "145 m²",
    rooms: 5,
    type: "Dom",
    image: "/hero/domy.png",
    badge: "Nowość",
  },
  {
    id: 2,
    title: "Apartament z widokiem na Wisłę",
    location: "Warszawa, Mokotów",
    price: "1 250 000 zł",
    area: "78 m²",
    rooms: 3,
    type: "Mieszkanie",
    image: "/hero/mieszkania.png",
    badge: "Premium",
  },
  {
    id: 3,
    title: "Działka budowlana z mediami",
    location: "Wrocław, okolice",
    price: "320 000 zł",
    area: "1 200 m²",
    rooms: null,
    type: "Działka",
    image: "/hero/dzialki.png",
    badge: "Okazja",
  },
  {
    id: 4,
    title: "Hala magazynowa klasy A",
    location: "Łódź, Widzew",
    price: "4 500 000 zł",
    area: "2 500 m²",
    rooms: null,
    type: "Przemysłowe",
    image: "/hero/magazyny.png",
    badge: null,
  },
  {
    id: 5,
    title: "Mieszkanie 3-pokojowe w centrum",
    location: "Gdańsk, Śródmieście",
    price: "720 000 zł",
    area: "62 m²",
    rooms: 3,
    type: "Mieszkanie",
    image: "/hero/mieszkania.png",
    badge: "Nowość",
  },
  {
    id: 6,
    title: "Dom jednorodzinny z ogrodem",
    location: "Poznań, Jeżyce",
    price: "1 150 000 zł",
    area: "180 m²",
    rooms: 6,
    type: "Dom",
    image: "/hero/domy.png",
    badge: null,
  },
];

function OfferCard({
  offer,
  index,
}: {
  offer: (typeof offers)[0];
  index: number;
}) {
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
    <div
      ref={ref}
      className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-700 cursor-pointer border border-slate-100 hover:border-primary/20 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="relative h-52 overflow-hidden">
        <Image
          src={offer.image}
          alt={offer.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full">
            {offer.type}
          </span>
          {offer.badge && (
            <span className="bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              {offer.badge}
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-2">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {offer.location}
        </div>
        <h3 className="text-slate-800 font-semibold text-base mb-3 leading-snug group-hover:text-primary transition-colors">
          {offer.title}
        </h3>
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            {offer.area}
          </span>
          {offer.rooms && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              {offer.rooms} pokoi
            </span>
          )}
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-primary font-bold text-lg">{offer.price}</span>
          <span className="text-primary/70 text-sm font-medium group-hover:text-primary transition-colors flex items-center gap-1">
            Szczegóły
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function LatestOffers() {
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {offers.map((offer, i) => (
            <OfferCard key={offer.id} offer={offer} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
