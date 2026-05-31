import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    allowedDevOrigins: ['192.168.137.1', '192.168.137.1:3000'],
  },
};

export default nextConfig;