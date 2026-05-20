import "server-only";

/**
 * PURPOSE:
 * Creates the authenticated Sanity client used only for draft-mode reads.
 *
 * NOTES:
 * - `server-only` prevents accidental client bundling of the preview token path.
 * - Preview fetches bypass the CDN and use `drafts` perspective so editors see
 *   unpublished changes immediately after enabling draft mode.
 */
import { createClient } from "next-sanity";
import {
  isSanityConfigured,
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
} from "@/lib/sanity/env";
import { sanityReadToken } from "@/lib/sanity/serverEnv";

export function getPreviewSanityClient() {
  if (!isSanityConfigured() || !sanityReadToken) {
    return null;
  }

  return createClient({
    projectId: sanityProjectId,
    dataset: sanityDataset,
    apiVersion: sanityApiVersion,
    useCdn: false,
    perspective: "drafts",
    stega: false,
    token: sanityReadToken,
  });
}
