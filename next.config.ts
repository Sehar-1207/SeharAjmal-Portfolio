import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // 👇 Fixes the Turbopack warning by explicitly telling Next.js to ignore server modules on the client side
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },

  // 👇 Silences the strict Turbopack builder crash
  turbopack: {},
};

export default nextConfig;