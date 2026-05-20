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
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { getSanityPosts } from "@/lib/sanity/fetch";

type InsightsProps = {
  locale: AppLocale;
};

export async function Insights({ locale }: InsightsProps) {
  const t = await getTranslations("Insights");
  const posts = (await getSanityPosts(locale)).slice(0, 3);

  return (
    <section id='insights' className='scroll-mt-20 md:scroll-mt-24'>
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
              href={`/blog/${post.slug}`}
              className='group block rounded-[var(--radius-lg)] border border-border-token bg-surface/80 p-6 backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-surface/90 hover:shadow-[var(--shadow-soft)] hover:-translate-y-[2px]'
            >
              <div className='relative aspect-square overflow-hidden rounded-[var(--radius-md)] border border-border-token bg-surface/60'>
                {post.coverImage && (
                  <Image
                    src={post.coverImage}
                    alt={post.coverImageAlt || post.title}
                    fill
                    sizes='(min-width: 768px) 33vw, 100vw'
                    className='object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]'
                  />
                )}
              </div>
              <div className='mt-5 flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted'>
                <span className='text-accent-eyebrow-token'>Journal</span>
                <span>{post.readingTime}</span>
              </div>
              <h3 className='mt-6 text-2xl font-bold leading-tight tracking-[-0.035em] text-foreground'>
                <span className='relative inline bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-[length:100%_1px]'>
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
