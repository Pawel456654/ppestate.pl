import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BrandMark from "@/components/BrandMark";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "PP Estate | Pośrednik nieruchomości we Wrocławiu",
  description:
    "Jeśli szukasz nieruchomości na sprzedaż, kupno lub wynajem — to odpowiednie miejsce.",
  keywords:
    "nieruchomości, deweloper, domy, mieszkania, działki, przemysłowe, pośrednik, PP Estate",
  icons: {
    icon: "/hero-logo-mark.png",
    shortcut: "/hero-logo-mark.png",
    apple: "/hero-logo-mark.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col overflow-hidden">
        <Navbar />
        {children}
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white px-6"
          role="dialog"
          aria-modal="true"
          aria-label="Strona w budowie"
        >
          <div className="flex flex-col items-center text-center">
            <BrandMark logoCircle stacked />
            <p className="mt-8 text-xl font-medium text-slate-700 md:text-2xl">Strona w budowie</p>
          </div>
        </div>
      </body>
    </html>
  );
}
