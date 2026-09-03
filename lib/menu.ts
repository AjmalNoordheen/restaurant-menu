import type { MenuData } from "@/types/menu";

export const MENU_API_PATH = "/api/menu";

export async function fetchMenu(options?: {
  category?: string;
  search?: string;
  includeAll?: boolean;
  signal?: AbortSignal;
}): Promise<MenuData> {
  const params = new URLSearchParams();

  if (options?.includeAll) {
    params.set("popular", "false");
  }

  if (options?.category && options.category !== "all") {
    params.set("category", options.category);
  }

  if (options?.search?.trim()) {
    params.set("search", options.search.trim());
  }

  const query = params.toString();
  const response = await fetch(
    `${MENU_API_PATH}${query ? `?${query}` : ""}`,
    {
    cache: "no-store",
    signal: options?.signal,
    }
  );

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
