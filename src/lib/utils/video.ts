import { put } from "@vercel/blob";
import { LAMBDA_THUMBNAIL_URL } from "./constants";

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
      status: "processing", //TODO: should be "failed instead? or implement a retry logic?"
    };
  }
};
