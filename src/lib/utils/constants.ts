export const LAMBDA_THUMBNAIL_URL =
  "https://27morko762a4xsitl5nddiaoqu0uwxgc.lambda-url.us-east-1.on.aws/";
export const STATUS_PREFIX = "upload-status:";
export const MAX_UPLOAD_STATUS = 4;
export const NEON_STORAGE_LIMIT = 524288000; // in Bytes

// Font sizes for MessageCard and other text elements
export const FONT_SIZE_BY_SIZE = {
  small: "0.875rem",
  medium: "1rem",
  large: "1.25rem",
};

// Reusable severity-based colors
export const STYLES_BY_SEVERITY = {
  error: {
    bgcolor: "#ffebee",
    border: "2px solid #f44336",
    color: "#b71c1c",
  },
  success: {
    bgcolor: "#e0f2f1",
    border: "2px solid #004d40",
    color: "#004d40",
  },
  info: {
    bgcolor: "#e3f2fd",
    border: "2px solid #1976d2",
    color: "#0d47a1",
  },
  warning: {
    bgcolor: "#fff3e0",
    border: "2px solid #fb8c00",
    color: "#e65100",
  },
};
