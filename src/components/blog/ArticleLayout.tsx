/**
 * FILE: src/components/blog/ArticleLayout.tsx
 *
 * COMPONENT: ArticleLayout
 *
 * PURPOSE:
 * - Defines the stable reading layout for long-form articles
 * - Keeps typography concerns separate from route logic
 * - Remains independent from the temporary local data source so article rendering can survive a CMS migration unchanged
 *
 * NOTES:
 * - Prioritizes readability over visual flourish
 * - Stays generic so CMS-driven rich content can fit later
 */
import type { ReactNode } from "react";
import Image from "next/image";

import { formatPostDate } from "@/lib/blog/formatPostDate";
import { Link } from "@/i18n/navigation";
import {
  getSanityImageDimensions,
  isPortraitImage,
  type SanityImageValue,
} from "@/lib/sanity/image";

type ArticleLayoutProps = {
  title: string;
  date?: string | null;
  locale?: string;
  readingTime?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageData?: SanityImageValue;
  excerpt?: string;
  tags?: string[];
  children: ReactNode;
};

export function ArticleLayout({
  title,
  date,
  locale = "en",
  readingTime,
  imageSrc,
  imageAlt,
  imageData,
  excerpt,
  tags,
  children,
}: ArticleLayoutProps) {
  const portraitCover = isPortraitImage(imageData);
  const coverDimensions = getSanityImageDimensions(imageData);
  const formattedDate = formatPostDate(date, locale);
  const metadata = [formattedDate, readingTime].filter(Boolean).join(" • ");

  return (
    <article className="mx-auto max-w-[720px] space-y-6 px-4 pt-24 pb-12">
      <header className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-[-0.025em] leading-snug">
          {title}
        </h1>
        {metadata ? (
          <p className="text-sm text-muted-foreground/80 tracking-tight mt-1">
            {metadata}
          </p>
        ) : null}
        {excerpt && (
          <p className="text-base text-foreground/70 leading-relaxed max-w-[640px]">
            {excerpt}
          </p>
        )}
      </header>
      {imageSrc && (
        <div
          className={
            portraitCover
              ? "mx-auto mt-4 max-w-[460px] overflow-hidden rounded-[var(--radius-sm)] border border-border-token"
              : "mt-4 overflow-hidden rounded-[var(--radius-sm)] border border-border-token"
          }
        >
          <Image
            src={imageSrc}
            alt={imageAlt || title}
            width={coverDimensions?.width || 1200}
            height={coverDimensions?.height || 630}
            className={
              portraitCover
                ? "max-h-[70vh] w-full object-contain"
                : "max-h-[560px] w-full object-cover"
            }
          />
        </div>
      )}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog/tag/${encodeURIComponent(tag)}`}
              className="text-xs px-2 py-1 rounded-full text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      <div className="space-y-4 leading-7 text-[15px] text-foreground/90 mt-4 [&>p:first-child]:text-[17px] [&>p:first-child]:leading-8 [&>p:first-child]:font-medium">
        {children}
      </div>
    </article>
  );
}
