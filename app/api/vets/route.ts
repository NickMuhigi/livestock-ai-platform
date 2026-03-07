import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const token = getTokenFromRequest(req);
    if (!token) {
      console.error("No token provided");
      return NextResponse.json(
        { error: "Unauthorized - no token", vets: [] },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      console.error("Token verification failed");
      return NextResponse.json(
        { error: "Unauthorized - invalid token", vets: [] },
        { status: 401 }
      );
    }

    // Get all vets
    const vets = await prisma.user.findMany({
      where: { role: "VET" },
      select: {
        id: true,
        name: true,
        email: true,
        district: true,
        latitude: true,
        longitude: true,
      },
    });

    console.log(`Found ${vets.length} vets`);

    return NextResponse.json({
      success: true,
      vets,
    });
  } catch (error) {
    console.error("Failed to fetch vets:", error);
    return NextResponse.json(
      { error: `Failed to fetch veterinarians: ${String(error)}`, vets: [] },
      { status: 500 }
    );
  }
}
