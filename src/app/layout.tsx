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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0d3479] px-6 text-center">
          <div className="flex flex-col items-center gap-5">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-lg shadow-black/20 sm:h-32 sm:w-32">
              <Image
                src="/hero-logo-mark.png"
                alt="PP Estate logo"
                width={110}
                height={110}
                className="h-20 w-20 sm:h-24 sm:w-24 object-contain"
                priority
              />
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold tracking-[0.16em] text-white">
                PP <span className="text-blue-300">ESTATE</span>
              </p>
              <p className="mt-2 text-sm sm:text-base font-semibold uppercase tracking-[0.32em] text-blue-100">
                Strona w budowie
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
