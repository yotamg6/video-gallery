import { saveVideoMetadata } from "@/lib/db/videos";
import { respondWithError } from "@/lib/utils/responses";
import { setUploadStatus } from "@/lib/utils/uploadStatus";
import { generateThumbnail } from "@/lib/utils/video";
import { put } from "@vercel/blob";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("videos") as File[];
    if (!files.length) {
      return new Response("Empty request", { status: 204 });
    }

    const results = await Promise.allSettled(
      files.map(async (file) => {
        const uploadId = uuidv4();
        try {
          await setUploadStatus(uploadId, 1);
          const filename = file.name;
          const blob = await put(filename, file.stream(), {
            access: "public",
          });

          await setUploadStatus(uploadId, 2);

          const videoUrl = blob.url;
          const { thumbnailUrl, status } = await generateThumbnail(
            videoUrl,
            filename
          );

          await setUploadStatus(uploadId, 3);
          await saveVideoMetadata({ filename, videoUrl, thumbnailUrl, status });

          await setUploadStatus(uploadId, 4);
          return { uploadId, videoUrl, thumbnailUrl, status };
        } catch (error) {
          console.error("Upload error:", error);
          await setUploadStatus(uploadId, 0);
          return { uploadId, error: true, message: "Upload failed" };
        }
      })
    );
    const response = results.map((result) =>
      result.status === "fulfilled"
        ? result.value
        : { error: true, message: result.reason }
    );
    return Response.json(response);
  } catch (error) {
    return respondWithError();
  }
}
