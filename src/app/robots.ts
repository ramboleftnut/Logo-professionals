import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/services/success", "/services/cancel", "/admin", "/api/"],
    },
    sitemap: "https://digitalnectar.space/sitemap.xml",
  };
}
