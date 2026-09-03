import type { Metadata } from "next";

import AdminCategoriesClient from "@/components/admin/AdminCategoriesClient";
import { getMenuFromServer } from "@/lib/menu-server";

export const metadata: Metadata = {
  title: "Categories | Menu Admin",
  description: "Manage restaurant menu categories.",
};

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  let initialMenu = null;

  try {
    initialMenu = await getMenuFromServer();
  } catch (error) {
    console.error("Initial admin categories load failed:", error);
  }

  return <AdminCategoriesClient initialMenu={initialMenu} />;
}
