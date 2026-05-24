/**
 * FILE: src/components/blog/BlogCard.tsx
 *
 * COMPONENT: BlogCard
 *
 * PURPOSE:
 * - Displays editorial post previews using the shared blog model
 * - Keeps blog UI independent from the temporary local data layer so a CMS swap does not require component rewrites
 *
 * NOTES:
 * - Styling stays intentionally light and non-card-based
 * - Variant rendering supports index, tag, and future CMS-backed listing surfaces
 */
import { Link } from "@/i18n/navigation";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { routes } from "@/config/routes";
import type { AppLocale } from "@/i18n/routing";
import { formatPostDate } from "@/lib/blog/formatPostDate";
import type { Post } from "@/lib/sanity/types";

type BlogCardVariant = "latest" | "archive";

type BlogCardProps = {
  post: Post;
  locale: AppLocale;
  variant?: BlogCardVariant;
};

export function BlogCard({
  post,
  locale,
  variant = "latest",
}: BlogCardProps) {
  const formattedDate = formatPostDate(post.publishedAt, locale);
  const metadata = [formattedDate, post.readingTime].filter(Boolean).join(" • ");

  if (variant === "archive") {
    return (
      <Link
        href={routes.blogPost(post.slug)}
        className="flex items-baseline justify-between gap-4 border-t border-border/50 py-4 transition-opacity duration-200 hover:opacity-70"
      >
        <h3 className="text-sm font-medium leading-snug">{post.title}</h3>
        <p className="shrink-0 text-xs text-muted-foreground">
          {formattedDate}
        </p>
      </Link>
    );
  }

  return (
    <article className="border-t border-border/50 py-8 first:border-t-0 first:pt-0">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <Link
            href={routes.blogPost(post.slug)}
            className="block space-y-3 transition-opacity duration-200 hover:opacity-75"
          >
            <h3 className="text-2xl font-semibold tracking-[-0.02em] text-foreground">
              {post.title}
            </h3>

            <p className="text-sm text-muted-foreground">
              {metadata}
            </p>

            <p className="max-w-2xl text-sm leading-6 text-foreground/85">
              {post.excerpt}
            </p>
          </Link>

          <div className="flex flex-wrap gap-x-3 gap-y-2 text-xs text-muted-foreground">
            {post.allTags.map((tag) => (
              <Link
                key={tag}
                href={routes.blogTag(tag)}
                className="transition-colors duration-200 hover:text-foreground"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        {post.coverImage ? (
          <Link
            href={routes.blogPost(post.slug)}
            className="order-first overflow-hidden rounded-sm md:order-none md:w-32 md:shrink-0"
          >
            <EditorialImage
              src={post.coverImage}
              alt={post.coverImageAlt || post.title}
              width={160}
              height={120}
              imageClassName="h-24 w-full object-cover md:h-20"
            />
          </Link>
        ) : null}
      </div>
    </article>
  );
}
