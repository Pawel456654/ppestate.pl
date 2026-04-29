"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

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
    <nav className="fixed top-0 left-0 right-0 z-50 h-24 bg-white/90 backdrop-blur-md shadow-sm transition-all duration-500">
      <div className="w-full mx-auto h-full px-10 lg:px-14 flex items-stretch justify-between">
        <Link href="/" className="flex items-center self-stretch">
          <div className="relative h-full w-[clamp(180px,18vw,280px)]">
            <Image
              src="/logo-duze.png"
              alt="PP Estate logo"
              fill
              sizes="(max-width: 768px) 180px, (max-width: 1280px) 220px, 280px"
              className="object-contain object-left"
              preload
            />
          </div>
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
          className="md:hidden p-2 text-slate-700 transition-colors"
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
