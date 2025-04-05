"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchVideos } from "@/lib/api/videos";
import { Box, Typography, IconButton } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "swiper/css";
import "swiper/css/navigation";
import styles from "@/styles/gallery.module.css";
import { VideoRecord } from "@/types/video";
import { Oswald } from "next/font/google";
import MessageWithCTA from "./MessageWithCTA";
import MessageCard from "./MessageCard";
import { formatBytesToMB } from "@/lib/utils/format";
import LoaderWithMessage from "./LoaderWithMessage";
import VideoThumbnail from "./VideoThumbnail";

const oswald = Oswald({
  subsets: ["latin"],
  weight: "600",
});

const Gallery = () => {
  const [open, setOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoRecord | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const {
    data: videos = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["videos"],
    queryFn: fetchVideos,
  });

  const handleOpenDialog = (video: VideoRecord) => {
    setSelectedVideo(video);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedVideo(null);
  };

  return (
    <div>
      <h1 className={`${oswald.className} ${styles.pageTitle}`}>Gallery</h1>
      {isLoading ? (
        <LoaderWithMessage message="Fetching videos..." />
      ) : !videos.length ? (
        <MessageWithCTA
          targetComponentName="Video Upload"
          ctaFirstText="You haven't uploaded any videos yet. Head over to the"
          ctaSecondText="page and share your first video!"
          ctaLinkHref="/uploader"
          message="No Videos Yet"
        />
      ) : isError ? (
        <MessageCard
          message="Failed to load videos"
          severity="error"
          size="large"
        />
      ) : (
        <div className={styles.carouselWrapper}>
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={20}
            slidesPerView={1}
            onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
          >
            {videos.map((video, index) => (
              <SwiperSlide key={video.id}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <VideoThumbnail
                    video={video}
                    openDialog={handleOpenDialog}
                    activeSlide={activeSlide}
                    slideIndex={index}
                  />
                  <Typography className={styles.fileName}>
                    {video.filename}
                  </Typography>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>

          <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>
              {selectedVideo?.filename ?? "Video Player"}
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              {selectedVideo && (
                <>
                  <video
                    controls
                    autoPlay
                    style={{
                      width: "100%",
                      maxHeight: "70vh",
                      borderRadius: "8px",
                    }}
                  >
                    <source src={selectedVideo.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <Box mt={2} display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="textSecondary">
                      {`Uploaded on: ${new Date(
                        selectedVideo.createdAt
                      ).toLocaleString()}`}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {`File size: ${formatBytesToMB(selectedVideo.fileSize)}`}
                    </Typography>
                  </Box>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default Gallery;
