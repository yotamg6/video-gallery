import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/db/redis";
import { put, del } from "@vercel/blob";
import { saveVideoMetadata } from "@/lib/db/videos";
import {
  setUploadStatus,
  uploadCompleteStatus,
} from "@/lib/utils/uploadStatus";
import { generateThumbnail } from "@/lib/api/videos";

interface UploadSession {
  filename: string;
  fileSize: number;
  videoId: string;
  chunks: Record<number, { url: string; size: number }>;
  createdAt: number;
}

export async function POST(req: NextRequest) {
  let videoId: string | undefined;
  try {
    const { sessionId, videoId: incomingVideoId, filename } = await req.json();
    videoId = incomingVideoId;
    if (!videoId) {
      throw new Error("videoId not in request");
    }
    const sessionData = await redis.get(`upload-session:${sessionId}`);
    if (!sessionData) {
      setUploadStatus(videoId, -1);
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
      throw new Error("Failed to parse sessionData");
    }

    const { chunks, fileSize } = session;
    const chunkKeys = Object.keys(chunks).sort(
      (a, b) => parseInt(a) - parseInt(b)
    );

    const chunkCount = Object.keys(chunks).length;
    const uploadComplete = uploadCompleteStatus(chunkCount);
    await setUploadStatus(videoId, uploadComplete);

    const chunkBlobs = await Promise.all(
      chunkKeys.map(async (key) => {
        const chunkInfo = chunks[parseInt(key)];
        const response = await fetch(chunkInfo.url);
        return response.blob();
      })
    );

    const completeFile = new Blob(chunkBlobs);
    const arrayBuffer = await completeFile.arrayBuffer();

    const blob = await put(filename, arrayBuffer, {
      access: "public",
    });

    const thumbnailProcessStatus = uploadComplete + 1;
    await setUploadStatus(videoId, thumbnailProcessStatus);

    const videoUrl = blob.url;

    const { thumbnailUrl, status } = await generateThumbnail(
      videoUrl,
      filename
    );

    await setUploadStatus(videoId, thumbnailProcessStatus + 1);

    await saveVideoMetadata({
      filename,
      videoUrl,
      thumbnailUrl,
      status,
      fileSize,
    });

    await setUploadStatus(videoId, thumbnailProcessStatus + 2);

    await Promise.all(
      chunkKeys.map(async (key) => {
        const chunkName = `${sessionId}_chunk_${parseInt(key)}`;
        await del(chunkName);
      })
    );

    await redis.del(`upload-session:${sessionId}`);

    return NextResponse.json({
      filename,
      uploadId: videoId,
      videoUrl,
      thumbnailUrl,
      status,
    });
  } catch (error) {
    console.error("Error completing upload:", error);
    if (videoId) {
      await setUploadStatus(videoId, -1);
    }
    return NextResponse.json(
      { error: "Failed to complete upload" },
      { status: 500 }
    );
  }
}
