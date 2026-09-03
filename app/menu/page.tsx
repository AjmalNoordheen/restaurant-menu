import type { Metadata } from "next";

import MenuPageClient from "@/components/menu/MenuPageClient";
import { getMenuFromServer } from "@/lib/menu-server";

export const metadata: Metadata = {
  title: "Taste of Kerala | Menu",
  description: "Browse the Taste of Kerala restaurant menu.",
};

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  let initialMenu = null;

  try {
    initialMenu = await getMenuFromServer({
      popularOnly: true,
    });
  } catch (error) {
    console.error("Initial menu load failed:", error);
  }

  return <MenuPageClient initialMenu={initialMenu} />;
}
