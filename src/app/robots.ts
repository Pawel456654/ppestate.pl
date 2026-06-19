import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://ppestate.pl";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/panel-admin", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
