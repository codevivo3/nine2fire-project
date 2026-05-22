import type { MetadataRoute } from "next";
import { getProductionSiteUrl, isProduction } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
      host: getProductionSiteUrl(),
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    host: getProductionSiteUrl(),
  };
}

