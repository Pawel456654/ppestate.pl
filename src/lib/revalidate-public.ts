import "server-only";

import { revalidatePath } from "next/cache";

/** Odświeża cache stron publicznych z listą ofert (sync Esti, zapis w panelu). */
export function revalidatePublicOfferPages(): void {
  revalidatePath("/");
  revalidatePath("/oferty");
}
