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
                    activeSlide={activeSlide}
                    slideIndex={index}
                  />
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default Gallery;
