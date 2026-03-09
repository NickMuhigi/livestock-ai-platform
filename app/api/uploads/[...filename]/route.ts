import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

function getMimeType(fileName: string): string {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  return "application/octet-stream";
}

export async function GET(
  _req: NextRequest,
  context: { params: { filename: string[] } }
) {
  try {
    const parts = context.params.filename || [];
    const safeParts = parts.filter((part) => part && part !== "." && part !== "..");
    if (safeParts.length === 0) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const relativePath = path.join(...safeParts);
    const runtimeUploadsPath = path.join(process.cwd(), "uploads", relativePath);
    const legacyPublicPath = path.join(process.cwd(), "public", "uploads", relativePath);

    let fileBuffer: Buffer | null = null;
    let sourcePath = runtimeUploadsPath;

    try {
      fileBuffer = await fs.readFile(runtimeUploadsPath);
    } catch {
      try {
        fileBuffer = await fs.readFile(legacyPublicPath);
        sourcePath = legacyPublicPath;
      } catch {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }
    }

    const response = new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": getMimeType(sourcePath),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });

    return response;
  } catch (error) {
    console.error("Failed to serve uploaded image:", error);
    return NextResponse.json({ error: "Failed to load image" }, { status: 500 });
  }
}
