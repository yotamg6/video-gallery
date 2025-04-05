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
      onClose={(event, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          setShowConfirmation(false);
        }
      }}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#f1fdfb",
            border: "1px solid #c8e6c9",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          color: "#004d40",
          pb: 0,
        }}
      >
        Confirm Upload
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" sx={{ mt: 1, color: "#004d40" }}>
          Are you sure you want to upload <strong>{videos.length}</strong> video
          {videos.length !== 1 && "s"}?
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "space-between",
          px: 3,
          pb: 2,
          pt: 1,
        }}
      >
        <Button
          onClick={handleCancelClick}
          variant="contained"
          sx={{
            backgroundColor: "#e0f2f1",
            color: "#004d40",
            "&:hover": {
              backgroundColor: "#c8e6c9",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirmUpload}
          variant="contained"
          sx={{
            backgroundColor: "#00796b",
            "&:hover": {
              backgroundColor: "#004d40",
            },
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Popup;
