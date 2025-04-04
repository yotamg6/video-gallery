export const formatBytesToMB = (bytes: number, decimals = 2): string => {
  if (bytes < 1_000_000) return `${bytes} bytes`;
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(decimals)} MB`;
};
