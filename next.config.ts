import type { NextConfig } from "next";
import path from "path";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  distDir: '.next',
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ovpmkdyvpgpyozmlmbez.supabase.co',
        pathname: '/**',
      }
    ],
  },
  webpack: (config: any) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "tailwindcss": path.resolve(__dirname, "node_modules/tailwindcss"),
      "postcss": path.resolve(__dirname, "node_modules/postcss"),
    };
    return config;
  },
};

export default withNextIntl(nextConfig);
