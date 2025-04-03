import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },

  images: {
    domains: ["3hiot6pk7tt7guzu.public.blob.vercel-storage.com"],
  },
};

export default nextConfig;
