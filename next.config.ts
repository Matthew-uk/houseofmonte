import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json in the parent folder makes Next guess the wrong
  // workspace root; pin it to this project.
  outputFileTracingRoot: __dirname,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/deguiebas/image/upload/**" },
    ],
  },
};

export default nextConfig;
