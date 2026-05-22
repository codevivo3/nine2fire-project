/**
 * PURPOSE:
 * Centralizes deployment-environment checks and URL resolution for Vercel.
 *
 * NOTES:
 * - `VERCEL_ENV` is the source of truth on Vercel: `production`, `preview`,
 *   or `development`.
 * - Canonical SEO signals must always point at the public production domain,
 *   even when the request is served from a preview deployment.
 * - Preview and localhost flows still need a runtime origin so Sanity draft
 *   preview redirects land back on the current deployment host.
 */

const PRODUCTION_SITE_URL = "https://www.nine2fire.com";
const LOCAL_DEVELOPMENT_URL = "http://localhost:3000";

export type VercelEnvironment = "production" | "preview" | "development";

function readEnv(name: string) {
  const value = process.env[name]?.trim();

  return value ? value : undefined;
}

function normalizeOrigin(value: string) {
  const normalizedValue =
    value.startsWith("http://") || value.startsWith("https://")
      ? value
      : `https://${value}`;

  return new URL(normalizedValue).origin;
}

function resolveVercelEnvironment(): VercelEnvironment {
  const value = readEnv("VERCEL_ENV");

  if (value === "production" || value === "preview" || value === "development") {
    return value;
  }

  if (process.env.NODE_ENV === "development") {
    return "development";
  }

  return "production";
}

export const vercelEnv = resolveVercelEnvironment();
export const isProduction = vercelEnv === "production";
export const isPreview = vercelEnv === "preview";
export const isDevelopment = vercelEnv === "development";

export function getProductionSiteUrl() {
  return PRODUCTION_SITE_URL;
}

export function getProductionSiteOrigin() {
  return normalizeOrigin(PRODUCTION_SITE_URL);
}

export function getDeploymentSiteOrigin() {
  const explicitSiteUrl = readEnv("NEXT_PUBLIC_SITE_URL");

  if (explicitSiteUrl) {
    return normalizeOrigin(explicitSiteUrl);
  }

  const vercelUrl = readEnv("VERCEL_URL");

  if (vercelUrl) {
    return normalizeOrigin(vercelUrl);
  }

  return LOCAL_DEVELOPMENT_URL;
}

export function getRequestOrigin(request: Request) {
  return new URL(request.url).origin;
}

