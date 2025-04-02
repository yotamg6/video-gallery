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
} from "@mui/material";

interface ResultsSectionProps {
  results: UploadResult[];
}

const ResultsSection = ({ results }: ResultsSectionProps) => {
  if (!results.length) return null;

  return (
    <Paper elevation={2} sx={{ padding: 2, marginTop: 4 }}>
      <Typography variant="h6" gutterBottom>
        Uploaded Videos:
      </Typography>
      <List disablePadding>
        {results.map((res) => (
          <ListItem
            key={res.uploadId}
            sx={{
              borderBottom: "1px solid #eee",
              paddingLeft: 0,
              paddingRight: 0,
            }}
          >
            {res.error ? (
              <Alert severity="error" sx={{ width: "100%" }}>
                Upload failed
              </Alert>
            ) : (
              <ListItemText
                primary={
                  <MuiLink
                    href={res.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    color="primary"
                  >
                    {res.filename}
                  </MuiLink>
                }
              />
            )}
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ResultsSection;
