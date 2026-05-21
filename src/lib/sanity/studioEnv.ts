function readEnv(name: string) {
  const value = process.env[name]?.trim();

  return value ? value : undefined;
}

const fallbackStudioTitle = "Nine2Fire Studio";
const fallbackSanityProjectId = "5sw09zfb";
const fallbackSanityDataset = "production";
const fallbackSanityApiVersion = "2026-05-19";

const resolvedProjectId =
  readEnv("SANITY_STUDIO_PROJECT_ID") ||
  readEnv("NEXT_PUBLIC_SANITY_PROJECT_ID") ||
  fallbackSanityProjectId;
const resolvedDataset =
  readEnv("SANITY_STUDIO_DATASET") ||
  readEnv("NEXT_PUBLIC_SANITY_DATASET") ||
  fallbackSanityDataset;
const resolvedApiVersion =
  readEnv("SANITY_STUDIO_API_VERSION") ||
  readEnv("NEXT_PUBLIC_SANITY_API_VERSION") ||
  fallbackSanityApiVersion;

if (!resolvedProjectId) {
  throw new Error(
    "Missing Sanity project ID. Set NEXT_PUBLIC_SANITY_PROJECT_ID in Vercel and redeploy.",
  );
}

if (process.env.NODE_ENV === "development") {
  console.info("[sanity:studio-env]", {
    hasProjectId: true,
    dataset: resolvedDataset,
    apiVersion: resolvedApiVersion,
  });
}

/**
 * Embedded Studio and Sanity CLI prefer their dedicated env vars, but the
 * browser bundle must be able to fall back to `NEXT_PUBLIC_SANITY_*`.
 */
export const sanityStudioProjectId = resolvedProjectId;
export const sanityStudioDataset = resolvedDataset;
export const sanityStudioApiVersion = resolvedApiVersion;
export const sanityStudioTitle =
  readEnv("SANITY_STUDIO_PROJECT_TITLE") || fallbackStudioTitle;
