/**
 * FILE: src/app/[locale]/blog/tag/[tag]/page.tsx
 *
 * PAGE: Blog Tag Archive
 *
 * ROUTE:
 * - /[locale]/blog/tag/[tag]
 *
 * PURPOSE:
 * - Renders a localized archive for a single blog tag
 * - Keeps tag filtering in the route layer while remaining independent from the temporary local data source
 *
 * NOTES:
 * - This route is designed to keep working when posts move from local data to Sanity
 * - Shared list components stay data-source agnostic
 */
import { setRequestLocale } from "next-intl/server";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { BlogList } from "@/components/blog/BlogList";
import { routing, type AppLocale } from "@/i18n/routing";
import { getSanityPosts } from "@/lib/sanity/fetch";

type BlogTagPageProps = {
  params: Promise<{ locale: AppLocale; tag: string }>;
};

export async function generateStaticParams() {
  const localizedParams = await Promise.all(
    routing.locales.map(async (locale) => {
      const tags = new Set<string>();
      const posts = await getSanityPosts(locale);

      posts.forEach((post) => {
        post.allTags.forEach((tag) => tags.add(tag));
      });

      return Array.from(tags).map((tag) => ({
        locale,
        tag,
      }));
    }),
  );

  return localizedParams.flat();
}

export default async function BlogTagPage({ params }: BlogTagPageProps) {
  const { locale, tag } = await params;
  const { isEnabled: isDraftMode } = await draftMode();
  setRequestLocale(locale);

  const normalizedTag = tag;
  const taggedPosts = (
    await getSanityPosts(locale, { preview: isDraftMode })
  ).filter((post) =>
    post.allTags.some(
      (postTag) => postTag.toLowerCase() === normalizedTag.toLowerCase(),
    ),
  );

  if (!taggedPosts.length) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl space-y-10 px-4 py-16 md:px-6 md:py-24">
      <header className="space-y-4 border-b border-border/50 pb-6">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Tag Archive
        </p>
        <h1 className="text-4xl font-semibold tracking-[-0.04em] text-foreground md:text-5xl">
          #{normalizedTag}
        </h1>
        <p className="text-sm text-muted-foreground">
          {taggedPosts.length} {taggedPosts.length === 1 ? "entry" : "entries"}
        </p>
      </header>

      <BlogList posts={taggedPosts} locale={locale} variant="latest" />
    </main>
  );
}
