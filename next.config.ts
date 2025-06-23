import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/site',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
