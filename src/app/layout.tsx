import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Paweł Development | Nieruchomości od Deweloperów",
  description:
    "Paweł Development - Twój zaufany pośrednik nieruchomości. Domy, mieszkania, działki i obiekty przemysłowe bezpośrednio od deweloperów. Najlepsze oferty w jednym miejscu.",
  keywords:
    "nieruchomości, deweloper, domy, mieszkania, działki, przemysłowe, pośrednik, Paweł Development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
