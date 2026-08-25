import type { Metadata } from "next";

import AdminItemsClient from "@/components/admin/AdminItemsClient";
import { getMenuFromServer } from "@/lib/menu-server";

export const metadata: Metadata = {
  title: "Menu Items | Menu Admin",
  description: "Manage restaurant menu items.",
};

export const dynamic = "force-dynamic";

export default async function AdminItemsPage() {
  let initialMenu = null;

  try {
    initialMenu = await getMenuFromServer();
  } catch (error) {
    console.error("Initial admin items load failed:", error);
  }

  return <AdminItemsClient initialMenu={initialMenu} />;
}
