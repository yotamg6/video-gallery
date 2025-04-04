import { Box, Typography } from "@mui/material";

interface MessageCardProps {
  message: string;
}

const MessageCard = ({ message }: MessageCardProps) => {
  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Typography color="error">{message}</Typography>
    </Box>
  );
};

export default MessageCard;
