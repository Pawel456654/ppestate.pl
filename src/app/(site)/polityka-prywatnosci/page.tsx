import type { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Polityka prywatności | PP Estate",
  description:
    "Informacje o przetwarzaniu danych osobowych przez PP Estate — zasady, cele i prawa osób, których dane dotyczą.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <main className="relative pt-16 min-h-[55vh] bg-gradient-to-b from-pastel-sky via-white to-pastel-blue/30">
        <div className="max-w-3xl mx-auto px-6 py-14 sm:py-20">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">
            Polityka prywatności
          </h1>
        </div>
      </main>
      <Footer />
    </>
  );
}
