import type { Metadata } from "next";

import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import { getMenuFromServer } from "@/lib/menu-server";

export const metadata: Metadata = {
  title: "Dashboard | Menu Admin",
  description: "Manage the Taste of Kerala menu.",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let initialMenu = null;

  try {
    initialMenu = await getMenuFromServer();
  } catch (error) {
    console.error("Initial admin menu load failed:", error);
  }

  return <AdminDashboardClient initialMenu={initialMenu} />;
}
