import "server-only";

import { headers } from "next/headers";
import { getOfferPath, getOfferUrl } from "@/lib/offer-display";

export async function getOfferUrlForRequest(slug: string): Promise<string> {
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "https";

  if (host) {
    return `${protocol}://${host.split(",")[0].trim()}${getOfferPath(slug)}`;
  }

  return getOfferUrl(slug);
}
