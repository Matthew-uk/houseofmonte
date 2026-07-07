import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Single-page site for now; add /collections, /products/[slug], /about etc.
// here as routes ship.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
