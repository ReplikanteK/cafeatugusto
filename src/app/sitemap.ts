import type { MetadataRoute } from "next";
import { COMPARATIVES } from "@/data/comparatives";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://cafeatugusto.vercel.app";
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/recomendador`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/catalogo`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/comparativas`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/metodologia`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/afiliados`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
  const compRoutes: MetadataRoute.Sitemap = COMPARATIVES.map((c) => ({
    url: `${base}/comparativas/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  return [...staticRoutes, ...compRoutes];
}
