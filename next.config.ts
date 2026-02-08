import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  distDir: '.next',
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "tailwindcss": path.resolve(__dirname, "node_modules/tailwindcss"),
      "postcss": path.resolve(__dirname, "node_modules/postcss"),
    };
    return config;
  },
};

const withNextIntl = require('next-intl/plugin')();

export default withNextIntl(nextConfig);
