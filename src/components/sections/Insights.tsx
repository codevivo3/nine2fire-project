/**
 * PURPOSE:
 * Presents the latest localized editorial content on the homepage.
 *
 * NOTES:
 * - This section reads only published content because it is part of the public
 *   landing page surface.
 * - The slice happens here instead of inside the Sanity fetch layer so other
 *   routes can reuse the full post list without homepage assumptions.
 */
import { getTranslations } from "next-intl/server";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";
import { Container } from "@/components/ui/Container";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { routes } from "@/config/routes";
import { sectionAnchorOffsets } from "@/config/sectionAnchors";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { getSanityPosts } from "@/lib/sanity/fetch";

type InsightsProps = {
  locale: AppLocale;
};

export function InsightsSkeleton() {
  return (
    <section id='insights' className={sectionAnchorOffsets.insights}>
      <Container className='py-16 md:py-24'>
        <div aria-hidden='true' className='mt-10 grid gap-4 md:mt-12 md:grid-cols-3'>
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard
              key={index}
              className='p-6 backdrop-blur-md'
            >
              <SkeletonBlock className='aspect-square w-full rounded-[var(--radius-md)] border border-border-token bg-surface/60' />
              <div className='mt-5 flex items-center justify-between gap-4'>
                <SkeletonBlock className='h-3 w-20 rounded-full' />
                <SkeletonBlock className='h-3 w-14 rounded-full' />
              </div>
              <div className='mt-6 space-y-3'>
                <SkeletonBlock className='h-8 w-[88%]' />
                <SkeletonBlock className='h-8 w-[72%]' />
              </div>
              <div className='mt-4 space-y-2'>
                <SkeletonBlock className='h-4 w-full' />
                <SkeletonBlock className='h-4 w-[90%]' />
                <SkeletonBlock className='h-4 w-[76%]' />
              </div>
            </SkeletonCard>
          ))}
        </div>
      </Container>
    </section>
  );
}

export async function Insights({ locale }: InsightsProps) {
  const t = await getTranslations({ locale, namespace: "Insights" });
  const posts = (await getSanityPosts(locale)).slice(0, 3);

  return (
    <section id='insights' className={sectionAnchorOffsets.insights}>
      <Container className='py-16 md:py-24'>
        <SectionHeader
          eyebrow={t('eyebrow')}
          title={t('title')}
          description={t('description')}
        />

        <div className='mt-10 grid gap-4 md:mt-12 md:grid-cols-3'>
          {posts.slice(0, 3).map((post) => (
            <Link
              key={post.slug}
              href={routes.blogPost(post.slug)}
              className='group block rounded-[var(--radius-lg)] border border-border-token bg-surface/80 p-6 backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-surface/90 hover:shadow-[var(--shadow-soft)] hover:-translate-y-[2px]'
            >
              <div className='relative aspect-square overflow-hidden rounded-[var(--radius-md)] border border-border-token bg-surface/60'>
                {post.coverImage && (
                  <EditorialImage
                    src={post.coverImage}
                    alt={post.coverImageAlt || post.title}
                    fill
                    sizes='(min-width: 768px) 33vw, 100vw'
                    imageClassName='object-cover transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]'
                  />
                )}
              </div>
              <div className='mt-5 flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted'>
                <span className='text-accent-eyebrow-token'>{t('eyebrow')}</span>
                <span>{post.readingTime}</span>
              </div>
              <h3 className='mt-6 text-2xl font-bold leading-tight tracking-[-0.035em] text-foreground'>
                <span className='relative block w-full after:absolute after:left-0 after:-bottom-1.5 after:h-px after:w-0 after:bg-current after:transition-all after:duration-500 after:ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:after:w-full'>
                  {post.title}
                </span>
              </h3>
              <p className='mt-4 text-sm leading-7 text-foreground/72 group-hover:text-foreground'>
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
