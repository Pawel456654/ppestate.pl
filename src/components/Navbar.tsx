"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isInnerPage = pathname !== "/";
  const solidNavbar = scrolled || isInnerPage;
  const toHomeSection = (hash: string) => (isInnerPage ? `/${hash}` : hash);
  const navItems = [
    { label: "Oferta", href: "/oferty" },
    { label: "Najnowsze", href: toHomeSection("#oferty") },
    { label: "O nas", href: toHomeSection("#o-nas") },
    { label: "Kontakt", href: toHomeSection("#kontakt") },
    { label: "Kariera", href: "/kariera" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        solidNavbar
          ? "bg-white/90 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div
            className={`text-2xl font-bold tracking-tight transition-colors duration-500 ${
              solidNavbar ? "text-primary" : "text-white"
            }`}
          >
            Paweł
            <span className="font-light"> Development</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={`${item.label}-${item.href}`}
              href={item.href}
              className={`text-sm font-medium transition-colors duration-300 hover:text-primary ${
                solidNavbar ? "text-slate-700" : "text-white/90"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href="tel:+48987654321"
            className="bg-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25"
          >
            Zadzwoń
          </a>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden p-2 transition-colors ${
            solidNavbar ? "text-slate-700" : "text-white"
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
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-slate-100 animate-fade-in">
          <div className="px-6 py-4 flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={`mobile-${item.label}-${item.href}`}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-slate-700 text-sm font-medium py-2 hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
