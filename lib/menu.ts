import type { MenuData } from "@/types/menu";

export const MENU_API_PATH = "/api/menu";

export async function fetchMenu(): Promise<MenuData> {
  const response = await fetch(MENU_API_PATH, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load menu");
  }

  return response.json();
}

export function getMenuImageUrl(image: string) {
  if (image.startsWith("/menu/")) {
    return `/api/menu/image/${image.slice("/menu/".length)}`;
  }

  return image;
}
