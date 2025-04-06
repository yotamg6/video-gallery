import { redis } from "@/lib/db/redis";
import { setUploadStatus } from "@/lib/utils/uploadStatus";
import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

interface UploadSession {
  filename: string;
  fileSize: number;
  videoId: string;
  chunks: Record<number, { url: string; size: number }>;
  createdAt: number;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const chunk = formData.get("chunk") as File;
    const sessionId = formData.get("sessionId") as string;
    const chunkIndex = parseInt(formData.get("chunkIndex") as string);
    const totalChunks = parseInt(formData.get("totalChunks") as string);

    const sessionData = await redis.get(`upload-session:${sessionId}`);
    if (!sessionData) {
      return NextResponse.json(
        { error: "Upload session not found" },
        { status: 404 }
      );
    }

    let session: UploadSession;

    try {
      if (typeof sessionData === "string") {
        session = JSON.parse(sessionData);
      } else {
        session = sessionData as unknown as UploadSession;
      }
    } catch (err) {
      console.error("Failed to parse sessionData:", sessionData, err);
      return NextResponse.json(
        { error: "Failed to parse upload session" },
        { status: 500 }
      );
    }

    await setUploadStatus(session.videoId, chunkIndex + 1);

    const chunkName = `${sessionId}_chunk_${chunkIndex}`;
    const blobResult = await put(chunkName, chunk.stream(), {
      access: "public",
    });

    if (!session.chunks) {
      session.chunks = {};
    }

    session.chunks[chunkIndex] = {
      url: blobResult.url,
      size: chunk.size,
    };

    await redis.set(`upload-session:${sessionId}`, JSON.stringify(session), {
      ex: 86400,
    });

    return NextResponse.json({
      chunkIndex,
      received: true,
      progress: Math.round(((chunkIndex + 1) / totalChunks) * 100),
    });
  } catch (error) {
    console.error("Error uploading chunk:", error);
    return NextResponse.json(
      { error: "Failed to upload chunk" },
      { status: 500 }
    );
  }
}
