import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "PP Estate | Nieruchomości od Deweloperów",
  description:
    "PP Estate - Twój zaufany pośrednik nieruchomości. Domy, mieszkania, działki i obiekty przemysłowe bezpośrednio od deweloperów. Najlepsze oferty w jednym miejscu.",
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
      <body className="min-h-full flex flex-col overflow-hidden">
        <Navbar />
        {children}
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white px-6"
          role="dialog"
          aria-modal="true"
          aria-label="Strona w budowie"
        >
          <div className="flex flex-col items-center text-center">
            <div className="mb-5 h-24 w-24 overflow-hidden rounded-full border border-slate-200 shadow-sm">
              <Image
                src="/hero-logo-mark.png"
                alt="PP Estate logo"
                width={96}
                height={96}
                className="h-full w-full object-contain p-3"
                priority
              />
            </div>
            <h1 className="text-2xl font-extrabold tracking-[0.16em] text-[#0d3479]">
              PP ESTATE
            </h1>
            <p className="mt-3 text-base font-medium text-slate-700">Strona w budowie</p>
          </div>
        </div>
      </body>
    </html>
  );
}
