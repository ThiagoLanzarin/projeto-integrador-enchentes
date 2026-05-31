import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remova o "experimental" e coloque direto na raiz do objeto
  allowedDevOrigins: ['192.168.137.1', '192.168.137.1:3000'],
};

export default nextConfig;