import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

export function ArticleSkeleton() {
  return (
    <article
      aria-hidden="true"
      className="mx-auto max-w-[720px] space-y-6 px-4 pt-24 pb-12"
    >
      <header className="space-y-4">
        <div className="space-y-3">
          <SkeletonBlock className="h-10 w-[88%] max-w-[640px]" />
          <SkeletonBlock className="h-10 w-[72%] max-w-[520px]" />
        </div>
        <SkeletonBlock className="h-4 w-40 rounded-full" />
        <div className="space-y-2">
          <SkeletonBlock className="h-5 w-full max-w-[640px]" />
          <SkeletonBlock className="h-5 w-[78%] max-w-[520px]" />
        </div>
      </header>

      <SkeletonBlock className="mt-4 aspect-[16/9] w-full rounded-[var(--radius-sm)] border border-border-token" />

      <div className="flex flex-wrap gap-2 mt-4">
        <SkeletonBlock className="h-7 w-16 rounded-full" />
        <SkeletonBlock className="h-7 w-20 rounded-full" />
        <SkeletonBlock className="h-7 w-14 rounded-full" />
      </div>

      <div className="mt-10 space-y-4">
        <SkeletonBlock className="h-5 w-full" />
        <SkeletonBlock className="h-5 w-[94%]" />
        <SkeletonBlock className="h-5 w-[98%]" />
        <SkeletonBlock className="h-5 w-[90%]" />
        <SkeletonBlock className="h-5 w-[96%]" />
        <SkeletonBlock className="h-5 w-[85%]" />
        <SkeletonBlock className="h-5 w-[92%]" />
        <SkeletonBlock className="h-5 w-[76%]" />
      </div>
    </article>
  );
}
