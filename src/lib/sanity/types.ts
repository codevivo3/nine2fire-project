import type { SanityImageValue } from "@/lib/sanity/image";

export type PortableTextContent = unknown[];

export type Post = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  body: PortableTextContent;
  publishedAt: string;
  updatedAt?: string;
  coverImage?: string;
  coverImageAlt?: string;
  coverImageData?: SanityImageValue;
  ogImage?: string;
  ogImageData?: SanityImageValue;
  readingTime?: string;
  tags: string[];
  customTags: string[];
  allTags: string[];
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  author?: string;
  language?: string;
  relatedPosts?: Post[];
};

export type SanityPostDocument = {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  body?: PortableTextContent;
  publishedAt: string;
  updatedAt?: string;
  readingTime?: string;
  tags?: string[];
  customTags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  coverImage?: SanityImageValue;
  coverImageAlt?: string;
  ogImage?: SanityImageValue;
  author?: string;
  language?: string;
  relatedPosts?: Array<{
    _id: string;
    slug: string;
    title: string;
    excerpt: string;
    publishedAt: string;
    readingTime?: string;
    tags?: string[];
    customTags?: string[];
    coverImage?: SanityImageValue;
    coverImageAlt?: string;
  }>;
};
