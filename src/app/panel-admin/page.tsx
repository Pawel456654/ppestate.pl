import type { Metadata } from "next";
import { isAuthenticated } from "@/lib/admin-auth";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

export const metadata: Metadata = {
  title: "Panel administratora | PP Estate",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function PanelAdminPage() {
  const authed = await isAuthenticated();
  return authed ? <AdminDashboard /> : <AdminLogin />;
}
