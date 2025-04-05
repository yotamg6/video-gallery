import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "3hiot6pk7tt7guzu.public.blob.vercel-storage.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
