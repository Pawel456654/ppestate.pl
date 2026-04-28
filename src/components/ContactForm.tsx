"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import Image from "next/image";

const CONTACT_WEBHOOK_URL =
  process.env.NEXT_PUBLIC_CONTACT_WEBHOOK_URL ??
  "http://localhost:5678/webhook-test/1446e493-54e0-4d34-a105-1849f129f8cf";

export default function ContactForm() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("Zapytanie ogólne");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorText, setErrorText] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorText("");
    try {
      const res = await fetch(CONTACT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          subject,
          message: message.trim(),
          submittedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setSubject("Zapytanie ogólne");
      setMessage("");
    } catch {
      setStatus("error");
      setErrorText(
        "Nie udało się wysłać wiadomości. Spróbuj ponownie lub skontaktuj się telefonicznie."
      );
    }
  }

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
    <section
      id="kontakt"
      className="relative overflow-hidden bg-gradient-to-b from-sky-100/95 via-pastel-sky to-pastel-blue/90"
    >
      <div
        className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-sky-300/35 blur-3xl sm:h-96 sm:w-96"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-12 h-64 w-64 rounded-full bg-indigo-200/40 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(59,130,246,0.09)_1px,transparent_1px)] bg-[length:22px_22px]"
        aria-hidden
      />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-12 sm:pt-16 pb-6 sm:pb-8">
        <div className="text-center mb-6 sm:mb-8">
          <span className="text-sky-600 text-xs sm:text-sm font-semibold tracking-[0.15em] uppercase">
            Kontakt
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mt-2 mb-3">
            Porozmawiajmy
          </h2>
          <p className="text-sky-900/65 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Masz pytania dotyczące nieruchomości? Skontaktuj się z nami — chętnie
            pomożemy
          </p>
        </div>
      </div>

      <div
        className={`relative z-10 w-full overflow-hidden border-y border-sky-300/55 bg-gradient-to-r from-sky-200/75 via-blue-100/85 to-indigo-100/80 transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_20%_50%,rgba(125,211,252,0.45),transparent_50%),radial-gradient(ellipse_90%_60%_at_80%_40%,rgba(165,180,252,0.4),transparent_48%)]"
          aria-hidden
        />
        <div className="relative grid grid-cols-1 md:grid-cols-3 min-h-0 divide-y md:divide-y-0 md:divide-x divide-sky-300/55">
          <a
            href="tel:+48601782517"
            className="flex flex-col items-center justify-center gap-4 px-6 sm:px-8 lg:px-12 py-10 sm:py-14 text-center bg-sky-200/50 hover:bg-sky-300/55 transition-colors"
          >
            <div className="w-14 h-14 rounded-2xl bg-sky-300/90 text-sky-800 shadow-sm shadow-sky-300/40 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-slate-800 font-semibold mb-2">Telefon</h3>
              <span className="text-sky-800/80 hover:text-primary transition-colors">
                +48 601 782 517
              </span>
            </div>
          </a>

          <a
            href="mailto:kontakt@paweldevelopment.pl"
            className="flex flex-col items-center justify-center gap-4 px-6 sm:px-8 lg:px-12 py-10 sm:py-14 text-center bg-blue-200/45 hover:bg-blue-300/50 transition-colors"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-300/85 text-blue-900 shadow-sm shadow-blue-300/35 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-slate-800 font-semibold mb-2">Email</h3>
              <span className="text-blue-950/80 hover:text-primary transition-colors break-all">
                kontakt@paweldevelopment.pl
              </span>
            </div>
          </a>

          <div className="flex flex-col items-center justify-center gap-4 px-6 sm:px-8 lg:px-12 py-10 sm:py-14 text-center bg-indigo-200/40 hover:bg-indigo-300/45 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-indigo-300/80 text-indigo-900 shadow-sm shadow-indigo-300/35 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-slate-800 font-semibold mb-2">Adres</h3>
              <p className="text-indigo-950/80">
                ul. Świdnicka 40
                <br />
                50-030 Wrocław
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`relative w-full overflow-hidden border-b border-slate-200/60 transition-all duration-1000 delay-150 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <Image
          src="/contact-section-background.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority={false}
          aria-hidden
        />
        {/* Ciemna warstwa — czytelność formularza na zdjęciu */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/70 to-slate-950/80"
          aria-hidden
        />
        <div className="relative z-10 w-full px-6 sm:px-8 lg:px-12 xl:px-16 py-16 sm:py-20 lg:py-24">
          <form onSubmit={handleSubmit} className="w-full max-w-none mx-auto space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-100 mb-2">
                  Imię i nazwisko
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jan Kowalski"
                  className="w-full px-4 py-3.5 rounded-xl bg-white/95 border border-white/25 text-slate-800 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-100 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jan@email.pl"
                  className="w-full px-4 py-3.5 rounded-xl bg-white/95 border border-white/25 text-slate-800 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
                />
              </div>
              <div className="sm:col-span-2 xl:col-span-1">
                <label htmlFor="phone" className="block text-sm font-medium text-slate-100 mb-2">
                  Telefon
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+48 601 782 517"
                  className="w-full px-4 py-3.5 rounded-xl bg-white/95 border border-white/25 text-slate-800 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-slate-100 mb-2">
                Temat
              </label>
              <select
                id="subject"
                name="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-white/95 border border-white/25 text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all appearance-none cursor-pointer"
              >
                <option value="Zapytanie ogólne">Zapytanie ogólne</option>
                <option value="Kupno nieruchomości">Kupno nieruchomości</option>
                <option value="Współpraca deweloperska">Współpraca deweloperska</option>
                <option value="Wycena nieruchomości">Wycena nieruchomości</option>
                <option value="Inne">Inne</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-100 mb-2">
                Wiadomość
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Opisz swoje potrzeby..."
                className="w-full px-4 py-3.5 rounded-xl bg-white/95 border border-white/25 text-slate-800 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all resize-none min-h-[120px]"
              />
            </div>
            {status === "success" && (
              <p className="text-emerald-300 text-sm font-medium" role="status">
                Dziękujemy — wiadomość została wysłana.
              </p>
            )}
            {status === "error" && errorText && (
              <p className="text-rose-300 text-sm font-medium" role="alert">
                {errorText}
              </p>
            )}
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full sm:w-auto min-w-[200px] bg-primary hover:bg-primary-dark disabled:opacity-60 disabled:pointer-events-none text-white py-4 px-10 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-primary/35 active:scale-[0.98]"
            >
              {status === "sending" ? "Wysyłanie…" : "Wyślij wiadomość"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
