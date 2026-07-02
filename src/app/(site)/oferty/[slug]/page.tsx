import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import OfferGallery from "@/components/OfferGallery";
import OfferMap from "@/components/OfferMap";
import OfferExploreCategories from "@/components/OfferExploreCategories";
import ContactForm from "@/components/ContactForm";
import {
  STATUS_BADGE_CLASSES,
  STATUS_LABELS,
  RYNEK_LABELS,
  TYP_NIERUCHOMOSCI_LABELS,
  TYP_TRANSAKCJI_LABELS,
  formatCena,
} from "@/lib/offers";
import {
  buildRealEstateSchema,
  fetchPublicOfferBySlug,
  formatLocation,
  formatOfferPrice,
  formatPowierzchnia,
  getMainImage,
  getOfferUrl,
} from "@/lib/public-offers";
import { getOfferUrlForRequest } from "@/lib/offer-url";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const offer = await fetchPublicOfferBySlug(slug);

  if (!offer) {
    return {
      title: "Oferta nie znaleziona | PP Estate",
      robots: { index: false, follow: false },
    };
  }

  const title = offer.seo_tytul ?? `${offer.tytul} | PP Estate`;
  const description =
    offer.seo_opis ??
    offer.opis?.slice(0, 160) ??
    `${TYP_NIERUCHOMOSCI_LABELS[offer.typ_nieruchomosci]} — ${formatLocation(offer)}. ${formatOfferPrice(offer)}.`;

  const imageUrl = getMainImage(offer.oferty_zdjecia, offer.typ_nieruchomosci);
  const url = getOfferUrl(slug);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [{ url: imageUrl }],
    },
  };
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3.5">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1.5 text-sm font-semibold text-slate-800">{value}</dd>
    </div>
  );
}

export default async function OfferDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const offer = await fetchPublicOfferBySlug(slug);

  if (!offer) {
    notFound();
  }

  const url = getOfferUrl(slug);
  const offerLink = await getOfferUrlForRequest(slug);
  const schema = buildRealEstateSchema(offer, url);
  const fallbackImage = getMainImage([], offer.typ_nieruchomosci);
  const location = formatLocation(offer);
  const area = formatPowierzchnia(offer);

  const details = [
    { label: "Typ nieruchomości", value: TYP_NIERUCHOMOSCI_LABELS[offer.typ_nieruchomosci] },
    { label: "Transakcja", value: TYP_TRANSAKCJI_LABELS[offer.typ_transakcji] },
    { label: "Rynek", value: offer.rynek ? RYNEK_LABELS[offer.rynek] : null },
    { label: "Powierzchnia", value: area },
    {
      label: "Powierzchnia użytkowa",
      value: offer.powierzchnia_uzytkowa
        ? `${new Intl.NumberFormat("pl-PL").format(offer.powierzchnia_uzytkowa)} m²`
        : null,
    },
    {
      label: "Powierzchnia działki",
      value: offer.powierzchnia_dzialki
        ? `${new Intl.NumberFormat("pl-PL").format(offer.powierzchnia_dzialki)} m²`
        : null,
    },
    {
      label: "Liczba pokoi",
      value: offer.liczba_pokoi != null ? String(offer.liczba_pokoi) : null,
    },
    { label: "Piętro", value: offer.pietro != null ? String(offer.pietro) : null },
    {
      label: "Piętra w budynku",
      value: offer.liczba_pieter_w_budynku != null ? String(offer.liczba_pieter_w_budynku) : null,
    },
    { label: "Rok budowy", value: offer.rok_budowy != null ? String(offer.rok_budowy) : null },
    { label: "Miasto", value: offer.miasto },
    { label: "Dzielnica", value: offer.dzielnica },
    { label: "Ulica", value: offer.ulica },
    { label: "Kod pocztowy", value: offer.kod_pocztowy },
    {
      label: "Cena za m²",
      value: offer.cena_za_m2 != null ? formatCena(offer.cena_za_m2, offer.waluta) : null,
    },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <main className="relative pt-16 overflow-hidden bg-gradient-to-b from-pastel-sky via-white to-pastel-blue/40">
        <div className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-primary-light/25 blur-3xl" />
        <div className="pointer-events-none absolute top-[28rem] -right-16 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

        <section className="relative px-6 py-8 sm:py-10">
          <div className="max-w-7xl mx-auto">
            <Link
              href="/oferty"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors mb-6"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Wróć do listy ofert
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
              <div className="lg:col-span-2">
                <OfferGallery
                  images={offer.oferty_zdjecia.map((z) => ({
                    id: z.id,
                    url: z.url,
                    typ: z.typ ?? "zdjecie",
                  }))}
                  title={offer.tytul}
                  fallbackImage={fallbackImage}
                />
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-24 rounded-2xl border border-primary-lighter bg-white/90 p-6 shadow-sm backdrop-blur-sm">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-primary-lighter text-primary-dark text-xs font-semibold px-2.5 py-1 rounded-full">
                      {TYP_NIERUCHOMOSCI_LABELS[offer.typ_nieruchomosci]}
                    </span>
                    <span className="bg-gradient-to-r from-primary to-accent text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      {TYP_TRANSAKCJI_LABELS[offer.typ_transakcji]}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_BADGE_CLASSES[offer.status]}`}
                    >
                      {STATUS_LABELS[offer.status]}
                    </span>
                  </div>

                  <p className="text-sm text-slate-500 mb-2">{location}</p>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight mb-4">
                    {offer.tytul}
                  </h1>
                  <p className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent text-3xl font-bold mb-6">
                    {formatOfferPrice(offer)}
                  </p>

                  <div className="space-y-3 text-sm text-slate-600 border-t border-slate-100 pt-5">
                    {area && <p>Powierzchnia: <strong>{area}</strong></p>}
                    {offer.liczba_pokoi != null && (
                      <p>Liczba pokoi: <strong>{offer.liczba_pokoi}</strong></p>
                    )}
                  </div>

                  <Link
                    href="#kontakt"
                    className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                  >
                    Zapytaj o ofertę
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-8">
              {offer.opis && (
                <section className="rounded-2xl border border-slate-100 bg-white/90 p-6 sm:p-8 shadow-sm">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-5">
                    Opis nieruchomości
                  </h2>
                  <div className="max-w-4xl text-slate-600 text-base leading-relaxed whitespace-pre-line">
                    {offer.opis}
                  </div>
                </section>
              )}

              {details.length > 0 && (
                <section className="rounded-2xl border border-slate-100 bg-white/90 p-6 sm:p-8 shadow-sm">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
                    Szczegóły oferty
                  </h2>
                  <p className="text-slate-500 text-sm mb-6">
                    Najważniejsze parametry nieruchomości w jednym miejscu.
                  </p>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {details.map((item) => (
                      <DetailItem key={item.label} label={item.label} value={item.value} />
                    ))}
                  </dl>
                </section>
              )}
            </div>
          </div>
        </section>

        <OfferMap offer={offer} />

        <OfferExploreCategories />

        <ContactForm
          presetSubject="Kupno nieruchomości"
          presetMessage={`Dzień dobry,\n\nJestem zainteresowany/a ofertą: ${offer.tytul}\n${offerLink}\n\nProszę o kontakt w sprawie tej nieruchomości.`}
          introTitle="Zainteresowany tą ofertą?"
          introDescription="Napisz do nas — oddzwonimy lub odpowiemy na Twoje pytania dotyczące tej nieruchomości."
        />
      </main>

      <Footer />
    </>
  );
}
