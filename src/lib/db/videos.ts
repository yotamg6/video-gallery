import { prisma } from "@/lib/prisma";
import { OrderBy } from "@/types/video";

//TODO: add try acatch to all functions?

export const saveVideoMetadata = async ({
  filename,
  videoUrl,
  thumbnailUrl,
  status,
}: {
  filename: string;
  videoUrl: string;
  thumbnailUrl: string;
  status: string;
}) => {
  return prisma.video.create({
    //TODO: should it be awaited?
    data: {
      filename,
      videoUrl,
      thumbnailUrl,
      status,
    },
  });
};

export const getAllVideos = async (
  sortKey: string = "createdAt",
  sortOrder: OrderBy = "desc"
) => {
  return await prisma.video.findMany({
    orderBy: { [sortKey]: sortOrder },
  });
};
