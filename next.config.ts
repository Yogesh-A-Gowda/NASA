// next.config.ts
import type { NextConfig } from 'next'; // Or 'next/types' depending on your Next.js version

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mars.nasa.gov', // Still good to keep, just in case other Mars images use it
        port: '',
        pathname: '/msl-raw-images/**',
      },
      {
        protocol: 'http', // **IMPORTANT: This specific URL uses HTTP, not HTTPS**
        hostname: 'mars.jpl.nasa.gov', // **This is the one that caused the error**
        port: '',
        pathname: '/msl-raw-images/**',
      },
      {
        protocol: 'https',
        hostname: 'apod.nasa.gov', // For APOD
        port: '',
        pathname: '/apod/**',
      },
      {
        protocol: 'https',
        hostname: 'earthengine.googleapis.com', // For Earth From Space (EPIC)
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.nasa.gov', // For other potential image sources from NASA
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'images-assets.nasa.gov',
        port: '',
        pathname: '/image/**', // Allows all image paths under /image/
      },
    ],
  domains: ['apod.nasa.gov', 'picsum.photos'],
  },
};

export default nextConfig;