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
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version as string | undefined,
    NEXT_PUBLIC_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA as string | undefined,
    NEXT_PUBLIC_APP_ENV: (process.env.APP_ENV || process.env.NODE_ENV) as string | undefined,
  },
};

export default nextConfig;