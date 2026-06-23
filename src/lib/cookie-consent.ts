export const COOKIE_CONSENT_KEY = "cookie-consent";
export const COOKIE_CONSENT_EVENT = "cookie-consent-change";

export function readCookieConsent(): boolean {
  if (typeof window === "undefined") return false;
  if (localStorage.getItem(COOKIE_CONSENT_KEY) === "true") return true;
  if (localStorage.getItem("google-maps-consent") === "true") {
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    localStorage.removeItem("google-maps-consent");
    return true;
  }
  return false;
}

export function grantCookieConsent(): void {
  localStorage.setItem(COOKIE_CONSENT_KEY, "true");
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT));
}
