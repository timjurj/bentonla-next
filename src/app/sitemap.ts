import { MetadataRoute } from "next";
import businessData from "@/data/businesses.json";
import { categories } from "@/data/categories";
import type { Business } from "@/types/business";

const businesses = businessData as Business[];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.bentonla.com";

  const home = [{ url: base, lastModified: new Date(), priority: 1.0, changeFrequency: "weekly" as const }];

  const catPages = categories.map((cat) => ({
    url: `${base}/${cat.slug}`,
    lastModified: new Date(),
    priority: 0.9,
    changeFrequency: "weekly" as const,
  }));

  const bizPages = businesses
    .filter((b) => b.is_active)
    .map((biz) => ({
      url: `${base}/business/${biz.slug}`,
      lastModified: new Date(),
      priority: 0.7,
      changeFrequency: "monthly" as const,
    }));

  return [...home, ...catPages, ...bizPages];
}