import { getGithubFile } from "@/lib/github";
import type { MenuData } from "@/types/menu";

const MENU_PATH = "data/menu.json";

export async function getMenuFromServer(options?: {
  category?: string;
  search?: string;
  popularOnly?: boolean;
}): Promise<MenuData> {
  const file = await getGithubFile(MENU_PATH);
  const content = Buffer.from(file.content, "base64").toString("utf-8");
  const menu = JSON.parse(content) as MenuData;
  const category = options?.category;
  const search = options?.search?.trim().toLowerCase();

  return {
    categories: menu.categories,
    items: menu.items.filter((item) => {
      const matchesCategory = Boolean(search) ||
        !category ||
        category === "all" ||
        item.categoryId === category;
      const matchesSearch = !search ||
        item.name.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search);
      const matchesPopular = !options?.popularOnly || item.popular;

      return matchesCategory && matchesSearch && matchesPopular;
    }),
  };
}
