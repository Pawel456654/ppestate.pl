import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Polityka prywatności | PP Estate",
  description:
    "Informacje o przetwarzaniu danych osobowych przez PP Estate — zasady, cele i prawa osób, których dane dotyczą.",
  alternates: {
    canonical: "/polityka-prywatnosci",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <main className="relative pt-16 min-h-[55vh] bg-gradient-to-b from-pastel-sky via-white to-pastel-blue/30">
        <div className="max-w-3xl mx-auto px-6 py-14 sm:py-20">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight mb-3">
            Polityka prywatności
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            Data ostatniej aktualizacji: 19 czerwca 2026 r.
          </p>

          <div className="space-y-8 text-slate-600 leading-relaxed text-sm sm:text-base">
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                1. Informacje ogólne
              </h2>
              <p>
                Niniejsza Polityka Prywatności określa zasady przetwarzania danych osobowych użytkowników strony internetowej ppestate.pl oraz zasady korzystania z tej strony.
              </p>
              <p>
                Administrator dokłada szczególnej staranności w celu ochrony prywatności użytkowników oraz zapewnienia zgodności przetwarzania danych osobowych z obowiązującymi przepisami prawa, w szczególności z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                2. Administrator danych osobowych
              </h2>
              <p>Administratorem danych osobowych jest:</p>
              <div className="p-5 bg-white/60 border border-slate-200/80 rounded-xl space-y-1.5 text-slate-700 text-sm shadow-sm">
                <p className="font-semibold text-base text-slate-800">PP ESTATE Spółka z ograniczoną odpowiedzialnością</p>
                <p>Aleja Kasztanowa 3A-5</p>
                <p>53-125 Wrocław</p>
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4">
                  <p><span className="font-medium text-slate-600">KRS:</span> 0001241544</p>
                  <p><span className="font-medium text-slate-600">NIP:</span> 8993059160</p>
                  <p><span className="font-medium text-slate-600">REGON:</span> 544778592</p>
                </div>
                <div className="pt-2.5 border-t border-slate-200/60 mt-2.5 flex flex-col sm:flex-row gap-y-1 gap-x-6 text-sm">
                  <p>
                    <span className="font-medium text-slate-600">E-mail: </span>
                    <a href="mailto:biuro@ppestate.pl" className="text-primary hover:underline font-medium">biuro@ppestate.pl</a>
                  </p>
                  <p>
                    <span className="font-medium text-slate-600">Telefon: </span>
                    <a href="tel:+48601782517" className="text-primary hover:underline font-medium">601 782 517</a>
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-500 pt-1">
                W sprawach związanych z ochroną danych osobowych można kontaktować się pod adresem e-mail:{" "}
                <a href="mailto:biuro@ppestate.pl" className="text-primary hover:underline font-medium">biuro@ppestate.pl</a>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                3. Zakres przetwarzanych danych
              </h2>
              <p>
                Administrator może przetwarzać następujące dane osobowe przekazywane za pośrednictwem formularza kontaktowego:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>imię,</li>
                <li>nazwisko,</li>
                <li>adres e-mail,</li>
                <li>numer telefonu,</li>
                <li>temat wiadomości,</li>
                <li>treść wiadomości,</li>
                <li>inne dane dobrowolnie podane przez użytkownika w treści wiadomości.</li>
              </ul>
              <p className="pt-2">
                Dodatkowo podczas korzystania ze strony mogą być przetwarzane dane techniczne, takie jak:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>adres IP,</li>
                <li>data i godzina odwiedzin,</li>
                <li>informacje o urządzeniu i przeglądarce internetowej,</li>
                <li>dane związane z korzystaniem z osadzonych usług zewnętrznych.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                4. Cele i podstawy prawne przetwarzania danych
              </h2>
              <p>Dane osobowe są przetwarzane w następujących celach:</p>
              
              <div className="space-y-5 pl-4 border-l-2 border-primary/20">
                <div className="space-y-1">
                  <h3 className="font-semibold text-slate-800 text-base">Kontakt i obsługa zapytań</h3>
                  <p>W celu udzielenia odpowiedzi na wiadomość przesłaną za pośrednictwem formularza kontaktowego.</p>
                  <p className="text-xs text-slate-500 font-medium pt-0.5">
                    Podstawa prawna: art. 6 ust. 1 lit. a RODO – zgoda użytkownika; art. 6 ust. 1 lit. f RODO – prawnie uzasadniony interes administratora polegający na komunikacji z użytkownikami.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="font-semibold text-slate-800 text-base">Świadczenie usług pośrednictwa nieruchomości</h3>
                  <p>W celu zawarcia i wykonania umowy pośrednictwa lub podjęcia działań zmierzających do jej zawarcia.</p>
                  <p className="text-xs text-slate-500 font-medium pt-0.5">
                    Podstawa prawna: art. 6 ust. 1 lit. b RODO.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="font-semibold text-slate-800 text-base">Realizacja obowiązków prawnych</h3>
                  <p>W szczególności w zakresie prowadzenia dokumentacji księgowej, rozliczeń podatkowych, przeciwdziałania praniu pieniędzy i finansowaniu terroryzmu, realizacji obowiązków wynikających z przepisów prawa.</p>
                  <p className="text-xs text-slate-500 font-medium pt-0.5">
                    Podstawa prawna: art. 6 ust. 1 lit. c RODO.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="font-semibold text-slate-800 text-base">Ustalenie, dochodzenie lub obrona roszczeń</h3>
                  <p className="text-xs text-slate-500 font-medium pt-0.5">
                    Podstawa prawna: art. 6 ust. 1 lit. f RODO.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="font-semibold text-slate-800 text-base">Marketing własnych usług</h3>
                  <p>W zakresie dozwolonym przez obowiązujące przepisy prawa.</p>
                  <p className="text-xs text-slate-500 font-medium pt-0.5">
                    Podstawa prawna: art. 6 ust. 1 lit. f RODO oraz art. 6 ust. 1 lit. a RODO – w przypadku działań wymagających zgody.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                5. Formularz kontaktowy
              </h2>
              <p>
                Wysłanie formularza kontaktowego jest dobrowolne, jednak niezbędne do otrzymania odpowiedzi od Administratora.
              </p>
              <p>Po przesłaniu formularza:</p>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-600">
                <li>Dane są przekazywane z serwisu ppestate.pl do systemu automatyzacji Make.com.</li>
                <li>System Make.com wysyła automatyczne potwierdzenie przyjęcia zgłoszenia.</li>
                <li>Następnie wiadomość trafia na adres e-mail Administratora obsługiwany przez dostawcę poczty elektronicznej.</li>
              </ol>
              <p className="text-sm text-slate-500 mt-2">
                Dane przetwarzane są wyłącznie w celu obsługi zgłoszenia oraz prowadzenia dalszej komunikacji z użytkownikiem.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                6. Odbiorcy danych
              </h2>
              <p>
                Dane osobowe mogą być przekazywane podmiotom świadczącym usługi na rzecz Administratora, w szczególności:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>dostawcom usług hostingowych,</li>
                <li>dostawcom usług poczty elektronicznej,</li>
                <li>dostawcom systemów informatycznych,</li>
                <li>dostawcom usług automatyzacji procesów,</li>
                <li>dostawcom oprogramowania wspierającego działalność biura nieruchomości,</li>
                <li>firmom księgowym,</li>
                <li>kancelariom prawnym,</li>
                <li>podmiotom współpracującym przy realizacji usług pośrednictwa.</li>
              </ul>
              <p className="text-sm text-slate-500">
                Przekazanie danych odbywa się wyłącznie w zakresie niezbędnym do realizacji określonych celów oraz na podstawie odpowiednich umów i zabezpieczeń prawnych.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                7. Wykorzystywane podmioty przetwarzające
              </h2>
              <p>
                Administrator korzysta między innymi z usług następujących dostawców:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>Netlify</strong> – hosting strony internetowej,</li>
                <li><strong>Make.com</strong> – obsługa automatyzacji formularza kontaktowego,</li>
                <li><strong>Hostinger</strong> – obsługa poczty elektronicznej,</li>
                <li><strong>EstiCRM</strong> – system wspomagający obsługę działalności biura nieruchomości,</li>
                <li><strong>Google</strong> – usługi związane z funkcjonowaniem strony oraz wyświetlaniem map.</li>
              </ul>
              <p className="text-sm text-slate-500">
                Zakres przetwarzania danych przez wskazane podmioty zależy od świadczonych usług.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                8. Przekazywanie danych poza Europejski Obszar Gospodarczy
              </h2>
              <p>
                Niektóre podmioty współpracujące z Administratorem mogą przechowywać dane poza Europejskim Obszarem Gospodarczym.
              </p>
              <p>
                Dotyczy to w szczególności usług świadczonych przez Google oraz innych dostawców infrastruktury informatycznej działających globalnie.
              </p>
              <p>
                W takich przypadkach dane przekazywane są wyłącznie przy zastosowaniu odpowiednich zabezpieczeń przewidzianych przez RODO, w szczególności:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>decyzji Komisji Europejskiej stwierdzających odpowiedni stopień ochrony,</li>
                <li>standardowych klauzul umownych,</li>
                <li>innych mechanizmów przewidzianych przez obowiązujące przepisy.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                9. Google Maps
              </h2>
              <p>
                Na stronie mogą być wyświetlane mapy dostarczane przez Google Maps.
              </p>
              <p>
                Po załadowaniu mapy Google może otrzymywać informacje techniczne dotyczące użytkownika, w tym adres IP oraz dane związane z korzystaniem z usługi.
              </p>
              <p>
                Szczegółowe informacje dotyczące przetwarzania danych przez Google znajdują się pod adresem:{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                  https://policies.google.com/privacy
                </a>.
              </p>
              <p>
                Więcej informacji o plikach cookies stosowanych na stronie znajduje się w{" "}
                <Link href="/polityka-cookies" className="text-primary hover:underline font-medium">
                  Polityce cookies
                </Link>
                .
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                10. Okres przechowywania danych
              </h2>
              <p>
                Dane związane z obsługą formularza kontaktowego przechowywane są przez okres niezbędny do prowadzenia korespondencji oraz realizacji celów, dla których zostały zebrane.
              </p>
              <p>
                Dane związane z zawartymi umowami pośrednictwa przechowywane są przez okres 6 lat od zakończenia współpracy lub wygaśnięcia umowy.
              </p>
              <p>
                Dane przetwarzane na podstawie zgody przechowywane są do momentu jej wycofania.
              </p>
              <p>
                Dane przetwarzane na podstawie obowiązków prawnych przechowywane są przez okres wymagany przepisami prawa.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                11. Prawa osób, których dane dotyczą
              </h2>
              <p>Każdej osobie przysługuje prawo do:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>dostępu do swoich danych,</li>
                <li>sprostowania danych,</li>
                <li>usunięcia danych,</li>
                <li>ograniczenia przetwarzania,</li>
                <li>przenoszenia danych,</li>
                <li>wniesienia sprzeciwu wobec przetwarzania,</li>
                <li>cofnięcia zgody w dowolnym momencie, jeśli przetwarzanie odbywa się na jej podstawie.</li>
              </ul>
              <p className="text-sm text-slate-500">
                Cofnięcie zgody nie wpływa na zgodność z prawem przetwarzania dokonanego przed jej cofnięciem.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                12. Prawo wniesienia skargi
              </h2>
              <p>Osobie, której dane dotyczą, przysługuje prawo wniesienia skargi do:</p>
              <div className="p-4 bg-white/60 border border-slate-200/80 rounded-xl space-y-1 text-slate-700 text-sm shadow-sm">
                <p className="font-semibold text-slate-800">Prezes Urzędu Ochrony Danych Osobowych</p>
                <p>ul. Stawki 2</p>
                <p>00-193 Warszawa</p>
              </div>
              <p className="text-sm text-slate-500 mt-2">
                jeżeli uzna, że przetwarzanie danych osobowych narusza przepisy prawa.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                13. Dobrowolność podania danych
              </h2>
              <p>
                Podanie danych osobowych jest dobrowolne, jednak może być niezbędne do:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>uzyskania odpowiedzi na przesłane zapytanie,</li>
                <li>zawarcia umowy,</li>
                <li>realizacji usług świadczonych przez Administratora.</li>
              </ul>
              <p className="text-sm text-slate-500">
                Brak podania danych może uniemożliwić realizację powyższych celów.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                14. Profilowanie
              </h2>
              <p>
                Administrator nie stosuje zautomatyzowanego podejmowania decyzji ani profilowania w rozumieniu RODO.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                15. Zmiany Polityki Prywatności
              </h2>
              <p>
                Administrator zastrzega sobie prawo do wprowadzania zmian w niniejszej Polityce Prywatności, w szczególności w przypadku zmian przepisów prawa, zmian technologicznych lub zmian sposobu funkcjonowania strony internetowej.
              </p>
              <p>
                Aktualna wersja Polityki Prywatności jest zawsze publikowana na stronie internetowej ppestate.pl.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
