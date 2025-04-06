import { useMemo, useState } from "react";
import axios from "axios";
import { UploadResult, VideoWithId } from "@/types/video";
import usePolling from "@/app/hooks/usePolling";
import { fetchUploadStatuses } from "@/app/api/videos/fetchUploadStatuses";
import { CHUNK_SIZE, MAX_UPLOAD_LIMIT_BYTES } from "@/lib/utils/constants";
import { usePreventNavigation } from "./usePreventNavigation";

export const useVideoUploader = () => {
  const [videos, setVideos] = useState<VideoWithId[]>([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<UploadResult[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [uploadStatuses, setUploadStatuses] = useState<
    Record<string, number | null>
  >({});
  const [showResults, setShowResults] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "error"
  );
  const [showProgressBar, setShowProgressBar] = useState(false);

  usePreventNavigation(uploading);

  const handleChunkedUpload = async () => {
    if (!videos.length) return;
    setUploading(true);
    setShowProgressBar(true);

    try {
      const res = await fetch("/api/db/storage-status");
      const { blob, neon } = await res.json();
      const totalSelectedSize = videos.reduce(
        (sum, video) => sum + video.file.size,
        0
      );

      if (totalSelectedSize > MAX_UPLOAD_LIMIT_BYTES) {
        setSnackbarMessage(
          "Total file size exceeds limit of 100MB. Please reduce your selection and try again"
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setVideos([]);
        setUploading(false);
        return;
      }

      const projectedTotal = blob.totalUsed + totalSelectedSize;
      if (!blob.canUpload || !neon.canUpload || projectedTotal > blob.limit) {
        setSnackbarMessage(
          "Upload blocked: Total file size exceeds your storage limit."
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setVideos([]);
        setUploading(false);
        return;
      }

      const uploadResults = await Promise.allSettled(
        videos.map(async (video) => {
          try {
            const sessionRes = await axios.post("/api/videos/create-session", {
              filename: video.file.name,
              fileSize: video.file.size,
              videoId: video.id,
            });
            const { sessionId } = sessionRes.data;
            const totalChunks = Math.ceil(video.file.size / CHUNK_SIZE);

            for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
              const start = chunkIndex * CHUNK_SIZE;
              const end = Math.min(start + CHUNK_SIZE, video.file.size);
              const chunk = video.file.slice(start, end);

              const formData = new FormData();
              formData.append("chunk", chunk);
              formData.append("sessionId", sessionId);
              formData.append("chunkIndex", chunkIndex.toString());
              formData.append("totalChunks", totalChunks.toString());

              await axios.post("/api/videos/upload-chunk", formData, {
                headers: { "Content-Type": "multipart/form-data" },
              });
            }

            const completeRes = await axios.post(
              "/api/videos/complete-upload",
              {
                sessionId,
                videoId: video.id,
                filename: video.file.name,
              }
            );

            return completeRes.data;
          } catch (error) {
            console.error(`Error uploading ${video.file.name}:`, error);
            return {
              uploadId: video.id,
              filename: video.file.name,
              error: true,
              message: "Upload failed",
            };
          }
        })
      );

      const formattedResults = uploadResults.map((res) =>
        res.status === "fulfilled"
          ? res.value
          : {
              uploadId: "unknown",
              filename: "unknown",
              error: true,
              message: res.reason?.message || "Upload failed",
            }
      );

      setResults(formattedResults);
      setShowResults(true);
      setSnackbarMessage("Upload process completed");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Upload process failed", err);
      setSnackbarMessage("Upload failed. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setUploading(false);
      setVideos([]);
    }
  };

  const handleResultsClose = () => {
    setResults([]);
    setShowResults(false);
  };

  const handleCancelClick = () => {
    setVideos([]);
    setShowConfirmation(false);
  };

  const handleConfirmUpload = async () => {
    setShowConfirmation(false);
    await handleChunkedUpload();
  };

  const handleFilePickerClick = (
    fileInputRef: React.RefObject<HTMLInputElement | null>
  ) => {
    setShowResults(false);
    if (!uploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  usePolling({
    callback: () => {
      const videoIds = videos.map((video) => video.id);
      if (videoIds.length > 0) {
        fetchUploadStatuses({ videoIds }).then(setUploadStatuses);
      }
    },
    delay: 5000,
    dependencies: [videos],
  });

  const progressMap: Record<string, number> = useMemo(() => {
    const map: Record<string, number> = {};
    for (const video of videos) {
      const status = uploadStatuses[video.id];
      if (status == null || status === 0) {
        map[video.id] = 0;
        continue;
      }
      const chunkCount = Math.ceil(video.file.size / CHUNK_SIZE);
      const maxStatus = 1 + chunkCount + 3; // start + chunks + 3 extra stages
      const progress = Math.min(
        100,
        Math.max(0, Math.round(((status - 1) / (maxStatus - 1)) * 100))
      );
      map[video.id] = progress;
    }
    return map;
  }, [uploadStatuses, videos]);

  return {
    videos,
    setVideos,
    uploading,
    results,
    setShowConfirmation,
    showConfirmation,
    uploadStatuses,
    showResults,
    setSnackbarOpen,
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    showProgressBar,
    handleResultsClose,
    handleCancelClick,
    handleConfirmUpload,
    handleFilePickerClick,
    handleChunkedUpload,
    progressMap,
  };
};
