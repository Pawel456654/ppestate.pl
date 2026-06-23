import Navbar from "@/components/Navbar";
import CookieBanner from "@/components/CookieBanner";
import { CookieConsentProvider } from "@/components/CookieConsentProvider";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CookieConsentProvider>
      <Navbar />
      {children}
      <CookieBanner />
    </CookieConsentProvider>
  );
}
