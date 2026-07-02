import "server-only";

import { revalidatePath } from "next/cache";

/** Odświeża cache stron publicznych z listą ofert (sync Esti, zapis w panelu). */
export function revalidatePublicOfferPages(slug?: string | null): void {
  revalidatePath("/");
  revalidatePath("/oferty");
  if (slug) revalidatePath(`/oferty/${slug}`);
}
