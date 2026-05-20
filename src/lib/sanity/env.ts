const fallbackDataset = "production";
const fallbackStudioTitle = "Nine2Fire Studio";

export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const sanityDataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || fallbackDataset;
export const sanityApiVersion =
  process.env.SANITY_API_VERSION || "2026-05-19";
export const sanityStudioTitle =
  process.env.SANITY_STUDIO_PROJECT_TITLE || fallbackStudioTitle;
export const sanityReadToken = process.env.SANITY_API_READ_TOKEN;
export const sanityPreviewSecret = process.env.SANITY_PREVIEW_SECRET || "";

export function isSanityConfigured() {
  return Boolean(sanityProjectId && sanityDataset);
}
