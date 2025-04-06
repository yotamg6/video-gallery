import { redis } from "../db/redis";
import { STATUS_PREFIX } from "./constants";
export const setUploadStatus = async (id: string, status: number) => {
  await redis.set(`${STATUS_PREFIX}${id}`, status, { ex: 3600 });
};

export const getUploadStatus = async (
  id: string
): Promise<number | null> => {
  return await redis.get(`${STATUS_PREFIX}${id}`);
};

export const getMultipleUploadStatuses = async (
  ids: string[]
): Promise<Record<string, number | null>> => {
  const keys = ids.map((id) => `${STATUS_PREFIX}${id}`);
  const results = await redis.mget(...keys);
  const mapped: Record<string, number | null> = {};
  ids.forEach((id, i) => (mapped[id] = results[i] as number | null));
  return mapped;
};

export const uploadCompleteStatus = (chunkCount: number) => 1 + chunkCount + 1;
