import { Box, Card, CardContent, Link, Typography } from "@mui/material";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";

interface MessageWithCTAProps {
  message: string;
  ctaFirstText: string;
  ctaSecondText: string;
  ctaLinkHref: string;
  targetComponentName: string;
}

const MessageWithCTA = ({
  message,
  ctaFirstText,
  ctaSecondText,
  ctaLinkHref,
  targetComponentName,
}: MessageWithCTAProps) => {
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
            <VideoLibraryIcon sx={{ fontSize: 48, color: "#004d40", mb: 1 }} />
            <Typography
              variant="h6"
              fontWeight={600}
              color="#004d40"
              gutterBottom
            >
              {message}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              textAlign="center"
              mb={1}
            >
              {ctaFirstText}{" "}
              <Link href={ctaLinkHref}>
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
                  {targetComponentName}
                </Typography>
              </Link>{" "}
              {ctaSecondText}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MessageWithCTA;
