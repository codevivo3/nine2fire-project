/**
 * FILE: src/app/[locale]/blog/page.tsx
 *
 * PAGE: Blog Index
 *
 * ROUTE:
 * - /[locale]/blog
 *
 * PURPOSE:
 * - Lists the available blog posts using a featured, latest, and archive editorial hierarchy
 * - Acts as the localized entry point for long-form content while staying independent from the temporary local data source
 *
 * NOTES:
 * - This route is designed to keep working when local data is replaced by Sanity
 * - Presentation logic stays here and in shared blog components, not in the storage layer
 */
import type { Metadata } from "next";
import { draftMode } from 'next/headers';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BlogList } from '@/components/blog/BlogList';
import { EditorialImage } from '@/components/ui/EditorialImage';
import { ScrollCue } from '@/components/ui/ScrollCue';
import { Link } from '@/i18n/navigation';
import { formatPostDate } from '@/lib/blog/formatPostDate';
import type { AppLocale } from '@/i18n/routing';
import { BLOG_SEO_DESCRIPTION, buildPageMetadata } from '@/lib/metadata';
import { getSanityPosts } from '@/lib/sanity/fetch';

type BlogPageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export function generateMetadata(): Metadata {
  return buildPageMetadata("Blog", BLOG_SEO_DESCRIPTION);
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  const { isEnabled: isDraftMode } = await draftMode();
  setRequestLocale(locale);
  const t = await getTranslations('Blog');

  const posts = await getSanityPosts(locale, { preview: isDraftMode });
  const [featuredPost, ...remainingPosts] = posts;
  const latestPosts = remainingPosts.slice(0, 3);
  const archivePosts = remainingPosts.slice(3);
  const featuredPostDate = featuredPost
    ? formatPostDate(featuredPost.publishedAt, locale)
    : "";
  const featuredPostMetadata = [featuredPostDate, featuredPost?.readingTime]
    .filter(Boolean)
    .join(" • ");

  const sectionLabelClassName =
    'pl-[4px] text-sm font-semibold uppercase tracking-[0.18em] text-accent-eyebrow-token opacity-90';

  return (
    <main className='mx-auto max-w-5xl space-y-20 px-4 py-16 md:px-6 md:py-24 2xl:mt-8'>
      <header className='relative max-w-3xl space-y-4 pt-20 md:pt-28 pb-16'>
        <p className={sectionLabelClassName}>{t('eyebrow')}</p>
        <h1 className='whitespace-break-spaces text-4xl font-semibold tracking-[-0.04em] text-foreground md:text-6xl'>
          {t('title')}
        </h1>
        <p className='whitespace-break-spaces max-w-xl text-sm leading-6 text-muted-foreground/70'>
          {t('description')}
        </p>
      </header>
      <div className='block -mt-20 sm:-mt-18 lg:-mt-16 xl:-mt-14 2xl:hidden'>
        <ScrollCue />
      </div>

      {featuredPost ? (
        <section className='space-y-6 2xl:mt-40'>
          <div className='flex items-center justify-between gap-4 border-b border-border/50 pb-4'>
            <h2 className={sectionLabelClassName}>{t('sections.featured')}</h2>
          </div>

          <article className='grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_280px] lg:items-start'>
            <div className='space-y-5'>
              {featuredPostMetadata ? (
                <p className='text-sm text-muted-foreground'>
                  {featuredPostMetadata}
                </p>
              ) : null}

              <Link
                href={`/blog/${featuredPost.slug}`}
                className='block space-y-5 transition-opacity duration-200 hover:opacity-80'
              >
                <h2 className='max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-foreground md:text-5xl'>
                  {featuredPost.title}
                </h2>

                <p className='max-w-2xl text-base leading-7 text-foreground/85'>
                  {featuredPost.excerpt}
                </p>
              </Link>

              <div className='flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground'>
                {featuredPost.allTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${encodeURIComponent(tag)}`}
                    className='transition-colors duration-200 hover:text-foreground'
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            {featuredPost.coverImage ? (
              <Link
                href={`/blog/${featuredPost.slug}`}
                className='overflow-hidden rounded-sm'
              >
                <EditorialImage
                  src={featuredPost.coverImage}
                  alt={featuredPost.coverImageAlt || featuredPost.title}
                  width={560}
                  height={420}
                  imageClassName='h-full w-full object-cover'
                  priority
                />
              </Link>
            ) : null}
          </article>
          <div className='hidden 2xl:flex justify-center mt-12'>
            <ScrollCue />
          </div>
        </section>
      ) : null}

      {latestPosts.length ? (
        <section className='space-y-6 mt-48 2xl:mt-72'>
          <div className='flex items-center justify-between gap-4 border-b border-border/50 pb-4'>
            <h2 className={sectionLabelClassName}>{t('sections.latest')}</h2>
          </div>

          <BlogList posts={latestPosts} locale={locale} variant='latest' />
        </section>
      ) : null}

      {archivePosts.length ? (
        <section className='space-y-6'>
          <div className='flex items-center justify-between gap-4 mt-32 2xl:mt-40'>
            <h2 className={sectionLabelClassName}>{t('sections.archive')}</h2>
          </div>

          <div className="-mt-2">
            <BlogList posts={archivePosts} locale={locale} variant='archive' />
          </div>
        </section>
      ) : null}
    </main>
  );
}
