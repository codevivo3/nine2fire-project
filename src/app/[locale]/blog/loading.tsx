import { BlogCardSkeleton } from "@/components/blog/BlogCardSkeleton";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

export default function BlogLoading() {
  const sectionLabelClassName =
    "pl-[4px] text-sm font-semibold uppercase tracking-[0.18em] text-accent-eyebrow-token opacity-90";

  return (
    <main
      aria-busy="true"
      className="mx-auto max-w-5xl space-y-20 px-4 py-16 md:px-6 md:py-24 2xl:mt-8"
    >
      <span className="sr-only">Loading blog content.</span>

      <div aria-hidden="true">
        <header className="relative max-w-3xl space-y-4 pt-20 md:pt-28 pb-16">
          <SkeletonBlock className={`h-4 w-20 rounded-full ${sectionLabelClassName}`} />
          <div className="space-y-3">
            <SkeletonBlock className="h-12 w-[72%] max-w-[520px]" />
            <SkeletonBlock className="h-12 w-[58%] max-w-[420px]" />
          </div>
          <div className="space-y-2">
            <SkeletonBlock className="h-4 w-full max-w-xl" />
            <SkeletonBlock className="h-4 w-[82%] max-w-lg" />
          </div>
        </header>

        <section className="space-y-6 2xl:mt-40">
          <div className="flex items-center justify-between gap-4 border-b border-border/50 pb-4">
            <h2 className={sectionLabelClassName}>Featured</h2>
          </div>

          <article className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_280px] lg:items-start">
            <div className="space-y-5">
              <SkeletonBlock className="h-4 w-40 rounded-full" />
              <div className="space-y-3">
                <SkeletonBlock className="h-11 w-[82%] max-w-3xl" />
                <SkeletonBlock className="h-11 w-[68%] max-w-2xl" />
              </div>
              <div className="space-y-2">
                <SkeletonBlock className="h-5 w-full max-w-2xl" />
                <SkeletonBlock className="h-5 w-[90%] max-w-xl" />
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                <SkeletonBlock className="h-5 w-14 rounded-full" />
                <SkeletonBlock className="h-5 w-20 rounded-full" />
                <SkeletonBlock className="h-5 w-16 rounded-full" />
              </div>
            </div>

            <SkeletonBlock className="aspect-[4/3] w-full rounded-sm" />
          </article>
        </section>

        <section className="space-y-6 mt-48 2xl:mt-72">
          <div className="flex items-center justify-between gap-4 border-b border-border/50 pb-4">
            <h2 className={sectionLabelClassName}>Latest</h2>
          </div>

          <div>
            <BlogCardSkeleton />
            <BlogCardSkeleton />
            <BlogCardSkeleton showImage={false} />
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between gap-4 mt-32 2xl:mt-40">
            <h2 className={sectionLabelClassName}>Archive</h2>
          </div>

          <div className="-mt-2">
            <BlogCardSkeleton variant="archive" />
            <BlogCardSkeleton variant="archive" />
            <BlogCardSkeleton variant="archive" />
            <BlogCardSkeleton variant="archive" />
          </div>
        </section>
      </div>
    </main>
  );
}
