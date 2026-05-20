import { createClient } from "next-sanity";
import {
  isSanityConfigured,
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
  sanityReadToken,
} from "@/lib/sanity/env";

type SanityClientOptions = {
  preview?: boolean;
};

export function getSanityClient(options: SanityClientOptions = {}) {
  if (!isSanityConfigured()) {
    return null;
  }

  const { preview = false } = options;

  return createClient({
    projectId: sanityProjectId,
    dataset: sanityDataset,
    apiVersion: sanityApiVersion,
    useCdn: !preview,
    perspective: preview ? "drafts" : "published",
    stega: false,
    token: preview ? sanityReadToken : undefined,
  });
}

export const sanityClient = getSanityClient();
