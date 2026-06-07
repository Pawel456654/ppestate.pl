import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/offer-display";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/panel-admin", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
