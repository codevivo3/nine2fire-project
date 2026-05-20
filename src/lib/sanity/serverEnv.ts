import "server-only";

function readEnv(name: string) {
  const value = process.env[name]?.trim();

  return value ? value : undefined;
}

/**
 * Server-only values for authenticated preview reads and draft mode entry.
 * Keep these out of browser bundles and client-facing Sanity utilities.
 */
export const sanityReadToken = readEnv("SANITY_API_READ_TOKEN");
export const sanityPreviewSecret = readEnv("SANITY_PREVIEW_SECRET") || "";

export function hasSanityPreviewAccess() {
  return Boolean(sanityPreviewSecret && sanityReadToken);
}
