"use client";

import { useState } from "react";
import axios from "axios";
import { UploadResult, UploadStatus, VideoWithId } from "@/types/video";
import styles from "@/styles/uploader.module.css";
import Popup from "./Popup";
import FilePicker from "./FilePicker";
import ResultsSection from "./ResultsSection";
import ItemList from "./ItemList";
import { Box, LinearProgress } from "@mui/material";
import usePolling from "@/app/hooks/usePolling";
import { fetchUploadStatuses } from "@/app/api/upload/fetchUploadStatuses";
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

  const [uploadStarted, setUploadStarted] = useState(false);

  const handleCancelClick = () => {
    setVideos([]);
    setShowConfirmation(false);
  };

  const handleConfirmUpload = async () => {
    setShowConfirmation(false);
    setUploadStarted(true);
    await handleUpload();
  };

  const handleUpload = async () => {
    //TODO: remove to customHook. setVideos will probably move there as well
    if (!videos.length) return;
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
      const res = await axios.post("/api/upload", formData, {
        // TODO: remove to a designated api calls folder?
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResults(res.data);
    } catch (err) {
      console.error("Upload failed", err);
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

    if (status === 0) return "Failed";

    return (
      <Box sx={{ textAlign: "right", minWidth: 120 }}>
        <LinearProgress
          variant="determinate"
          value={(status / MAX_UPLOAD_STATUS) * 100}
          sx={{ mb: 0.5 }}
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
      />

      <ItemList<VideoWithId>
        title="Selected Videos:"
        items={videos}
        getKey={(video) => video.id}
        getLabel={(video) => video.file.name}
        getStateDisplay={getStateDisplay}
        styles={{
          wrapper: { mt: 4 },
          title: { fontWeight: 600 },
          list: { padding: 0 },
          listItem: { borderBottom: "1px solid #eee", py: 1 },
        }}
      />

      <ResultsSection results={results} />

      {showConfirmation && (
        <Popup
          videos={videos}
          handleConfirmUpload={handleConfirmUpload}
          setShowConfirmation={setShowConfirmation}
          handleCancelClick={handleCancelClick}
        />
      )}
    </div>
  );
};
export default VideoUpload;
