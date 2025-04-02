"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { VideoWithId } from "@/types/video";
import { Dispatch, SetStateAction } from "react";

interface PopupProps {
  videos: VideoWithId[];
  handleConfirmUpload: () => Promise<void>;
  setShowConfirmation: Dispatch<SetStateAction<boolean>>;
  handleCancelClick: () => void;
}

const Popup = ({
  videos,
  handleConfirmUpload,
  setShowConfirmation,
  handleCancelClick,
}: PopupProps) => {
  return (
    <Dialog
      open
      onClose={() => setShowConfirmation(false)}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>Confirm Upload</DialogTitle>
      <DialogContent>
        <Typography>
          Upload {videos.length} video{videos.length !== 1 && "s"}?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelClick} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleConfirmUpload}
          variant="contained"
          color="primary"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Popup;
