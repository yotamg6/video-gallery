import { put } from "@vercel/blob";
import { LAMBDA_THUMBNAIL_URL } from "../utils/constants";

export const generateThumbnail = async (
  videoUrl: string,
  filename: string
): Promise<{
  thumbnailUrl: string;
  status: "done" | "processing";
}> => {
  try {
    const res = await fetch(LAMBDA_THUMBNAIL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoUrl, filename }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Lambda failed:", errText);
      throw new Error("Lambda failed");
    }

    const buffer = Buffer.from(await res.arrayBuffer());

    const thumbnailBlob = await put(`thumb-${filename}.jpg`, buffer, {
      access: "public",
      contentType: "image/jpeg",
    });

    return {
      thumbnailUrl: thumbnailBlob.url,
      status: "done",
    };
  } catch (err) {
    console.error("Thumbnail generation failed:", err);
    return {
      thumbnailUrl: "",
      status: "processing",
    };
  }
};

import { VideoRecord } from "@/types/video";

export const fetchVideos = async (): Promise<VideoRecord[]> => {
  const res = await fetch("/api/videos");
  if (!res.ok) throw new Error("Failed to fetch videos");
  return res.json();
};
