import { UploadStatus } from "@/types/video";
import { redis } from "../db/redis";
import { STATUS_PREFIX } from "./constants";

export const setUploadStatus = async (id: string, status: UploadStatus) => {
  await redis.set(`${STATUS_PREFIX}${id}`, status, { ex: 3600 });
};

export const getUploadStatus = async (
  id: string
): Promise<UploadStatus | null> => {
  return await redis.get(`${STATUS_PREFIX}${id}`);
};

export const getMultipleUploadStatuses = async (
  ids: string[]
): Promise<Record<string, UploadStatus | null>> => {
  const keys = ids.map((id) => `${STATUS_PREFIX}${id}`);
  const results = await redis.mget(...keys);
  const mapped: Record<string, UploadStatus | null> = {};
  ids.forEach((id, i) => (mapped[id] = results[i] as UploadStatus | null));
  return mapped;
};
