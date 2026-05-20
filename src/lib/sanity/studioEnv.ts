function readEnv(name: string) {
  const value = process.env[name]?.trim();

  return value ? value : undefined;
}

const fallbackStudioTitle = "Nine2Fire Studio";

/**
 * Embedded Studio and Sanity CLI should use their dedicated env vars instead
 * of reusing the frontend's public runtime contract.
 */
export const sanityStudioProjectId = readEnv("SANITY_STUDIO_PROJECT_ID") || "";
export const sanityStudioDataset = readEnv("SANITY_STUDIO_DATASET") || "";
export const sanityStudioApiVersion =
  readEnv("SANITY_STUDIO_API_VERSION") || "";
export const sanityStudioTitle =
  readEnv("SANITY_STUDIO_PROJECT_TITLE") || fallbackStudioTitle;
