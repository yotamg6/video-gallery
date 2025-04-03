"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { UploadResult, UploadStatus, VideoWithId } from "@/types/video";
import styles from "@/styles/uploader.module.css";
import Popup from "./Popup";
import FilePicker from "./FilePicker";
import ResultsSection from "./ResultsSection";
import ItemList from "./ItemList";
import { Box, LinearProgress, Typography } from "@mui/material";
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

  const handleUpload = async () => {
    //TODO: remove to customHook. setVideos will probably move there as well. if doing so, might want to use useMutation by react query
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
      const res = await axios.post("/api/videos", formData, {
        // TODO: remove to a designated api calls folder?
        headers: { "Content-Type": "multipart/form-data" },
      });
      // if (results.length) {
      setResults(res.data);
      setShowResults(true);
      // }
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

  // useEffect(() => {
  //   //TODO: remove
  //   // Dummy data for preview
  //   setVideos([
  //     { id: "1", file: new File(["dummy"], "video1.mp4") },
  //     { id: "2", file: new File(["dummy"], "video2.mp4") },
  //     { id: "3", file: new File(["dummy"], "video3.mp4") },
  //   ]);

  //   setUploadStatuses({
  //     "0": 0,
  //     "1": 1,
  //     "2": 2,
  //     "4": 4,
  //   });
  // }, []);

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
    </div>
  );
};
export default VideoUpload;
