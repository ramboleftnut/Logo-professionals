import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/logo-design/order/success", "/logo-design/order/cancel", "/api/"],
    },
    sitemap: "https://thelogoprofessionals.com/sitemap.xml",
  };
}
