import HeroSlider from "@/components/HeroSlider";
import Categories from "@/components/Categories";
import LatestOffers from "@/components/LatestOffers";
import AboutUs from "@/components/AboutUs";
import AboutExtendedContent from "@/components/AboutExtendedContent";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import {
  fetchCategoryOfferCounts,
  fetchPublicOfferCities,
} from "@/lib/public-offers";

export default async function Home() {
  const [categoryCounts, cities] = await Promise.all([
    fetchCategoryOfferCounts(),
    fetchPublicOfferCities(),
  ]);

  return (
    <main>
      <HeroSlider cities={cities} />
      <Categories counts={categoryCounts} />
      <LatestOffers />
      <AboutUs />
      <AboutExtendedContent />
      <ContactForm />
      <Footer />
    </main>
  );
}
