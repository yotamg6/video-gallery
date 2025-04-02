"use client";

import { useRef } from "react";
import { Button } from "@mui/material";
import { VideoWithId } from "@/types/video";
import Loader from "./Loader";

type Props = {
  uploading: boolean;
  setVideos: (cb: (prev: VideoWithId[]) => VideoWithId[]) => void;
  setShowConfirmation: (val: boolean) => void;
};

const FilePicker = ({ uploading, setVideos, setShowConfirmation }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!uploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

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
      <Button
        variant="contained"
        color="primary"
        onClick={handleClick}
        disabled={uploading}
      >
        {uploading ? <Loader /> : "Upload Videos"}
      </Button>
    </>
  );
};

export default FilePicker;
