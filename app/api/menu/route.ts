import { NextResponse } from "next/server";
import {
  getGithubFile,
  updateGithubFile,
} from "@/lib/github";

const MENU_PATH = "data/menu.json";

export async function GET() {
  try {
    const file = await getGithubFile(MENU_PATH);

    const content = Buffer.from(file.content, "base64").toString(
      "utf-8"
    );

    const menu = JSON.parse(content);

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

    const file = await getGithubFile(MENU_PATH);

    const content = JSON.stringify(body, null, 2);

    await updateGithubFile(
      MENU_PATH,
      content,
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