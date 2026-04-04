"use client";

import { useState, useRef, useEffect } from "react";

export default function ContactForm() {
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
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="kontakt" className="py-24 sm:py-32 px-6 bg-pastel-sky">
      <div ref={ref} className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold tracking-[0.15em] uppercase">
            Kontakt
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mt-4 mb-6">
            Porozmawiajmy
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Masz pytania dotyczące nieruchomości? Skontaktuj się z nami — chętnie
            pomożemy
          </p>
        </div>

        <div
          className={`grid grid-cols-1 lg:grid-cols-5 gap-10 transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-slate-800 font-semibold mb-1">Telefon</h3>
                <a href="tel:+48123456789" className="text-slate-500 hover:text-primary transition-colors">
                  +48 123 456 789
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-slate-800 font-semibold mb-1">Email</h3>
                <a href="mailto:kontakt@paweldevelopment.pl" className="text-slate-500 hover:text-primary transition-colors">
                  kontakt@paweldevelopment.pl
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-slate-800 font-semibold mb-1">Biuro</h3>
                <p className="text-slate-500">
                  ul. Nieruchomości 15
                  <br />
                  00-001 Warszawa
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-slate-800 font-semibold mb-1">Godziny pracy</h3>
                <p className="text-slate-500">
                  Pon - Pt: 9:00 - 18:00
                  <br />
                  Sob: 10:00 - 14:00
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="lg:col-span-3 bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Imię i nazwisko
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Jan Kowalski"
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="jan@email.pl"
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
                />
              </div>
            </div>
            <div className="mb-5">
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                Telefon
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="+48 123 456 789"
                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
              />
            </div>
            <div className="mb-5">
              <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                Temat
              </label>
              <select
                id="subject"
                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all appearance-none cursor-pointer"
              >
                <option>Zapytanie ogólne</option>
                <option>Kupno nieruchomości</option>
                <option>Współpraca deweloperska</option>
                <option>Wycena nieruchomości</option>
                <option>Inne</option>
              </select>
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                Wiadomość
              </label>
              <textarea
                id="message"
                rows={4}
                placeholder="Opisz swoje potrzeby..."
                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
            >
              Wyślij wiadomość
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
