"use client";

import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import "swiper/css";
import "swiper/css/navigation";
import styles from "@/styles/gallery.module.css";
import { VideoRecord } from "@/types/video";
import MessageCard from "./MessageCard";
import { formatBytesToMB } from "@/lib/utils/format";

interface VideoThumbnailProps {
  video: VideoRecord;
  activeSlide: number;
  slideIndex: number;
}

const VideoThumbnail = ({
  video,
  activeSlide,
  slideIndex,
}: VideoThumbnailProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  // Stop playback if this slide is not active.
  useEffect(() => {
    if (isPlaying && activeSlide !== slideIndex) {
      setShowPlayer(false);
      setIsPlaying(false);
      const videoEl = videoRef.current;
      videoEl?.pause();
      if (videoEl) {
        videoEl.currentTime = 0;
      }
    }
  }, [activeSlide, slideIndex, isPlaying]);

  if (hasError) {
    return (
      <MessageCard
        message="Video cannot be played"
        mode="inline"
        size="small"
      />
    );
  }

  // Common media style to ensure consistent dimensions
  const mediaStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    display: "block",
  };

  return (
    <Box
      className={styles.videoCard}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: 640, // Increased from 480 to 640
      }}
    >
      {/* Top: File name */}
      <Typography
        className={styles.fileName}
        sx={{
          fontSize: "1.1rem",
          fontWeight: 500,
          mb: 1,
        }}
      >
        {video.filename}
      </Typography>

      {/* Middle: Video container */}
      <Box
        className={styles.videoContainer}
        sx={{
          position: "relative",
          borderRadius: "8px",
          overflow: "hidden",
          // Fixed aspect ratio container (16:9)
          width: "100%",
          maxWidth: 640, // Increased from 480 to 640
          height: 0,
          paddingBottom: "56.25%", // Maintains 16:9 aspect ratio
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
        onMouseEnter={() => setShowPlayer(true)}
        onMouseLeave={() => {
          if (!isPlaying) setShowPlayer(false);
        }}
      >
        {/* Thumbnail image */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: isPlaying || showPlayer ? "none" : "block",
          }}
        >
          <Image
            src={video.thumbnailUrl}
            alt={video.filename}
            fill
            className={styles.thumbnail}
            style={mediaStyle}
            onError={() => setHasError(true)}
          />
        </Box>

        {/* Video Player */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: isPlaying || showPlayer ? "block" : "none",
          }}
        >
          <video
            onPlay={() => setIsPlaying(true)}
            controls
            ref={videoRef}
            style={mediaStyle}
            onEnded={handleVideoEnd}
            onError={() => setHasError(true)}
          >
            <source src={video.videoUrl} type="video/mp4" />
          </video>
        </Box>
      </Box>

      {/* Bottom: Upload details */}
      <Box
        mt={3}
        display="flex"
        justifyContent="space-between"
        sx={{
          width: "100%",
          maxWidth: 640, // Increased from 480 to 640
          padding: "0 4px",
          color: "text.secondary",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontSize: "0.85rem",
            opacity: 0.85,
          }}
        >
          {`Uploaded on: ${new Date(video.createdAt).toLocaleString()}`}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontSize: "0.85rem",
            opacity: 0.85,
          }}
        >
          {`File size: ${formatBytesToMB(video.fileSize)}`}
        </Typography>
      </Box>
    </Box>
  );
};

export default VideoThumbnail;
