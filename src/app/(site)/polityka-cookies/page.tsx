import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Polityka cookies | PP Estate",
  description:
    "Informacje o plikach cookies i technologiach pamięci lokalnej stosowanych na stronie ppestate.pl.",
  alternates: {
    canonical: "/polityka-cookies",
  },
};

export default function CookiePolicyPage() {
  return (
    <>
      <main className="relative pt-16 min-h-[55vh] bg-gradient-to-b from-pastel-sky via-white to-pastel-blue/30">
        <div className="max-w-3xl mx-auto px-6 py-14 sm:py-20">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight mb-3">
            Polityka cookies
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            Data ostatniej aktualizacji: 23 czerwca 2026 r.
          </p>

          <div className="space-y-8 text-slate-600 leading-relaxed text-sm sm:text-base">
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                1. Czym są pliki cookies?
              </h2>
              <p>
                Pliki cookies (ciasteczka) to niewielkie pliki tekstowe zapisywane w urządzeniu
                użytkownika (komputerze, smartfonie, tablecie) podczas korzystania ze strony
                internetowej. Cookies pozwalają m.in. na prawidłowe działanie niektórych
                funkcji serwisu, zapamiętanie ustawień użytkownika lub zapewnienie bezpieczeństwa.
              </p>
              <p>
                Oprócz plików cookies strony internetowe mogą korzystać z podobnych technologii,
                takich jak pamięć lokalna przeglądarki (localStorage). Informujemy o nich w
                dalszej części niniejszego dokumentu.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                2. Administrator
              </h2>
              <p>Administratorem strony internetowej ppestate.pl jest:</p>
              <div className="p-5 bg-white/60 border border-slate-200/80 rounded-xl space-y-1.5 text-slate-700 text-sm shadow-sm">
                <p className="font-semibold text-base text-slate-800">
                  PP ESTATE Spółka z ograniczoną odpowiedzialnością
                </p>
                <p>Aleja Kasztanowa 3A-5</p>
                <p>53-125 Wrocław</p>
                <div className="pt-2.5 border-t border-slate-200/60 mt-2.5 text-sm">
                  <p>
                    <span className="font-medium text-slate-600">E-mail: </span>
                    <a
                      href="mailto:biuro@ppestate.pl"
                      className="text-primary hover:underline font-medium"
                    >
                      biuro@ppestate.pl
                    </a>
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                3. Jakie pliki cookies stosujemy?
              </h2>
              <p>
                Na stronie publicznej ppestate.pl <strong>nie stosujemy plików cookies
                analitycznych, marketingowych ani reklamowych</strong>. Nie korzystamy m.in. z
                Google Analytics, narzędzi remarketingowych ani pikseli śledzących mediów
                społecznościowych.
              </p>
              <p>
                Jedynym rodzajem plików cookies wymagającym zgody użytkownika na stronie
                publicznej są pliki cookies powiązane z osadzoną mapą Google Maps, wyświetlaną
                na stronach szczegółowych ofert nieruchomości.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                4. Szczegółowy opis
              </h2>

              <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white/60 shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80">
                      <th className="px-4 py-3 font-semibold text-slate-800">Rodzaj</th>
                      <th className="px-4 py-3 font-semibold text-slate-800">Cel</th>
                      <th className="px-4 py-3 font-semibold text-slate-800">Podstawa</th>
                      <th className="px-4 py-3 font-semibold text-slate-800">Czas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/80 text-slate-600">
                    <tr>
                      <td className="px-4 py-3 align-top font-medium text-slate-700">
                        Google Maps
                        <span className="mt-1 block text-xs font-normal text-slate-500">
                          (po wyrażeniu zgody)
                        </span>
                      </td>
                      <td className="px-4 py-3 align-top">
                        Wyświetlenie interaktywnej mapy lokalizacji nieruchomości. Po
                        załadowaniu mapy Google LLC może zapisywać pliki cookies oraz
                        przetwarzać dane techniczne, m.in. adres IP.
                      </td>
                      <td className="px-4 py-3 align-top">Zgoda użytkownika</td>
                      <td className="px-4 py-3 align-top">
                        Zgodnie z polityką Google
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 align-top font-medium text-slate-700">
                        Pamięć lokalna
                        <span className="mt-1 block text-xs font-normal text-slate-500">
                          (localStorage)
                        </span>
                      </td>
                      <td className="px-4 py-3 align-top">
                        Zapamiętanie informacji, czy użytkownik wyraził zgodę na ładowanie
                        map Google. Nie jest to plik cookie, lecz dane zapisane lokalnie w
                        przeglądarce.
                      </td>
                      <td className="px-4 py-3 align-top">
                        Prawnie uzasadniony interes — zapamiętanie decyzji użytkownika
                      </td>
                      <td className="px-4 py-3 align-top">
                        Do momentu usunięcia danych w przeglądarce
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-sm text-slate-500">
                Mapy Google ładujemy dopiero po kliknięciu przycisku „Akceptuję” na pasku
                informacyjnym u dołu strony. Bez zgody iframe mapy nie jest ładowany, a
                pliki cookies Google nie są zapisywane.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                5. Panel administracyjny
              </h2>
              <p>
                Osobna, niedostępna publicznie część serwisu — panel administracyjny pod
                adresem /panel-admin — wykorzystuje plik cookie sesji (
                <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">pp_admin_session</code>
                ) wyłącznie w celu utrzymania zalogowania administratora. Cookie to nie dotyczy
                zwykłych odwiedzających strony.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                6. Podstawa prawna
              </h2>
              <p>
                Pliki cookies Google Maps są stosowane na podstawie zgody użytkownika, zgodnie
                z art. 6 ust. 1 lit. a RODO oraz przepisami Prawa telekomunikacyjnego
                dotyczącymi przechowywania informacji w urządzeniu końcowym.
              </p>
              <p>
                Zapisanie decyzji użytkownika w pamięci lokalnej przeglądarki odbywa się w celu
                realizacji prawnie uzasadnionego interesu Administratora (art. 6 ust. 1 lit. f
                RODO) polegającego na respektowaniu wyboru użytkownika i unikaniu wielokrotnego
                wyświetlania paska zgody.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                7. Jak wyrazić lub wycofać zgodę?
              </h2>
              <p>
                Zgodę na pliki cookies Google Maps można wyrazić, klikając „Akceptuję” na
                pasku informacyjnym wyświetlanym u dołu strony.
              </p>
              <p>
                Zgodę można wycofać w dowolnym momencie poprzez usunięcie danych witryny
                ppestate.pl w ustawieniach przeglądarki (w tym plików cookies oraz danych
                lokalnych / localStorage). Po wyczyszczeniu danych mapy nie będą ładowane
                do momentu ponownej akceptacji.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                8. Zarządzanie plikami cookies w przeglądarce
              </h2>
              <p>
                Większość przeglądarek internetowych domyślnie akceptuje pliki cookies.
                Użytkownik może w każdej chwili zmienić ustawienia przeglądarki, aby
                blokować cookies, usuwać je lub otrzymywać powiadomienia przed ich zapisaniem.
              </p>
              <p>
                Instrukcje zarządzania cookies znajdują się w dokumentacji lub ustawieniach
                używanej przeglądarki, np. Chrome, Firefox, Safari lub Edge. Ograniczenie
                stosowania cookies może wpłynąć na działanie niektórych funkcji strony, w
                tym wyświetlania map.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                9. Google LLC
              </h2>
              <p>
                Po załadowaniu mapy Google Maps dane mogą być przetwarzane przez Google LLC
                jako odrębny administrator. Szczegółowe informacje znajdują się w dokumentach
                Google:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    Polityka prywatności Google
                  </a>
                </li>
                <li>
                  <a
                    href="https://policies.google.com/technologies/cookies"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    Jak Google wykorzystuje pliki cookies
                  </a>
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                10. Powiązane dokumenty
              </h2>
              <p>
                Więcej informacji o przetwarzaniu danych osobowych znajduje się w{" "}
                <Link href="/polityka-prywatnosci" className="text-primary hover:underline font-medium">
                  Polityce prywatności
                </Link>{" "}
                oraz{" "}
                <Link href="/rodo" className="text-primary hover:underline font-medium">
                  obowiązku informacyjnym (RODO)
                </Link>
                .
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                11. Kontakt
              </h2>
              <p>
                W sprawach związanych z plikami cookies można kontaktować się z Administratorem
                pod adresem{" "}
                <a
                  href="mailto:biuro@ppestate.pl"
                  className="text-primary hover:underline font-medium"
                >
                  biuro@ppestate.pl
                </a>
                .
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                12. Zmiany Polityki cookies
              </h2>
              <p>
                Administrator zastrzega sobie prawo do wprowadzania zmian w niniejszej Polityce
                cookies, w szczególności w przypadku zmian przepisów prawa, wdrożenia nowych
                funkcji strony lub zmiany sposobu korzystania z plików cookies. Aktualna wersja
                dokumentu jest zawsze dostępna pod adresem ppestate.pl/polityka-cookies.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
