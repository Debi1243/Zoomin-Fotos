import type { NextConfig } from "next";

// STATIC_EXPORT=1 builds a static site for GitHub Pages (set BASE_PATH to the repo path, e.g. /Zoomin-Fotos).
// Static hosting has no server, so the contact form posts from the browser instead of a Server Action.
const isStatic = process.env.STATIC_EXPORT === "1";
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  env: { NEXT_PUBLIC_BASE_PATH: isStatic ? basePath : "" },
  reactStrictMode: true,
  ...(isStatic && {
    output: "export",
    basePath,
    trailingSlash: true,
    images: { unoptimized: true },
    turbopack: {
      resolveAlias: { "@/app/contact/actions": "./src/lib/contact-static.ts" },
    },
  }),
};

export default nextConfig;
