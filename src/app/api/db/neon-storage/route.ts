import { prisma } from "@/lib/prisma";
import { NEON_STORAGE_LIMIT } from "@/lib/utils/constants";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const result = await prisma.video.aggregate({
      _sum: { fileSize: true },
    });

    const totalUsed = result._sum.fileSize || 0;
    const remaining = NEON_STORAGE_LIMIT - totalUsed;
    const hasSpace = totalUsed < NEON_STORAGE_LIMIT;

    const status = hasSpace ? "ok" : "limit_exceeded";

    return NextResponse.json({
      status,
      totalUsed,
      limit: NEON_STORAGE_LIMIT,
      remaining,
      canUpload: hasSpace,
    });
  } catch (error) {
    console.error("Failed to calculate Neon storage usage", error);
    return NextResponse.json(
      { status: "error", message: "Unable to retrieve Neon storage info" },
      { status: 500 }
    );
  }
};
