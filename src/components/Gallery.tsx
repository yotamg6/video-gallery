"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchVideos } from "@/lib/api/videos";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Link,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";

import "swiper/css";
import "swiper/css/navigation";
import styles from "@/styles/gallery.module.css";
import { VideoRecord } from "@/types/video";

//TODO: add f"etching your videos along with/ instead of the loader"
//TODO: do we need some caching mechanism here?
//TODO: Fallback message in the caroussel, in case file is not read?

const Gallery = () => {
  const [open, setOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoRecord | null>(null);

  const {
    data: videos = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["videos"],
    queryFn: fetchVideos,
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">Failed to load videos.</Typography>
      </Box>
    );
  }

  if (!videos.length) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <Card
          sx={{
            maxWidth: 480,
            backgroundColor: "#e0f2f1",
            borderLeft: "6px solid #004d40",
            boxShadow: 3,
          }}
        >
          <CardContent>
            <Box display="flex" flexDirection="column" alignItems="center">
              <VideoLibraryIcon
                sx={{ fontSize: 48, color: "#004d40", mb: 1 }}
              />
              <Typography
                variant="h6"
                fontWeight={600}
                color="#004d40"
                gutterBottom
              >
                No Videos Yet
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                textAlign="center"
                mb={1}
              >
                You haven’t uploaded any videos yet. Head over to the{" "}
                <Link href="/uploader">
                  <Typography
                    component="span"
                    sx={{
                      color: "#004d40",
                      fontWeight: 600,
                      textDecoration: "underline",
                      cursor: "pointer",
                      "&:hover": { color: "#00332e" },
                    }}
                  >
                    Video Upload
                  </Typography>
                </Link>{" "}
                page and share your first video!
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const handleThumbnailClick = (video: VideoRecord) => {
    setSelectedVideo(video);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedVideo(null);
  };

  return (
    <div className={styles.carouselWrapper}>
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={20}
        slidesPerView={1}
      >
        {videos.map((video) => (
          <SwiperSlide key={video.id}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              height={340}
              sx={{ cursor: "pointer" }}
            >
              <Image
                src={video.thumbnailUrl}
                alt={video.filename}
                width={480}
                height={270}
                className={styles.thumbnail}
                onClick={() => handleThumbnailClick(video)}
              />
              <Typography className={styles.title}>{video.filename}</Typography>
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
                style={{
                  width: "100%",
                  maxHeight: "70vh",
                  borderRadius: "8px",
                }}
              >
                <source src={selectedVideo.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <Box mt={2}>
                <Typography variant="body2" color="textSecondary">
                  Uploaded on:{" "}
                  {new Date(selectedVideo.createdAt).toLocaleString()}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Gallery;
