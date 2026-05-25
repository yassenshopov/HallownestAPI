import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.wikia.nocookie.net",
        pathname: "/hollowknight/**",
      },
      {
        protocol: "https",
        hostname: "hollowknight.fandom.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
