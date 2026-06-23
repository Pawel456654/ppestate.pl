import type { MetadataRoute } from "next";
import { fetchPublicOfferSlugs } from "@/lib/public-offers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://ppestate.pl";
  const offers = await fetchPublicOfferSlugs();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/oferty`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/polityka-prywatnosci`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/polityka-cookies`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/rodo`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const offerPages: MetadataRoute.Sitemap = offers.map((offer) => ({
    url: `${baseUrl}/oferty/${offer.slug}`,
    lastModified: new Date(offer.data_aktualizacji),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...offerPages];
}
