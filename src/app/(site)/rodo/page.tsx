import type { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Obowiązek informacyjny (RODO) | PP Estate",
  description:
    "Klauzula informacyjna dotycząca przetwarzania danych osobowych przez PP Estate Sp. z o.o. zgodnie z RODO.",
  alternates: {
    canonical: "/rodo",
  },
};

export default function RodoPage() {
  return (
    <>
      <main className="relative pt-16 min-h-[55vh] bg-gradient-to-b from-pastel-sky via-white to-pastel-blue/30">
        <div className="max-w-3xl mx-auto px-6 py-14 sm:py-20">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight mb-3">
            Obowiązek informacyjny (RODO)
          </h1>
          <p className="text-sm text-slate-500 mb-8 font-medium">
            Informacja o przetwarzaniu danych osobowych
          </p>

          <div className="space-y-8 text-slate-600 leading-relaxed text-sm sm:text-base">
            <p className="italic text-slate-500 text-sm">
              Na podstawie art. 13 ust. 1 i ust. 2 rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z 27.4.2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych (...), informuję, że:
            </p>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                Administrator danych osobowych
              </h2>
              <p>Administratorem Państwa danych osobowych jest:</p>
              <div className="p-5 bg-white/60 border border-slate-200/80 rounded-xl space-y-1.5 text-slate-700 text-sm shadow-sm">
                <p className="font-semibold text-base text-slate-800">PP ESTATE SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ</p>
                <p>z siedzibą we Wrocławiu 53-125, Aleja Kasztanowa 3A-5</p>
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
                zwany dalej <strong>biurem nieruchomości</strong>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                Cele i podstawy prawne przetwarzania danych
              </h2>
              <p>Przetwarzanie danych osobowych odbywać się będzie:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>w celu wykonania umowy pośrednictwa wskazanej w nagłówku,</li>
                <li>
                  w celu prawidłowego wykonywania usług związanych z prowadzoną przez Biuro działalnością gospodarczą, na podstawie zawartych umów powierzenia przetwarzania danych osobowych, co jest realizacją naszego prawnie uzasadnionego interesu,
                </li>
                <li>
                  w celach archiwalnych dla zabezpieczenia informacji na wypadek prawnej potrzeby wykazania faktów, w celu ewentualnego ustalenia, dochodzenia lub obrony przed roszczeniami, co jest realizacją naszego prawnie uzasadnionego interesu,
                </li>
                <li>
                  w celach marketingowych Biura, co jest realizacją naszego prawnie uzasadnionego interesu (marketing bezpośredni), jak również na podstawie Państwa zgody;
                </li>
                <li>
                  w celu umożliwienia przesyłania ofert handlowych na adres e-mail lub za pośrednictwem rozmowy telefonicznej, sms - na podstawie uzyskanej zgody;
                </li>
                <li>
                  w celu przekazania podmiotom współpracującym - na podstawie uzyskanej zgody;
                </li>
                <li>
                  w celu wypełnienia prawnych obowiązków ciążących na administratorze, w tym w celu prowadzenia rachunkowości oraz wynikających z ustawy o przeciwdziałaniu praniu pieniędzy oraz finansowaniu terroryzmu z dnia 1 marca 2018 r. (Dz.U. z 2018 r. poz. 723).
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                Okres przechowywania danych osobowych
              </h2>
              <ul className="space-y-2">
                <li>
                  Państwa dane osobowe wynikające z umowy pośrednictwa będą przetwarzane przez okres, w którym mogą ujawnić się roszczenia związane z tą umową, czyli przez <strong>6 lat od wygaśnięcia umowy pośrednictwa</strong> wskazanej w nagłówku.
                </li>
                <li>
                  Dane przetwarzane dla potrzeb marketingu bezpośredniego naszych produktów i usług będą przetwarzane do czasu, aż zostanie zgłoszony sprzeciw względem ich przetwarzania.
                </li>
                <li>
                  Dane przetwarzane na podstawie udzielonej zgody będą przetwarzane do czasu, aż zgoda nie zostanie cofnięta.
                </li>
                <li>
                  Dane przetwarzane w celu wypełnienia obowiązków prawnych ciążących na administratorze będą przetwarzane przez ustawowe okresy wymagane do ich przechowywania.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                Prawo wniesienia skargi do organu nadzorczego
              </h2>
              <p>
                Przysługuje Państwu prawo wniesienia skargi do <strong>Prezesa Urzędu Ochrony Danych Osobowych</strong> (ul. Stawki 2, 00-193 Warszawa).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                Odbiorcy danych
              </h2>
              <p>
                Do Państwa danych osobowych mają dostęp firmy rachunkowe, informatyczne, dostawcy oprogramowania innych usług internetowych, firmy hostingowe, kancelarie prawne. Wszystkie dane przekazywane są zgodnie z prawem, na podstawie stosownych umów powierzenia przetwarzania danych osobowych.
              </p>
              <p>
                Państwa dane osobowe mogą zostać ujawnione innym podmiotom (naszym partnerom) wyłącznie na podstawie udzielonej przez Państwa zgody, tj: firmom pośrednictwa kredytowego, deweloperom, notariuszom.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                Przekazywanie danych poza Europejski Obszar Gospodarczy
              </h2>
              <p>
                Państwa dane osobowe mogą być przekazywane poza obszar Unii Europejskiej - do państw trzecich:
              </p>
              
              <div className="space-y-6 pt-2">
                <div className="p-4 bg-slate-50/50 border border-slate-200/60 rounded-xl space-y-3">
                  <h3 className="font-semibold text-slate-800 text-sm sm:text-base">1. Transmisja w ramach usług Google</h3>
                  <p className="text-sm">
                    W związku z faktem, że Administrator korzysta z usług firmy Google, Państwa dane mogą być przekazywane do Stanów Zjednoczonych Ameryki (USA) lub innych państw trzecich w związku z ich przechowywaniem na amerykańskich serwerach (w całości lub częściowo).
                  </p>
                  <p className="text-sm">
                    Google stosuje mechanizmy zgodności przewidziane przez RODO (certyfikaty) oraz standardowe klauzule umowne w odniesieniu do swoich usług. Będą one przekazywane wyłącznie odbiorcom, którzy gwarantują najwyższą ochronę i bezpieczeństwo danych, m.in. poprzez:
                  </p>
                  <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 space-y-1">
                    <li>współpracę z podmiotami przetwarzającymi dane osobowe w państwach, w odniesieniu do których została wydana stosowna decyzja Komisji Europejskiej,</li>
                    <li>stosowanie standardowych klauzul umownych wydanych przez Komisję,</li>
                    <li>stosowanie wiążących reguł korporacyjnych zatwierdzonych przez właściwy organ nadzorczy.</li>
                  </ul>
                  <p className="text-xs text-slate-500 pt-1">
                    Szczegółowe informacje dostępne są w treści polityki prywatności na stronie internetowej Google:{" "}
                    <a href="https://policies.google.com/privacy?hl=pl" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                      Google Privacy Policy
                    </a>{" "}
                    oraz{" "}
                    <a href="https://policies.google.com/privacy/frameworks?hl=pl" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                      Google Privacy Frameworks
                    </a>.
                  </p>
                </div>

                <div className="p-4 bg-slate-50/50 border border-slate-200/60 rounded-xl space-y-3">
                  <h3 className="font-semibold text-slate-800 text-sm sm:text-base">2. Transmisja w ramach usług Apple</h3>
                  <p className="text-sm">
                    W związku z faktem, że Administrator korzysta z usług firmy Apple, Państwa dane mogą być przekazywane do Stanów Zjednoczonych Ameryki (USA) lub innych państw trzecich w związku z ich przechowywaniem na amerykańskich serwerach (w całości lub częściowo).
                  </p>
                  <p className="text-sm">
                    Praktyki Apple w zakresie prywatności opisane w Zasadach ochrony prywatności są zgodne z globalnymi systemami transgranicznych zasad ochrony prywatności (CBPR) i uznawania zasad ochrony prywatności stosowanych przez podmioty przetwarzające dane (PRP). Więcej informacji o globalnych systemach CBPR i PRP można znaleźć na stronie forum użytkowników globalnego systemu CBPR.
                  </p>
                  <p className="text-sm">
                    Informacje o posiadanych przez Apple certyfikatach można przeczytać w katalogu zaświadczeń o zgodności z systemem CBPR. Aby dowiedzieć się więcej o zakresie uczestnictwa Apple w tych programach należy przejść do witryn:
                  </p>
                  <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 space-y-1">
                    <li>
                      <a href="https://www.globalcbpr.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                        Program transgranicznych zasad ochrony prywatności (CBPR)
                      </a>
                    </li>
                    <li>
                      <a href="https://www.globalcbpr.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                        Program uznawania zasad ochrony prywatności stosowanych przez podmioty przetwarzające dane (PRP)
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <p className="pt-2 text-sm text-slate-500">
                Poza powyższym Państwa dane osobowe nie będą przekazywane do państwa trzeciego / organizacji międzynarodowej.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                Profilowanie
              </h2>
              <p>
                Państwa dane osobowe nie będą przetwarzane w sposób zautomatyzowany, ani też nie będą profilowane.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                Prawa związane z przetwarzaniem danych osobowych
              </h2>
              <p>Przysługują Państwu następujące prawa:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>
                  <strong>wycofanie zgody</strong> – jeśli przetwarzanie wymagało zgody – prawo wycofania zgody na przetwarzanie danych osobowych poprzez wysłanie stosownego oświadczenia na nasz adres korespondencyjny lub podany w nagłówku adres e-mailowy,
                </li>
                <li>
                  <strong>sprzeciw</strong> – prawo do wniesienia sprzeciwu wobec przetwarzania Państwa danych w celach marketingu bezpośredniego albo ze względu na szczególną sytuację,
                </li>
                <li>
                  <strong>dostęp, sprostowanie i usunięcie</strong> – prawo dostępu do danych, żądania ich sprostowania, usunięcia lub ograniczenia ich przetwarzania,
                </li>
                <li>
                  <strong>przenoszenie danych</strong> – prawo do przenoszenia danych osobowych do innego administratora.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
                Warunek zawarcia umowy
              </h2>
              <p>
                Podanie przez Państwa danych osobowych jest warunkiem zawarcia umowy usług pośrednictwa, a ich niepodanie będzie skutkowało brakiem możliwości zawarcia powyższej umowy.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
