import type { MetadataRoute } from "next";
import { services } from "@/lib/data";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/services", "/packages", "/portfolio", "/testimonials", "/about", "/contact"].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : path === "/packages" || path === "/services" ? 0.9 : 0.8,
  }));
  const servicePages = services.map((s) => ({
    url: absoluteUrl(`/services/${s.slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  return [...pages, ...servicePages];
}
