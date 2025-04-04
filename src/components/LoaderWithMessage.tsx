import { Box, CircularProgress, Typography } from "@mui/material";

interface LoaderWithMessageProps {
  message?: string;
}

const LoaderWithMessage = ({ message }: LoaderWithMessageProps) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      {message && (
        <Typography
          variant="subtitle1"
          sx={{ mb: 2, color: "#004d40", fontWeight: 600 }}
        >
          {message}
        </Typography>
      )}
      <CircularProgress />
    </Box>
  );
};

export default LoaderWithMessage;
