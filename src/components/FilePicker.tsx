"use client";

import { RefObject, useRef } from "react";
import { Button, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import UploadIcon from "@mui/icons-material/Publish";

import { VideoWithId } from "@/types/video";
import Loader from "./Loader";
import styles from "@/styles/uploader.module.css";

type FilePickerProps = {
  uploading: boolean;
  setVideos: (cb: (prev: VideoWithId[]) => VideoWithId[]) => void;
  setShowConfirmation: (val: boolean) => void;
  handleFilePickerClick: (
    fileInputRef: RefObject<HTMLInputElement | null>
  ) => void;
};

const FilePicker = ({
  uploading,
  setVideos,
  setShowConfirmation,
  handleFilePickerClick,
}: FilePickerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // const handleClick = () => {
  //   if (!uploading && fileInputRef.current) {
  //     fileInputRef.current.click();
  //   }
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).map((file) => ({
      id: crypto.randomUUID(),
      file,
    }));
    if (files.length) {
      setVideos((prev) => [...prev, ...files]);
      setShowConfirmation(true);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="video/*"
        onChange={handleChange}
        style={{ display: "none" }}
      />
      <IconButton
        onClick={() => handleFilePickerClick(fileInputRef)}
        className={styles.uploadBtnIcon}
        disabled={uploading}
        sx={{
          fontSize: "8rem",
          color: "#065244",
          transition: "transform 0.2s ease",
          "&:hover": {
            transform: "scale(1.1)",
            backgroundColor: "transparent",
          },
        }}
      >
        {uploading ? <Loader /> : <CloudUploadIcon fontSize="inherit" />}
      </IconButton>
    </>
  );
};

export default FilePicker;
