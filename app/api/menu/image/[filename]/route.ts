import { NextResponse } from "next/server";

import { getGithubFile } from "@/lib/github";

const MIME_TYPES: Record<string, string> = {
  avif: "image/avif",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  if (!/^[a-z0-9-]+\.(avif|jpe?g|png|webp)$/i.test(filename)) {
    return NextResponse.json(
      { error: "Invalid image filename" },
      { status: 400 }
    );
  }

  try {
    const file = await getGithubFile(
      `public/menu/${filename}`,
      "force-cache"
    );

    if (file.type !== "file" || file.encoding !== "base64") {
      return NextResponse.json(
        { error: "Image file is unavailable" },
        { status: 404 }
      );
    }

    const image = Buffer.from(file.content, "base64");
    const extension = filename.split(".").pop()?.toLowerCase() ?? "";

    return new NextResponse(image, {
      headers: {
        "Content-Type": MIME_TYPES[extension] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Image GET error:", error);

    return NextResponse.json(
      { error: "Image file is unavailable" },
      { status: 404 }
    );
  }
}