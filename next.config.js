/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['via.placeholder.com', 'optimistic-actor-4a3a244025.media.strapiapp.com'],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'https',
        hostname: 'optimistic-actor-4a3a244025.strapiapp.com',
      },
      {
        protocol: 'https',
        hostname: 'optimistic-actor-4a3a244025.media.strapiapp.com',
      }
    ],
  },
}

module.exports = nextConfig
