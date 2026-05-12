import { MetadataRoute } from "next";
import { getTeam, getPosts } from "@/lib/content";

const BASE = "https://thelogoprofessionals.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [team, posts] = await Promise.all([
    getTeam(),
    getPosts({ publishedOnly: true }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, priority: 1.0, changeFrequency: "monthly" },
    { url: `${BASE}/services`, priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE}/our-clients`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/about-us`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/contact-us`, priority: 0.7, changeFrequency: "yearly" },
    { url: `${BASE}/blog`, priority: 0.7, changeFrequency: "weekly" },
  ];

  const teamRoutes: MetadataRoute.Sitemap = team.map((m) => ({
    url: `${BASE}/about-us/${m.slug}`,
    priority: 0.6,
    changeFrequency: "yearly",
  }));

  const portfolioRoutes: MetadataRoute.Sitemap = posts
    .filter((p) => p.type === "portfolio")
    .map((p) => ({ url: `${BASE}/portfolio/${p.slug}`, priority: 0.6, changeFrequency: "yearly" }));

  const blogRoutes: MetadataRoute.Sitemap = posts
    .filter((p) => p.type === "blog")
    .map((p) => ({ url: `${BASE}/blog/${p.slug}`, priority: 0.6, changeFrequency: "monthly" }));

  return [...staticRoutes, ...teamRoutes, ...portfolioRoutes, ...blogRoutes];
}
