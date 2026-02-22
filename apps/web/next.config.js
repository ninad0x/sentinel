const nextConfig = {
  transpilePackages: ["@repo/auth", "@repo/db", "@repo/ui"],
  outputFileTracingIncludes: {
    "/api/**": ["./node_modules/.prisma/**"]
  }
};

export default nextConfig;