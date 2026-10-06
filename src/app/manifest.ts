import type { MetadataRoute } from "next";
import { brand } from "@/lib/data";

export const dynamic = "force-static";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Lets phones add the site to the home screen and open it full screen, like an app. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: brand.name,
    short_name: "Zoomin Fotos",
    description: brand.description,
    start_url: `${basePath}/`,
    scope: `${basePath}/`,
    display: "standalone",
    orientation: "portrait",
    background_color: "#f4f2ec",
    theme_color: "#f4f2ec",
    icons: [
      { src: `${basePath}/icon.png`, sizes: "512x512", type: "image/png", purpose: "any" },
      { src: `${basePath}/apple-icon.png`, sizes: "180x180", type: "image/png" },
    ],
  };
}
