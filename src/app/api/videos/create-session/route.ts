import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { redis } from "@/lib/db/redis";

export async function POST(req: NextRequest) {
  try {
    const { filename, fileSize, videoId } = await req.json();

    const sessionId = uuidv4();

    await redis.set(
      `upload-session:${sessionId}`,
      JSON.stringify({
        filename,
        fileSize,
        videoId,
        chunks: {},
        createdAt: Date.now(),
      }),
      { ex: 86400 }
    );

    return NextResponse.json({ sessionId });
  } catch (error) {
    console.error("Error creating upload session:", error);
    return NextResponse.json(
      { error: "Failed to create upload session" },
      { status: 500 }
    );
  }
}
