import "server-only";

import { revalidatePath } from "next/cache";

/** Odświeża cache stron publicznych z listą ofert po synchronizacji Esti. */
export function revalidatePublicOfferPages(): void {
  revalidatePath("/");
  revalidatePath("/oferty");
}
