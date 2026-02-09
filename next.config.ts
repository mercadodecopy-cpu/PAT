import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Inclui data/ no bundle das serverless functions do Vercel
  outputFileTracingIncludes: {
    '/api/generate': ['./data/**/*'],
    '/api/chat': ['./data/**/*'],
  },
};

export default nextConfig;
