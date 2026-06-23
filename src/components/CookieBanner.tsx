"use client";

import Link from "next/link";
import { useCookieConsent } from "@/components/CookieConsentProvider";

export default function CookieBanner() {
  const { hasConsent, acceptCookies } = useCookieConsent();

  if (hasConsent !== false) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Informacja o plikach cookies"
      className="fixed inset-x-0 bottom-0 z-50 animate-slide-in-up"
    >
      <div className="border-t border-slate-200/80 bg-white/95 backdrop-blur-md shadow-[0_-8px_30px_rgba(15,23,42,0.12)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
          <p className="text-sm leading-relaxed text-slate-600 sm:max-w-3xl">
            Mapy Google wymagają plików cookies. Ładujemy je dopiero po Twojej zgodzie.{" "}
            <Link
              href="/polityka-cookies"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-dark"
            >
              Polityka cookies
            </Link>
            .
          </p>
          <button
            type="button"
            onClick={acceptCookies}
            className="shrink-0 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
          >
            Akceptuję
          </button>
        </div>
      </div>
    </div>
  );
}
