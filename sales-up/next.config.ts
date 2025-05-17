import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@style": path.resolve(__dirname, "style"),
    };
    return config;
  },
  output: "export",
};

export default nextConfig;