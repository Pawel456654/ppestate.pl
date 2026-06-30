import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import CvConsentClause from "@/components/CvConsentClause";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Kariera | Doradca ds. nieruchomości | PP Estate",
  description:
    "Dołącz do zespołu PP Estate. Szukamy doradcy ds. nieruchomości. Sprawdź, co oferujemy i wyślij swoje CV na biuro@ppestate.pl lub przez formularz.",
  alternates: {
    canonical: "/kariera",
  },
};

const BENEFITS = [
  {
    title: "Atrakcyjne wynagrodzenie",
    description:
      "Podstawa plus wysokie, nielimitowane prowizje od realizowanych transakcji.",
  },
  {
    title: "Elastyczny czas pracy",
    description:
      "Sam planujesz swój dzień. Liczą się efekty, nie sztywne godziny w biurze.",
  },
  {
    title: "Szkolenia i wsparcie",
    description:
      "Wdrożenie od podstaw oraz stałe wsparcie doświadczonego zespołu i właściciela.",
  },
  {
    title: "Nowoczesne narzędzia",
    description:
      "System CRM, dostęp do bazy ofert i materiałów marketingowych, które ułatwiają pracę.",
  },
  {
    title: "Realne możliwości rozwoju",
    description:
      "Awans i rosnący zakres odpowiedzialności wraz z Twoimi wynikami.",
  },
  {
    title: "Przyjazna atmosfera",
    description:
      "Mały, zgrany zespół, w którym liczy się człowiek i wzajemna pomoc.",
  },
];

export default function KarieraPage() {
  return (
    <>
      <main className="relative pt-16 bg-gradient-to-b from-pastel-sky via-white to-pastel-blue/30">
        <section className="max-w-4xl mx-auto px-6 py-14 sm:py-20">
          <span className="text-primary text-sm font-semibold tracking-[0.15em] uppercase">
            Kariera
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 tracking-tight mt-3 mb-5">
            Dołącz do naszego zespołu
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
            Poszukujemy <strong>Doradcy ds. nieruchomości</strong>. Jeśli lubisz
            kontakt z ludźmi, jesteś samodzielny i chcesz zarabiać na miarę swojego
            zaangażowania, to praca dla Ciebie. Doświadczenie w branży będzie
            atutem, ale najważniejsze są chęci i otwartość na naukę.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mt-12 mb-6">
            Co oferujemy
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="p-5 bg-white/70 border border-slate-200/80 rounded-xl shadow-sm"
              >
                <h3 className="font-semibold text-slate-800 mb-1.5">
                  {benefit.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 sm:p-8 bg-white/80 border border-primary-lighter rounded-2xl shadow-sm">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-3">
              Jak aplikować?
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Wyślij swoje CV na adres{" "}
              <a
                href="mailto:biuro@ppestate.pl?subject=Rekrutacja%20-%20Doradca%20ds.%20nieruchomości"
                className="text-primary font-semibold hover:underline"
              >
                biuro@ppestate.pl
              </a>{" "}
              albo skontaktuj się z nami przez poniższy formularz, wybierając temat{" "}
              <strong>„Rekrutacja”</strong>. Odezwiemy się do Ciebie najszybciej,
              jak to możliwe.
            </p>
          </div>

          <CvConsentClause />
        </section>

        <ContactForm
          presetSubject="Rekrutacja"
          introTitle="Aplikuj przez formularz"
          introDescription="Zostaw swoje dane, a my skontaktujemy się w sprawie rekrutacji"
          successMessage="Dziękujemy. Wiadomość została wysłana."
        />
      </main>
      <Footer />
    </>
  );
}
