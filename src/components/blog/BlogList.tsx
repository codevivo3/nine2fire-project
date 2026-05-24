/**
 * FILE: src/components/blog/BlogList.tsx
 *
 * COMPONENT: BlogList
 *
 * PURPOSE:
 * - Renders editorial blog lists from the shared `Post` model
 * - Keeps route files independent from the temporary local data source and ready for a future CMS
 */
import type { Post } from "@/lib/sanity/types";
import type { AppLocale } from "@/i18n/routing";
import { BlogCard } from "./BlogCard";

type BlogListProps = {
  posts: Post[];
  locale: AppLocale;
  variant?: "latest" | "archive";
};

export function BlogList({
  posts,
  locale,
  variant = "latest",
}: BlogListProps) {
  return (
    <div>
      {posts.map((post) => (
        <BlogCard
          key={post.slug}
          post={post}
          locale={locale}
          variant={variant}
        />
      ))}
    </div>
  );
}
