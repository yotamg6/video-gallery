import { getAllVideos, saveVideoMetadata } from "@/lib/db/videos";
import { respondWithError } from "@/lib/utils/responses";
import { setUploadStatus } from "@/lib/utils/uploadStatus";
import { generateThumbnail } from "@/lib/api/videos";
import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "nodejs",
};

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const files = formData.getAll("videos") as File[];
    if (!files.length) {
      return new Response("Empty request", { status: 204 });
    }

    const metadataRaw = formData.get("metadata") as string;
    const metadata = JSON.parse(metadataRaw) as {
      id: string;
      filename: string;
    }[];

    const results = await Promise.allSettled(
      files.map(async (file, index) => {
        const { id: uploadId, filename } = metadata[index];
        try {
          await setUploadStatus(uploadId, 1);
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
          await saveVideoMetadata({
            filename,
            videoUrl,
            thumbnailUrl,
            status,
          });

          await setUploadStatus(uploadId, 4);
          return {
            filename,
            uploadId,
            videoUrl,
            thumbnailUrl,
            status,
          };
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
};

export const GET = async () => {
  try {
    const videos = await getAllVideos();
    return NextResponse.json(videos); //TODO: should this reponse by next also be applied to the other api functions?
  } catch (error) {
    console.error("Error fetching videos:", error);
    return new NextResponse("Failed to fetch videos", { status: 500 });
  }
};
