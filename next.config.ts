import type { NextConfig } from "next";

// STATIC_EXPORT=1 builds a static site for GitHub Pages (set BASE_PATH to the repo path, e.g. /Zoomin-Fotos).
// Static hosting has no server, so the contact form posts from the browser instead of a Server Action.
// STANDALONE=1 builds a self-contained Node server for the Docker image (see Dockerfile).
const isStatic = process.env.STATIC_EXPORT === "1";
const isStandalone = process.env.STANDALONE === "1";
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  env: { NEXT_PUBLIC_BASE_PATH: isStatic ? basePath : "" },
  reactStrictMode: true,
  ...(isStandalone && { output: "standalone" }),
  ...(isStatic && {
    output: "export",
    basePath,
    trailingSlash: true,
    images: { unoptimized: true },
    turbopack: {
      resolveAlias: { "@/app/contact/actions": "./src/lib/contact-static.ts" },
    },
  }),
  // The live site sits behind Cloudflare, which tells us the visitor's scheme in X-Forwarded-Proto.
  // Send plain-http visitors to https, and tell browsers to stay on https (HSTS is ignored over http).
  // Requests without the header (local dev, the LAN health check) are left alone.
  ...(!isStatic && {
    async redirects() {
      return [
        {
          source: "/:path*",
          has: [
            { type: "header", key: "x-forwarded-proto", value: "http" },
            { type: "host", value: "(?<host>.+)" },
          ],
          destination: "https://:host/:path*",
          permanent: true,
        },
      ];
    },
    async headers() {
      return [
        {
          source: "/:path*",
          headers: [{ key: "Strict-Transport-Security", value: "max-age=15552000" }],
        },
      ];
    },
  }),
};

export default nextConfig;
