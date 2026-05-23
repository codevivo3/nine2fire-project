import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

type BlogCardSkeletonProps = {
  variant?: "latest" | "archive";
  showImage?: boolean;
};

export function BlogCardSkeleton({
  variant = "latest",
  showImage = true,
}: BlogCardSkeletonProps) {
  if (variant === "archive") {
    return (
      <div
        aria-hidden="true"
        className="flex items-baseline justify-between gap-4 border-t border-border/50 py-4"
      >
        <SkeletonBlock className="h-4 w-[52%] max-w-sm" />
        <SkeletonBlock className="h-3 w-20 shrink-0 rounded-full" />
      </div>
    );
  }

  return (
    <article
      aria-hidden="true"
      className="border-t border-border/50 py-8 first:border-t-0 first:pt-0"
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <SkeletonBlock className="h-4 w-36 rounded-full" />
          <SkeletonBlock className="h-8 w-[78%] max-w-2xl" />
          <div className="space-y-2">
            <SkeletonBlock className="h-4 w-full max-w-2xl" />
            <SkeletonBlock className="h-4 w-[88%] max-w-xl" />
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-2 pt-1">
            <SkeletonBlock className="h-5 w-16 rounded-full" />
            <SkeletonBlock className="h-5 w-20 rounded-full" />
            <SkeletonBlock className="h-5 w-14 rounded-full" />
          </div>
        </div>

        {showImage ? (
          <SkeletonBlock className="order-first h-24 w-full rounded-sm md:order-none md:h-20 md:w-32 md:shrink-0" />
        ) : null}
      </div>
    </article>
  );
}
