"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandMark from "@/components/BrandMark";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isInnerPage = pathname !== "/";
  const toHomeSection = (hash: string) => (isInnerPage ? `/${hash}` : hash);
  const navItems = [
    { label: "Oferta", href: "/oferty" },
    { label: "Najnowsze", href: toHomeSection("#oferty") },
    { label: "O nas", href: toHomeSection("#o-nas") },
    { label: "Kontakt", href: toHomeSection("#kontakt") },
    { label: "Kariera", href: "/kariera" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-24 transition-all duration-500 ${
        menuOpen
          ? "bg-[#0d3479] shadow-none md:bg-white/90 md:backdrop-blur-md md:shadow-sm"
          : "bg-white/90 backdrop-blur-md shadow-sm"
      }`}
    >
      <div className="w-full mx-auto h-full px-10 lg:px-14 flex items-stretch justify-between">
        <Link href="/" className="flex items-center self-stretch">
          <BrandMark variant={menuOpen ? "menu" : "default"} />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={`${item.label}-${item.href}`}
              href={item.href}
              className="text-sm font-medium text-slate-700 transition-colors duration-300 hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="tel:+48601782517"
            className="bg-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25"
          >
            Zadzwoń
          </a>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden p-2 transition-colors ${
            menuOpen ? "text-white" : "text-slate-700"
          }`}
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#0d3479] animate-fade-in">
          <div className="flex h-full flex-col justify-center gap-5 px-8 pt-24 pb-8">
            {navItems.map((item) => (
              <Link
                key={`mobile-${item.label}-${item.href}`}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-white text-2xl font-semibold tracking-wide py-1 transition-colors hover:text-blue-200"
              >
                {item.label}
              </Link>
            ))}
            <a
              href="tel:+48601782517"
              onClick={() => setMenuOpen(false)}
              className="mt-4 inline-flex w-fit items-center rounded-full border border-white/40 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              Zadzwoń
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
