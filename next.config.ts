import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

const wrappedConfig = withNextIntl(nextConfig);

if (typeof wrappedConfig.webpack === "function") {
  const originalWebpack = wrappedConfig.webpack;

  wrappedConfig.webpack = (config, context) => {
    const normalizedConfig = config ?? {};

    if (typeof normalizedConfig.context !== "string" || !normalizedConfig.context) {
      normalizedConfig.context = process.cwd();
    }

    return originalWebpack(normalizedConfig, context);
  };
}

export default wrappedConfig;
