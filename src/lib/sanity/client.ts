/**
 * PURPOSE:
 * Creates the public Sanity client used by server-rendered pages.
 *
 * NOTES:
 * - This client is intentionally safe to share with any published page fetch.
 * - It never receives preview credentials and is pinned to `published`
 *   perspective so draft content cannot leak through a default import.
 */
import { createClient } from "next-sanity";
import {
  isSanityConfigured,
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
} from "@/lib/sanity/env";

export function getSanityClient() {
  if (!isSanityConfigured()) {
    return null;
  }

  return createClient({
    projectId: sanityProjectId,
    dataset: sanityDataset,
    apiVersion: sanityApiVersion,
    useCdn: true,
    perspective: "published",
    stega: false,
  });
}

// Shared singleton for the published-content path used across the app router.
export const sanityClient = getSanityClient();
