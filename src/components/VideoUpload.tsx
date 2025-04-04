"use client";

import { RefObject, useState } from "react";
import axios from "axios";
import { UploadResult, UploadStatus, VideoWithId } from "@/types/video";
import styles from "@/styles/uploader.module.css";
import Popup from "./Popup";
import FilePicker from "./FilePicker";
import ResultsSection from "./ResultsSection";
import ItemList from "./ItemList";
import {
  Alert,
  Box,
  LinearProgress,
  Snackbar,
  Typography,
} from "@mui/material";
import usePolling from "@/app/hooks/usePolling";
import { fetchUploadStatuses } from "@/app/api/videos/fetchUploadStatuses";
import { MAX_UPLOAD_STATUS } from "@/lib/utils/constants";
import { Oswald } from "next/font/google";

const oswald = Oswald({
  subsets: ["latin"],
  weight: "600",
});

const VideoUpload = () => {
  const [videos, setVideos] = useState<VideoWithId[]>([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<UploadResult[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [uploadStatuses, setUploadStatuses] = useState<
    Record<string, UploadStatus | null>
  >({});
  const [uploadStarted, setUploadStarted] = useState(false); //TODO: check this
  const [showResults, setShowResults] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "error"
  );
  const [showProgressBar, setShowProgressBar] = useState(false);

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
    setUploadStarted(true);
    await handleUpload();
  };

  const handleFilePickerClick = (
    fileInputRef: RefObject<HTMLInputElement | null>
  ) => {
    setShowResults(false);
    if (!uploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async () => {
    if (!videos.length) return;

    const totalSelectedSize = videos.reduce(
      (sum, video) => sum + video.file.size,
      0
    );

    try {
      const res = await fetch("/api/db/neon-storage");
      const { canUpload, totalUsed, limit } = await res.json();

      const projectedTotal = totalUsed + totalSelectedSize;

      if (!canUpload || projectedTotal > limit) {
        setSnackbarMessage(
          "Upload blocked: Total file size exceeds your storage limit."
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
    } catch (err) {
      console.error("Storage check failed", err);
    }
    setShowProgressBar(true);
    setUploading(true);

    const formData = new FormData();
    videos.forEach(({ id, file }) => formData.append("videos", file, id));
    formData.append(
      "metadata",
      JSON.stringify(
        videos.map(({ id, file }) => ({
          id,
          filename: file.name,
        }))
      )
    );

    try {
      const res = await axios.post("/api/videos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResults(res.data);
      setShowResults(true);
      setSnackbarMessage("Videos uploaded successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Upload failed", err);
      setSnackbarMessage("Upload failed. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setUploading(false);
      setVideos([]);
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

  const getStateDisplay = (video: VideoWithId) => {
    const rawStatus = uploadStatuses[video.id];
    const status: UploadStatus = typeof rawStatus === "number" ? rawStatus : 1;

    if (status === 0) {
      return (
        <Typography color="error" fontWeight={500}>
          Failed
        </Typography>
      );
    }

    const progress = Math.round((status / MAX_UPLOAD_STATUS) * 100);

    return (
      <Box sx={{ minWidth: 150 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 5,
            backgroundColor: "#eee",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#00796b",
            },
          }}
        />
      </Box>
    );
  };

  return (
    <div className={styles.uploadContainer}>
      <h1 className={`${oswald.className} ${styles.uploadTitle}`}>
        Video Uploader
      </h1>

      <FilePicker
        uploading={uploading}
        setVideos={setVideos}
        setShowConfirmation={setShowConfirmation}
        handleFilePickerClick={handleFilePickerClick}
      />

      {videos.length > 0 && showProgressBar && (
        <ItemList<VideoWithId>
          title="Selected Videos"
          items={videos}
          getKey={(video) => video.id}
          getLabel={(video) => video.file.name}
          getStateDisplay={getStateDisplay}
          styles={{
            wrapper: { mt: 4 },
            title: { fontWeight: 600, color: "#004d40" },
            list: { padding: 0 },
            listItem: {
              border: "1px solid #ccc", // clearer border
              borderRadius: "8px",
              mt: 1,
              py: 1.5,
              px: 1,
              backgroundColor: "#f9f9f9",
            },
          }}
        />
      )}

      {showResults && (
        <ResultsSection
          results={results}
          handleResultsClose={handleResultsClose}
        />
      )}

      {showConfirmation && (
        <Popup
          videos={videos}
          handleConfirmUpload={handleConfirmUpload}
          setShowConfirmation={setShowConfirmation}
          handleCancelClick={handleCancelClick}
        />
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{
            backgroundColor:
              snackbarSeverity === "error" ? "#ffebee" : "#e0f2f1",
            color: "#004d40",
            border: `1px solid ${
              snackbarSeverity === "error" ? "#f44336" : "#004d40"
            }`,
            fontWeight: 600,
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};
export default VideoUpload;
