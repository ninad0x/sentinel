import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/auth", "@repo/db", "@repo/ui"],
  outputFileTracingIncludes: {
    "/api/**": ["./node_modules/.prisma/**"]
  },
};

export default nextConfig;