import "server-only";

function readEnv(name: string) {
  const value = process.env[name]?.trim();

  return value ? value : undefined;
}

/**
 * Server-only values for authenticated preview reads and draft mode entry.
 * `SANITY_PREVIEW_SECRET` protects the preview route, and
 * `SANITY_REVALIDATE_SECRET` protects the content revalidation webhook, and
 * `SANITY_API_READ_TOKEN` is reserved for server-side draft reads only.
 * Keep these out of browser bundles and client-facing Sanity utilities.
 */
export const sanityReadToken = readEnv("SANITY_API_READ_TOKEN");
export const sanityPreviewSecret = readEnv("SANITY_PREVIEW_SECRET") || "";
export const sanityRevalidateSecret = readEnv("SANITY_REVALIDATE_SECRET") || "";

export function hasSanityPreviewAccess() {
  return Boolean(sanityPreviewSecret && sanityReadToken);
}
