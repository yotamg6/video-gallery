"use client";

import { useMemo } from "react";
import { VideoWithId } from "@/types/video";
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
import { Oswald } from "next/font/google";
import { useVideoUploader } from "@/app/hooks/useVideoUploader";

const oswald = Oswald({
  subsets: ["latin"],
  weight: "600",
});

const VideoUpload = () => {
  const {
    videos,
    setVideos,
    uploading,
    results,
    setShowConfirmation,
    showConfirmation,
    setSnackbarOpen,
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    showProgressBar,
    showResults,
    handleResultsClose,
    handleCancelClick,
    handleConfirmUpload,
    handleFilePickerClick,
    progressMap,
  } = useVideoUploader();

  const stateDisplayMap = useMemo(() => {
    const map: Record<string, React.ReactNode> = {};
    for (const video of videos) {
      const progress = progressMap[video.id];
      if (progress === -1) {
        map[video.id] = (
          <Typography color="error" fontWeight={500}>
            Failed
          </Typography>
        );
      } else if (progress === undefined) {
        map[video.id] = (
          <Typography color="textSecondary" fontWeight={500}>
            Waiting
          </Typography>
        );
      } else {
        map[video.id] = (
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
      }
    }
    return map;
  }, [progressMap, videos]);

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
          getStateDisplay={(video) => stateDisplayMap[video.id]}
          styles={{
            wrapper: { mt: 4 },
            title: { fontWeight: 600, color: "#004d40" },
            list: { padding: 0 },
            listItem: {
              border: "1px solid #ccc",
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
