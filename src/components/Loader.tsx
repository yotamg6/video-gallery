"use client";

import { LOADER_SIZES } from "@/lib/utils/constants";
import { Sizes } from "@/types/video";
import { CircularProgress } from "@mui/material";
interface LoaderProps {
  size?: Sizes;
}

const Loader = ({ size = "small" }: LoaderProps) => {
  const sizeNumber = LOADER_SIZES[size];
  return <CircularProgress size={sizeNumber} thickness={5} />;
};

export default Loader;
