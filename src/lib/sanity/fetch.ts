import "server-only";

/**
 * PURPOSE:
 * Centralizes all frontend-facing Sanity reads for the blog surface.
 *
 * NOTES:
 * - This layer is where the app decides between published content and draft
 *   content; page components should only signal intent via `preview`.
 * - Published reads are cached and tagged for ISR-style freshness.
 * - Draft reads bypass caches and require the authenticated preview client.
 */
import { unstable_cache } from "next/cache";
import { POSTS_QUERY, POST_BY_SLUG_QUERY, POST_SLUGS_QUERY } from "@/lib/sanity/queries";
import { sanityClient } from "@/lib/sanity/client";
import { isSanityConfigured } from "@/lib/sanity/env";
import { getPreviewSanityClient } from "@/lib/sanity/previewClient";
import type { Post, SanityPostDocument } from "@/lib/sanity/types";
import { getSanityImageUrl } from "@/lib/sanity/image";
import type { AppLocale } from "@/i18n/routing";

type SanityFetchOptions = {
  preview?: boolean;
};

async function devDelay() {
  // TODO: Remove this temporary delay after skeleton loader QA is complete.
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}

function mergePostTags(tags?: string[], customTags?: string[]) {
  return Array.from(new Set([...(tags || []), ...(customTags || [])]));
}

function mapSanityPost(document: SanityPostDocument): Post {
  const tags = document.tags || [];
  const customTags = document.customTags || [];

  return {
    id: document._id,
    slug: document.slug,
    title: document.title,
    excerpt: document.excerpt,
    body: document.body || [],
    publishedAt: document.publishedAt,
    updatedAt: document.updatedAt,
    readingTime: document.readingTime,
    tags,
    customTags,
    allTags: mergePostTags(tags, customTags),
    seoTitle: document.seoTitle,
    seoDescription: document.seoDescription,
    canonicalUrl: document.canonicalUrl,
    coverImage: getSanityImageUrl(document.coverImage, 1600, 1200),
    coverImageAlt: document.coverImageAlt,
    coverImageData: document.coverImage,
    ogImage: getSanityImageUrl(document.ogImage || document.coverImage, 1600, 900),
    ogImageData: document.ogImage || document.coverImage,
    author: document.author,
    language: document.language,
    relatedPosts: (document.relatedPosts || []).map((post) => {
      const relatedTags = post.tags || [];
      const relatedCustomTags = post.customTags || [];

      return {
        id: post._id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        body: [],
        publishedAt: post.publishedAt,
        readingTime: post.readingTime,
        tags: relatedTags,
        customTags: relatedCustomTags,
        allTags: mergePostTags(relatedTags, relatedCustomTags),
        coverImage: getSanityImageUrl(post.coverImage, 800, 600),
        coverImageAlt: post.coverImageAlt,
        coverImageData: post.coverImage,
      };
    }),
  };
}

const getCachedSanityPosts = unstable_cache(
  async (locale: AppLocale) => {
    if (!sanityClient) {
      return [] as Post[];
    }

    const documents = await sanityClient.fetch<SanityPostDocument[]>(POSTS_QUERY, {
      locale,
    });

    // Normalize Sanity documents once so route components consume a stable app model.
    return documents.map(mapSanityPost);
  },
  ["sanity-posts"],
  {
    revalidate: 60,
    tags: ["sanity:post"],
  },
);

const getCachedSanitySlugs = unstable_cache(
  async (locale: AppLocale) => {
    if (!sanityClient) {
      return [] as { slug: string }[];
    }

    return sanityClient.fetch<{ slug: string }[]>(POST_SLUGS_QUERY, { locale });
  },
  ["sanity-post-slugs"],
  {
    revalidate: 60,
    tags: ["sanity:post"],
  },
);

async function getPreviewSanityPosts(locale: AppLocale) {
  const previewClient = getPreviewSanityClient();

  if (!previewClient) {
    return [] as Post[];
  }

  const documents = await previewClient.fetch<SanityPostDocument[]>(
    POSTS_QUERY,
    { locale },
    // Draft mode should always reflect the latest editor state.
    { cache: "no-store" },
  );

  return documents.map(mapSanityPost);
}

export async function getSanityPosts(
  locale: AppLocale,
  options: SanityFetchOptions = {},
) {
  if (!isSanityConfigured()) {
    return [];
  }

  if (options.preview) {
    // Draft mode must use authenticated preview reads instead of the cached client.
    await devDelay();
    return getPreviewSanityPosts(locale);
  }

  await devDelay();
  return getCachedSanityPosts(locale);
}

export async function getSanityPostBySlug(
  slug: string,
  locale: AppLocale,
  options: SanityFetchOptions = {},
) {
  if (!isSanityConfigured()) {
    return undefined;
  }

  const client = options.preview ? getPreviewSanityClient() : sanityClient;

  if (!client) {
    return undefined;
  }

  await devDelay();

  const fetchOptions = options.preview
    ? {
        // Slug-level preview reads must bypass caches for authoring feedback.
        cache: "no-store" as const,
      }
    : {
        next: {
          revalidate: 60,
          tags: [`sanity:post:${locale}:${slug}`, "sanity:post"],
        },
      };

  const document = await client.fetch<SanityPostDocument | null>(
    POST_BY_SLUG_QUERY,
    { slug, locale },
    fetchOptions,
  );

  return document ? mapSanityPost(document) : undefined;
}

export async function getSanityPostSlugs(locale: AppLocale) {
  if (!isSanityConfigured()) {
    return [];
  }

  return getCachedSanitySlugs(locale);
}
