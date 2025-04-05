import { prisma } from "@/lib/prisma";
import { BLOB_STORAGE_LIMIT, NEON_STORAGE_LIMIT } from "@/lib/utils/constants";

export const checkBlobStorage = async () => {
  const result = await prisma.video.aggregate({
    _sum: { fileSize: true },
  });

  const totalUsed = result._sum.fileSize || 0;
  const remaining = BLOB_STORAGE_LIMIT - totalUsed;
  const hasSpace = totalUsed < BLOB_STORAGE_LIMIT;

  return {
    status: hasSpace ? "ok" : "limit_exceeded",
    totalUsed,
    remaining,
    limit: BLOB_STORAGE_LIMIT,
    canUpload: hasSpace,
  };
};

export const checkNeonStorage = async () => {
  const [{ size }] = await prisma.$queryRawUnsafe<{ size: number }[]>(
    `SELECT pg_database_size(current_database()) AS size`
  );

  const totalUsed = BigInt(size || 0);
  const remaining = Number(NEON_STORAGE_LIMIT - totalUsed);
  const hasSpace = totalUsed < NEON_STORAGE_LIMIT;

  return {
    status: hasSpace ? "ok" : "limit_exceeded",
    totalUsed: Number(totalUsed),
    remaining,
    limit: Number(NEON_STORAGE_LIMIT),
    canUpload: hasSpace,
  };
};
