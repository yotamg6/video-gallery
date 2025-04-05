import { prisma } from "@/lib/prisma";
import { OrderBy, VideoUpload } from "@/types/video";

export const saveVideoMetadata = async ({
  filename,
  videoUrl,
  thumbnailUrl,
  status,
  fileSize,
}: VideoUpload) => {
  try {
    return await prisma.video.create({
      data: {
        filename,
        videoUrl,
        thumbnailUrl,
        status,
        fileSize,
      },
    });
  } catch (e) {
    console.log("failed to create video:", e);
    throw new Error("Error creating video entry");
  }
};

export const getAllVideos = async (
  sortKey: string = "createdAt",
  sortOrder: OrderBy = "desc"
) => {
  try {
    return await prisma.video.findMany({
      orderBy: { [sortKey]: sortOrder },
    });
  } catch (e) {
    console.log("Failed to get videos", e);
    throw new Error("Error getting videos");
  }
};
