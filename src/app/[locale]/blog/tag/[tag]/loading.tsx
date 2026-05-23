import { BlogCardSkeleton } from "@/components/blog/BlogCardSkeleton";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

export default function BlogTagLoading() {
  return (
    <main
      aria-busy="true"
      className="mx-auto max-w-4xl space-y-10 px-4 py-16 md:px-6 md:py-24"
    >
      <span className="sr-only">Loading tagged articles.</span>

      <div aria-hidden="true">
        <header className="space-y-4 border-b border-border/50 pb-6">
          <SkeletonBlock className="h-3 w-24 rounded-full" />
          <SkeletonBlock className="h-12 w-56 max-w-[70%]" />
          <SkeletonBlock className="h-4 w-24 rounded-full" />
        </header>

        <div>
          <BlogCardSkeleton />
          <BlogCardSkeleton />
          <BlogCardSkeleton showImage={false} />
          <BlogCardSkeleton />
        </div>
      </div>
    </main>
  );
}
