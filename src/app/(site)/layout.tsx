import type { Metadata } from "next";
import UnderConstruction from "@/components/UnderConstruction";

export const metadata: Metadata = {
  title: "PP Estate | Strona w budowie",
  description: "Strona PP Estate jest obecnie w budowie.",
  robots: { index: false, follow: false },
};

export default function SiteLayout() {
  return <UnderConstruction />;
}
