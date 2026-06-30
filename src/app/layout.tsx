import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ppestate.pl"),
  title: "PP Estate | Pośrednik nieruchomości we Wrocławiu",
  description:
    "Jeśli szukasz nieruchomości na sprzedaż, kupno lub wynajem, to odpowiednie miejsce.",
  keywords:
    "nieruchomości, deweloper, domy, mieszkania, działki, przemysłowe, pośrednik, PP Estate",
  icons: {
    icon: "/hero-logo-mark.png",
    shortcut: "/hero-logo-mark.png",
    apple: "/hero-logo-mark.png",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
