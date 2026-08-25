import { getGithubFile } from "@/lib/github";
import type { MenuData } from "@/types/menu";

const MENU_PATH = "data/menu.json";

export async function getMenuFromServer(): Promise<MenuData> {
  const file = await getGithubFile(MENU_PATH);
  const content = Buffer.from(file.content, "base64").toString("utf-8");

  return JSON.parse(content) as MenuData;
}
