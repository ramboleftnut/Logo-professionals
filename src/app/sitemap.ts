import { MetadataRoute } from "next";
import { portfolioItems } from "@/lib/data";

const BASE = "https://thelogoprofessionals.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, priority: 1.0, changeFrequency: "monthly" },
    { url: `${BASE}/logo-design`, priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE}/logo-design/order`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/our-clients`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/about-us`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/about-us/niko-dola`, priority: 0.6, changeFrequency: "yearly" },
    { url: `${BASE}/about-us/alekxa-dola`, priority: 0.6, changeFrequency: "yearly" },
    { url: `${BASE}/about-us/igor-dola`, priority: 0.6, changeFrequency: "yearly" },
    { url: `${BASE}/contact-us`, priority: 0.7, changeFrequency: "yearly" },
  ];

  const portfolioRoutes: MetadataRoute.Sitemap = portfolioItems.map((item) => ({
    url: `${BASE}/portfolio/${item.slug}`,
    priority: 0.6,
    changeFrequency: "yearly",
  }));

  return [...staticRoutes, ...portfolioRoutes];
}
