import { UploadStatus } from "@/types/video";
import { MAX_UPLOAD_STATUS } from "./constants";

export const getProgressValue = (status: UploadStatus): number => {
  return (status / MAX_UPLOAD_STATUS) * 100;
};
