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

import { formatPostDate } from "@/lib/blog/formatPostDate";
import { Link } from "@/i18n/navigation";
import { routes } from "@/config/routes";
import type { AppLocale } from "@/i18n/routing";
import { EditorialImage } from "@/components/ui/EditorialImage";
import {
  getSanityImageDimensions,
  isPortraitImage,
  type SanityImageValue,
} from "@/lib/sanity/image";

type ArticleLayoutProps = {
  title: string;
  date?: string | null;
  locale: AppLocale;
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
  locale,
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
    <article className="mx-auto max-w-[720px] space-y-8 px-4 pb-12 pt-24">
      <header className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-[-0.025em] leading-snug">
          {title}
        </h1>
        {excerpt && (
          <p className="max-w-[640px] text-lg leading-relaxed text-foreground/70 md:text-xl">
            {excerpt}
          </p>
        )}
        {metadata ? (
          <p className="mt-1 text-sm tracking-tight text-muted-foreground/80">
            {metadata}
          </p>
        ) : null}
      </header>
      {imageSrc && (
        <div
          className={
            portraitCover
              ? "mx-auto max-w-[460px] overflow-hidden rounded-[var(--radius-sm)] border border-border-token"
              : "overflow-hidden rounded-[var(--radius-sm)] border border-border-token"
          }
        >
          <EditorialImage
            src={imageSrc}
            alt={imageAlt || title}
            width={coverDimensions?.width || 1200}
            height={coverDimensions?.height || 630}
            imageClassName={
              portraitCover
                ? "max-h-[70vh] w-full object-contain"
                : "max-h-[560px] w-full object-cover"
            }
          />
        </div>
      )}
      {tags && tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={routes.blogTag(tag)}
              className="text-xs px-2 py-1 rounded-full text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-2 space-y-4 text-[15px] leading-7 text-foreground/90 [&>p:first-child]:text-[17px] [&>p:first-child]:leading-8 [&>p:first-child]:font-medium">
        {children}
      </div>
    </article>
  );
}
