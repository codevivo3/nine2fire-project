/**
 * FILE: src/app/[locale]/blog/[slug]/page.tsx
 *
 * PAGE: Blog Article
 *
 * ROUTE:
 * - /[locale]/blog/[slug]
 *
 * PURPOSE:
 * - Renders a single article from the shared blog data layer
 * - Keeps the route compatible with a future CMS-backed implementation
 *
 * NOTES:
 * - The current data source is temporary local data
 * - Article rendering should remain stable when the source moves to Sanity
 */
import { draftMode } from "next/headers";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { PortableTextContent } from "@/components/blog/PortableTextContent";
import { routing, type AppLocale } from "@/i18n/routing";
import type { Metadata } from "next";
import { getProductionSiteUrl } from "@/lib/env";
import { getSanityPostBySlug, getSanityPosts } from "@/lib/sanity/fetch";

type BlogPostPageProps = {
  params: Promise<{ locale: AppLocale; slug: string }>;
};

export async function generateStaticParams() {
  const localizedParams = await Promise.all(
    routing.locales.map(async (locale) => {
      const posts = await getSanityPosts(locale);

      return posts.map((post) => ({
        locale,
        slug: post.slug,
      }));
    }),
  );

  return localizedParams.flat();
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const { isEnabled: isDraftMode } = await draftMode();
  const post = await getSanityPostBySlug(slug, locale, { preview: isDraftMode });

  if (!post) {
    return {};
  }

  const productionArticleUrl =
    post.canonicalUrl || `${getProductionSiteUrl()}/${locale}/blog/${post.slug}`;

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    // Canonical and Open Graph URLs stay on the production domain so preview
    // deployments cannot leak branch URLs into search indexes or social shares.
    alternates: {
      canonical: productionArticleUrl,
    },
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      url: productionArticleUrl,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: post.ogImage ? [{ url: post.ogImage, alt: post.coverImageAlt || post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: post.ogImage ? [post.ogImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  const { isEnabled: isDraftMode } = await draftMode();
  setRequestLocale(locale);

  const post = await getSanityPostBySlug(slug, locale, { preview: isDraftMode });

  if (!post) {
    notFound();
  }

  return (
    <ArticleLayout
      title={post.title}
      date={post.publishedAt}
      locale={locale}
      readingTime={post.readingTime}
      imageSrc={post.coverImage}
      imageAlt={post.coverImageAlt}
      imageData={post.coverImageData}
      excerpt={post.excerpt}
      tags={post.allTags}
    >
      <div className="mt-6 space-y-4 max-w-[680px]">
        <PortableTextContent value={post.body} locale={locale} />
      </div>
    </ArticleLayout>
  );
}
