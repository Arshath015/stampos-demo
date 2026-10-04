import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/dashboard": ["./public/images/results/**/*"],
    "/brand": ["./public/images/results/**/*"],
    "/review": ["./public/images/results/**/*"],
    "/generate": ["./public/images/results/**/*"],
  },
};

export default nextConfig;
