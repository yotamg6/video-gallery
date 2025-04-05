"use client";

import { Box, IconButton, Slider } from "@mui/material";
import Image from "next/image";
import { useState, useRef, useEffect, MouseEvent } from "react";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import ReactPlayer from "react-player";

import "swiper/css";
import "swiper/css/navigation";
import styles from "@/styles/gallery.module.css";
import { VideoRecord } from "@/types/video";
import { Oswald } from "next/font/google";
import MessageCard from "./MessageCard";

const oswald = Oswald({
  subsets: ["latin"],
  weight: "600",
});

interface VideoThumbnailProps {
  video: VideoRecord;
  openDialog: (video: VideoRecord) => void;
  activeSlide: number;
  slideIndex: number;
}

type SliderChangeHandler = (
  event: Event | React.SyntheticEvent,
  value: number | number[],
  activeThumb?: number
) => void;

type SliderChangeCommittedHandler = (
  event: Event | React.SyntheticEvent,
  value: number | number[]
) => void;

const VideoThumbnail = ({
  video,
  openDialog,
  activeSlide,
  slideIndex,
}: VideoThumbnailProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [played, setPlayed] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  // For seeking: while dragging, we use a separate state.
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(played);
  // Control overlay visibility.
  const [showOverlay, setShowOverlay] = useState(false);

  const playerRef = useRef<ReactPlayer | null>(null);

  // Stop playback if this slide is not active.
  useEffect(() => {
    if (isPlaying && activeSlide !== slideIndex) {
      setIsPlaying(false);
    }
  }, [activeSlide, slideIndex, isPlaying]);

  // When not seeking, update played progress from ReactPlayer.
  const handleProgress = (state: { played: number }) => {
    if (!isSeeking) {
      setPlayed(state.played);
    }
  };

  const handlePlayPause = (e: MouseEvent) => {
    e.stopPropagation();
    setIsPlaying((prev) => !prev);
  };

  const handleExpandClick = (e: MouseEvent) => {
    e.stopPropagation();
    openDialog(video);
  };

  // Seek slider handlers using proper MUI types.

  // Seek slider handler.
  const handleSeekChange: SliderChangeHandler = (
    event: Event | React.SyntheticEvent,
    value: number | number[],
    activeThumb?: number
  ) => {
    const newVal = typeof value === "number" ? value : value[0];
    setIsSeeking(true);
    setSeekValue(newVal);
  };

  const handleSeekCommitted: SliderChangeCommittedHandler = (
    event: Event | React.SyntheticEvent,
    value: number | number[]
  ) => {
    const newVal = typeof value === "number" ? value : value[0];
    setIsSeeking(false);
    setPlayed(newVal);
    playerRef.current?.seekTo(newVal, "fraction");
  };

  // Volume slider handler.
  const handleVolumeChange: SliderChangeHandler = (
    event: Event | React.SyntheticEvent,
    value: number | number[],
    activeThumb?: number
  ) => {
    const newVal = typeof value === "number" ? value : value[0];
    setVolume(newVal);
    setIsMuted(newVal === 0);
  };

  const handleVolumeIconClick = (e: MouseEvent) => {
    e.stopPropagation();
    setIsMuted((prev) => !prev);
  };

  if (hasError) {
    return (
      <MessageCard
        message="Video cannot be played"
        mode="inline"
        size="small"
      />
    );
  }

  return (
    <Box
      className={styles.videoContainer}
      sx={{ position: "relative", borderRadius: "8px", overflow: "hidden" }}
      onMouseEnter={() => setShowOverlay(true)}
      onMouseLeave={() => setShowOverlay(false)}
    >
      {/* Thumbnail image */}
      <Image
        src={video.thumbnailUrl}
        alt={video.filename}
        width={480}
        height={270}
        className={styles.thumbnail}
        style={{
          width: "100%",
          height: "auto",
          maxWidth: 480,
          display: isPlaying ? "none" : "block",
        }}
        onError={() => setHasError(true)}
      />

      {/* Video Player */}
      <Box
        sx={{
          display: isPlaying ? "block" : "none",
          width: "100%",
          maxWidth: 480,
          height: "auto",
        }}
      >
        <ReactPlayer
          ref={(player) => {
            playerRef.current = player;
          }}
          url={video.videoUrl}
          playing={isPlaying}
          volume={volume}
          muted={isMuted}
          width="100%"
          height="100%"
          controls={false}
          onError={() => setHasError(true)}
          onEnded={() => setIsPlaying(false)}
          onProgress={handleProgress}
        />
      </Box>

      {/* Overlay Controls */}
      {showOverlay && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2,
            pointerEvents: "auto",
          }}
          onMouseEnter={() => setShowOverlay(true)}
          onMouseLeave={() => setShowOverlay(false)}
        >
          {/* Top Right: Expand Button */}
          <Box sx={{ position: "absolute", top: 8, right: 8 }}>
            <IconButton
              onClick={handleExpandClick}
              sx={{ color: "white", padding: 0.5 }}
            >
              <OpenInFullIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Center: Play/Pause Button */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <IconButton
              onClick={handlePlayPause}
              sx={{
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.8)" },
              }}
            >
              {isPlaying ? (
                <PauseCircleOutlineIcon fontSize="large" />
              ) : (
                <PlayCircleOutlineIcon fontSize="large" />
              )}
            </IconButton>
          </Box>

          {/* Bottom Controls */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "rgba(0,0,0,0.5)",
              padding: "4px 8px",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {/* Seek Slider */}
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={isSeeking ? seekValue : played}
              onChange={handleSeekChange}
              onChangeCommitted={handleSeekCommitted}
              sx={{
                color: "white",
                flex: 1,
                "& .MuiSlider-thumb": { width: 10, height: 10 },
              }}
            />
            {/* Volume Control */}
            <Box sx={{ position: "relative" }}>
              <IconButton
                onClick={handleVolumeIconClick}
                sx={{ color: "white", padding: 0.5 }}
              >
                {isMuted ? (
                  <VolumeOffIcon fontSize="small" />
                ) : (
                  <VolumeUpIcon fontSize="small" />
                )}
              </IconButton>
              <Box
                sx={{
                  position: "absolute",
                  bottom: "100%",
                  right: 0,
                  marginBottom: 1,
                  backgroundColor: "rgba(0,0,0,0.7)",
                  borderRadius: 1,
                  padding: "4px",
                }}
              >
                <Slider
                  orientation="vertical"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={handleVolumeChange}
                  sx={{
                    color: "white",
                    height: 100,
                    "& .MuiSlider-thumb": { width: 10, height: 10 },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default VideoThumbnail;
