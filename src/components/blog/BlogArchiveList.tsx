
'use client';

/**
 * COMPONENT: BlogArchiveList
 *
 * PURPOSE:
 * - Renders the Journal 'Latest' section.
 * - Shows only the first 3 non-featured posts initially.
 * - Reveals older posts inline when the archive CTA is activated.
 *
 * NOTES:
 * - Featured post selection happens in the server page.
 * - This component only manages archive expansion state.
 * - No routing or data fetching occurs here.
 */

import { useEffect, useId, useRef, useState } from 'react';
import type { AppLocale } from '@/i18n/routing';
import type { Post } from '@/lib/sanity/types';
import { BlogList } from './BlogList';

type BlogArchiveListProps = {
  locale: AppLocale;
  latestPosts: Post[];
  archivePosts: Post[];
  latestLabel: string;
  archiveLabel: string;
  archiveCtaLabel: string;
  sectionLabelClassName: string;
};

export function BlogArchiveList({
  locale,
  latestPosts,
  archivePosts,
  latestLabel,
  archiveLabel,
  archiveCtaLabel,
  sectionLabelClassName,
}: BlogArchiveListProps) {
  const [showArchive, setShowArchive] = useState(false);
  const archiveId = useId();
  const archiveRef = useRef<HTMLDivElement | null>(null);

  // After expanding the archive, gently move the user
  // to the newly revealed section.
  useEffect(() => {
    if (!showArchive || !archiveRef.current) {
      return;
    }

    archiveRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [showArchive]);

  // Nothing to render if there are no non-featured posts.
  if (latestPosts.length === 0) {
    return null;
  }

  return (
    <>
      <section className='space-y-6 mt-48 2xl:mt-72'>
        <div className='flex items-center justify-between gap-4 border-b border-border/50 pb-4'>
          <h2 className={sectionLabelClassName}>{latestLabel}</h2>
        </div>

        <BlogList posts={latestPosts} locale={locale} variant='latest' />

        {/* Inline archive expansion.
            We intentionally avoid a separate archive route
            and keep the Journal page as the canonical archive. */}
        {!showArchive && archivePosts.length > 0 ? (
          <div className='pt-1'>
            <button
              type='button'
              aria-expanded={showArchive}
              aria-controls={archiveId}
              onClick={() => setShowArchive(true)}
              className='link-highlight link-highlight--archive relative inline-block text-sm font-semibold text-[color:var(--color-fg)] transition-colors duration-200'
            >
              <span>{archiveCtaLabel}</span>
            </button>
          </div>
        ) : null}
      </section>

      {/* Revealed archive section containing all posts
          older than the initial 3 latest entries. */}
      {showArchive && archivePosts.length > 0 ? (
        <section id={archiveId} ref={archiveRef} className='space-y-6'>
          <div className='flex items-center justify-between gap-4 mt-32 2xl:mt-40'>
            <h2 className={sectionLabelClassName}>{archiveLabel}</h2>
          </div>

          <div className='-mt-2'>
            <BlogList posts={archivePosts} locale={locale} variant='archive' />
          </div>
        </section>
      ) : null}
    </>
  );
}
