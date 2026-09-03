import { NextResponse } from "next/server";
import {
  getGithubFile,
  updateGithubFile,
} from "@/lib/github";
import { getMenuFromServer } from "@/lib/menu-server";

const MENU_PATH = "data/menu.json";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category") ?? undefined;
    const search = url.searchParams.get("search") ?? undefined;
    const popular = url.searchParams.get("popular");
    const hasFilter = Boolean(category || search);
    const menu = await getMenuFromServer({
      category,
      search,
      popularOnly: popular === "false" ? false : !hasFilter,
    });

    return NextResponse.json(menu);
  } catch (error) {
    console.error("Menu GET error:", error);

    return NextResponse.json(
      {
        error: "Failed to load menu",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body.categories || !body.items) {
      return NextResponse.json(
        {
          error: "Invalid menu data",
        },
        {
          status: 400,
        }
      );
    }

    const file = await getGithubFile(MENU_PATH);

    await updateGithubFile(
      MENU_PATH,
      JSON.stringify(body, null, 2),
      "Update restaurant menu",
      file.sha
    );

    return NextResponse.json({
      success: true,
      menu: body,
    });
  } catch (error) {
    console.error("Menu PUT error:", error);

    return NextResponse.json(
      {
        error: "Failed to update menu",
      },
      {
        status: 500,
      }
    );
  }
}