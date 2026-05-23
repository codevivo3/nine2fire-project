import { ArticleSkeleton } from "@/components/blog/ArticleSkeleton";

export default function BlogPostLoading() {
  return (
    <main aria-busy="true" data-page-surface="article">
      <span className="sr-only">Loading article.</span>
      <ArticleSkeleton />
    </main>
  );
}
