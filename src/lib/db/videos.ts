// lib/db/videos.ts
import { prisma } from "@/lib/prisma";

export async function saveVideoMetadata({
  filename,
  videoUrl,
  thumbnailUrl,
  status,
}: {
  filename: string;
  videoUrl: string;
  thumbnailUrl: string;
  status: string;
}) {
  return prisma.video.create({
    data: {
      filename,
      videoUrl,
      thumbnailUrl,
      status,
    },
  });
}
