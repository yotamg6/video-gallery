import { FONT_SIZE_BY_SIZE, STYLES_BY_SEVERITY } from "@/lib/utils/constants";
import { Box, Typography, BoxProps, TypographyProps } from "@mui/material";

interface MessageCardProps {
  message: string;
  variant?: TypographyProps["variant"];
  mt?: BoxProps["mt"];
  mode?: "default" | "inline";
  severity?: "error" | "info" | "success" | "warning";
  size?: "small" | "medium" | "large";
}

const MessageCard = ({
  message,
  variant = "subtitle1",
  mt = 4,
  mode = "default",
  severity = "info",
  size = "medium",
}: MessageCardProps) => {
  const isInline = mode === "inline";

  const style = STYLES_BY_SEVERITY[severity];

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      mt={mt}
      p={2}
      border={isInline ? "1px dashed #004d40" : style.border}
      borderRadius={2}
      bgcolor={isInline ? "transparent" : style.bgcolor}
      textAlign="center"
      maxWidth={isInline ? "100%" : "600px"}
      mx="auto"
    >
      <Typography
        variant={variant}
        sx={{
          color: isInline ? "#004d40" : style.color,
          fontWeight: 600,
          fontSize: FONT_SIZE_BY_SIZE[size],
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default MessageCard;
