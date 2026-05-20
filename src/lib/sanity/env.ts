/**
 * Public Sanity environment contract.
 *
 * Only `NEXT_PUBLIC_SANITY_*` values belong in this module so browser-safe
 * Sanity helpers never pull in server-only secrets by accident.
 */

function readEnv(name: string) {
  const value = process.env[name]?.trim();

  return value ? value : undefined;
}

export const sanityProjectId = readEnv("NEXT_PUBLIC_SANITY_PROJECT_ID") || "";
export const sanityDataset = readEnv("NEXT_PUBLIC_SANITY_DATASET") || "";
export const sanityApiVersion = readEnv("NEXT_PUBLIC_SANITY_API_VERSION") || "";

export function isSanityConfigured() {
  return Boolean(sanityProjectId && sanityDataset && sanityApiVersion);
}
