"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  COOKIE_CONSENT_EVENT,
  grantCookieConsent,
  readCookieConsent,
} from "@/lib/cookie-consent";

type CookieConsentContextValue = {
  hasConsent: boolean | null;
  acceptCookies: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null
);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);

  useEffect(() => {
    setHasConsent(readCookieConsent());

    const syncConsent = () => setHasConsent(readCookieConsent());
    window.addEventListener(COOKIE_CONSENT_EVENT, syncConsent);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, syncConsent);
  }, []);

  const acceptCookies = useCallback(() => {
    grantCookieConsent();
    setHasConsent(true);
  }, []);

  return (
    <CookieConsentContext.Provider value={{ hasConsent, acceptCookies }}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }
  return context;
}
