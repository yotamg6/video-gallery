"use client";

import { UploadResult } from "@/types/video";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Link as MuiLink,
  Alert,
  Paper,
  IconButton,
  Card,
  CardContent,
  Box,
  Button,
  Link,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import styles from "@/styles/results.module.css";

// const dummyResults = [
//   //TODO: remove
//   {
//     uploadId: "1",
//     filename: "my_cat_video.mp4",
//     videoUrl: "https://example.com/video1",
//     error: null,
//   },
//   {
//     uploadId: "2",
//     filename: "my_dog_video.mp4",
//     videoUrl: "https://example.com/video2",
//     error: "Network error",
//   },
//   {
//     uploadId: "3",
//     filename: "vacation_clip.mov",
//     videoUrl: "https://example.com/video3",
//     error: null,
//   },
// ];

interface ResultsSectionProps {
  results: UploadResult[];
  handleResultsClose: () => void;
}

const ResultsSection = ({
  results,
  handleResultsClose,
}: ResultsSectionProps) => {
  return (
    <Card sx={{ mt: 4 }}>
      <CardContent className={styles.card} sx={{ padding: 0 }}>
        <Box flexDirection="column" justifyItems="center">
          <IconButton onClick={handleResultsClose}>
            <CancelOutlinedIcon />
          </IconButton>
          <Typography
            className={styles.title}
            variant="h6"
            sx={{ fontWeight: "900" }}
          >
            Uploaded Videos
          </Typography>
        </Box>
        {/* TODO: shold it be grid instead? */}
        <List>
          {results.map((res) => (
            <ListItem
              key={res.uploadId}
              sx={{
                p: 2,
                width: "90%",
                margin: "12px auto",
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                backgroundColor: res.error ? "#fff5f5" : "#f7fcfa",
                boxShadow: res.error
                  ? "0 1px 4px rgba(0, 0, 0, 0.04)"
                  : "inset 0 2px 40px rgba(0, 150, 136, 0.1)",
                transition: "box-shadow 0.2s ease, transform 0.2s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                },
              }}
            >
              {res.error ? (
                <Alert severity="error" sx={{ width: "100%" }}>
                  Upload failed for <strong>{res.filename}</strong>
                </Alert>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column", //TODO: check with Claude why when row, theres a huge gap on the right
                    gap: 2,
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <CheckCircleOutlineIcon color="success" />
                  <Box sx={{ mt: "-1.25rem" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {res.filename}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                      Upload successful
                    </Typography>
                  </Box>
                </Box>
              )}
            </ListItem>
          ))}
        </List>
        <Box mt={2} textAlign="center">
          <Link href="/">
            <Button variant="contained" sx={{ backgroundColor: "#004d40" }}>
              Go to Gallery
            </Button>
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ResultsSection;
