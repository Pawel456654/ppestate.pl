import HeroSlider from "@/components/HeroSlider";
import Categories from "@/components/Categories";
import LatestOffers from "@/components/LatestOffers";
import AboutUs from "@/components/AboutUs";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <HeroSlider />
      <Categories />
      <LatestOffers />
      <AboutUs />
      <ContactForm />
      <Footer />
    </main>
  );
}
