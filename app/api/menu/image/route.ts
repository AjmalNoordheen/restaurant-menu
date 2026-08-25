import { NextResponse } from "next/server";

import {
  createGithubFile,
} from "@/lib/github";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "No image provided",
        },
        {
          status: 400,
        }
      );
    }

    // Maximum 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        {
          error: "Image must be smaller than 5MB",
        },
        {
          status: 400,
        }
      );
    }

    // Allowed image types
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Only JPG, PNG, WEBP and AVIF images are allowed",
        },
        {
          status: 400,
        }
      );
    }

    const extension = getExtension(file.type);

    const safeName = file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const filename = `${safeName}-${Date.now()}.${extension}`;

    const path = `public/menu/${filename}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    await createGithubFile(
      path,
      buffer,
      `Add menu image ${filename}`
    );

    return NextResponse.json({
      success: true,
      path: `/api/menu/image/${filename}`,
      filename,
    });
  } catch (error) {
    console.error("Image upload error:", error);

    return NextResponse.json(
      {
        error: "Failed to upload image",
      },
      {
        status: 500,
      }
    );
  }
}

function getExtension(type: string) {
  switch (type) {
    case "image/jpeg":
      return "jpg";

    case "image/png":
      return "png";

    case "image/webp":
      return "webp";

    case "image/avif":
      return "avif";

    default:
      return "jpg";
  }
}