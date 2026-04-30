import Image from "next/image";

const sampleOffers = [
  {
    id: 1,
    title: "Nowoczesny dom z ogrodem",
    location: "Kraków, Swoszowice",
    price: "1 190 000 zł",
    area: "168 m²",
    rooms: 6,
    type: "Dom",
    offerType: "Sprzedaż",
    description:
      "Przestronny dom z dużym salonem, garażem dwustanowiskowym i ogrodem od strony południowej. Idealny dla rodziny szukającej spokojnej okolicy z dobrym dojazdem do centrum.",
    image: "/hero/domy.png",
  },
  {
    id: 2,
    title: "Mieszkanie 2-pokojowe przy parku",
    location: "Warszawa, Żoliborz",
    price: "3 900 zł / mies.",
    area: "49 m²",
    rooms: 2,
    type: "Mieszkanie",
    offerType: "Wynajem",
    description:
      "Funkcjonalne mieszkanie po remoncie, w pełni umeblowane i gotowe do zamieszkania. Budynek z windą, blisko komunikacji miejskiej oraz terenów zielonych.",
    image: "/hero/mieszkania.png",
  },
  {
    id: 3,
    title: "Działka budowlana z mediami",
    location: "Wrocław, Psie Pole",
    price: "420 000 zł",
    area: "980 m²",
    rooms: null,
    type: "Działka",
    offerType: "Sprzedaż",
    description:
      "Kształtna działka z dostępem do mediów i dojazdem drogą asfaltową. Atrakcyjna lokalizacja pod budowę domu jednorodzinnego lub inwestycję deweloperską.",
    image: "/hero/biura.jpg",
  },
  {
    id: 4,
    title: "Hala magazynowa klasy A",
    location: "Łódź, Widzew",
    price: "7 800 000 zł",
    area: "3 100 m²",
    rooms: null,
    type: "Przemysłowe",
    offerType: "Sprzedaż",
    description:
      "Nowoczesna hala z zapleczem biurowym, dokami przeładunkowymi i placem manewrowym. Obiekt dobrze skomunikowany z trasami szybkiego ruchu.",
    image: "/hero/domy.png",
  },
  {
    id: 5,
    title: "Apartament 3-pokojowy z balkonem",
    location: "Gdańsk, Wrzeszcz",
    price: "865 000 zł",
    area: "71 m²",
    rooms: 3,
    type: "Mieszkanie",
    offerType: "Sprzedaż",
    description:
      "Słoneczny apartament z balkonem i miejscem postojowym w garażu podziemnym. Inwestycja o podwyższonym standardzie, blisko sklepów i usług.",
    image: "/hero/mieszkania.png",
  },
  {
    id: 6,
    title: "Dom bliźniak w spokojnej okolicy",
    location: "Poznań, Naramowice",
    price: "1 050 000 zł",
    area: "142 m²",
    rooms: 5,
    type: "Dom",
    offerType: "Sprzedaż",
    description:
      "Dom w zabudowie bliźniaczej z funkcjonalnym rozkładem pomieszczeń i prywatnym ogródkiem. Kameralne osiedle, szybki dojazd do szkół i punktów handlowych.",
    image: "/hero/domy.png",
  },
];

export default function SampleOffersGrid() {
  return (
    <section className="relative z-10 px-6 pb-16 sm:pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Przykładowe oferty
          </h2>
          <p className="text-slate-500 mt-2">
            Poniżej przykładowe nieruchomości dostępne w naszej bazie.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {sampleOffers.map((offer) => (
            <article
              key={offer.id}
              className="bg-gradient-to-r from-white via-pastel-sky/45 to-pastel-blue/35 rounded-2xl overflow-hidden border border-primary-lighter shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row">
                <div className="relative h-56 md:h-auto md:w-80 shrink-0">
                  <Image
                    src={offer.image}
                    alt={offer.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 320px"
                  />
                </div>

                <div className="p-5 sm:p-6 flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-primary-lighter text-primary-dark text-xs font-semibold px-2.5 py-1 rounded-full">
                      {offer.type}
                    </span>
                    <span className="bg-gradient-to-r from-primary to-accent text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      {offer.offerType}
                    </span>
                  </div>

                  <p className="text-sm text-slate-500 mb-2">{offer.location}</p>
                  <h3 className="text-slate-800 text-xl font-semibold leading-snug mb-3">
                    {offer.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    {offer.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mb-4">
                    <span>{offer.area}</span>
                    {offer.rooms && <span>{offer.rooms} pokoi</span>}
                  </div>

                  <p className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent text-2xl font-bold">
                    {offer.price}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
