export type UploadResult =
  | {
      filename: string;
      uploadId: string;
      videoUrl: string;
      thumbnailUrl: string;
      status: number;
      error?: false;
      message?: string;
    }
  | {
      filename: string;
      uploadId: string;
      error: true;
      message: string;
    };

export type VideoWithId = {
  id: string;
  file: File;
};

export type OrderBy = "asc" | "desc";

export interface VideoUpload {
  filename: string;
  videoUrl: string;
  thumbnailUrl: string;
  status: string;
  fileSize: number;
}

export interface VideoRecord {
  id: string;
  filename: string;
  videoUrl: string;
  thumbnailUrl: string;
  status: string;
  createdAt: string;
  fileSize: number;
}

export type Sizes = "small" | "medium" | "large";
