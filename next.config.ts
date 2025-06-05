// Path: ./next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Disable built-in optimization to avoid 400 errors
  images: {
    unoptimized: true,
    // Remote patterns for Strapi uploads
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;