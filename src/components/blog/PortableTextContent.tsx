import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { Link } from "@/i18n/navigation";
import { BlogCard } from "@/components/blog/BlogCard";
import { EditorialImage } from "@/components/ui/EditorialImage";
import type { PortableTextContent as PortableTextValue, Post } from "@/lib/sanity/types";
import {
  getSanityImageDimensions,
  getSanityImageUrl,
  isPortraitImage,
  type SanityImageValue,
} from "@/lib/sanity/image";

type PortableTextContentProps = {
  value: PortableTextValue;
  locale?: string;
};

type PortableTextLinkValue = {
  href?: string;
  openInNewTab?: boolean;
};

type PortableTextImageBlock = {
  image?: SanityImageValue;
  alt?: string;
  caption?: string;
  size?: "small" | "medium" | "full";
  align?: "left" | "right" | "center";
};

type PortableTextNoteBlock = {
  title?: string;
  body?: PortableTextValue;
  tone?: "neutral" | "insight" | "warning";
};

type PortableTextQuoteBlock = {
  quote?: string;
  attribution?: string;
};

type PortableTextResourceCard = {
  title?: string;
  description?: string;
  image?: SanityImageValue;
  imageAlt?: string;
  url?: string;
  label?: string;
  category?: string;
  isExternal?: boolean;
  linkedPost?: {
    slug?: string;
    title?: string;
  };
};

type PortableTextChartBlock = {
  title?: string;
  description?: string;
  sourceLabel?: string;
};

type PortableTextSuggestedReadings = {
  title?: string;
  intro?: string;
  posts?: Post[];
  resources?: PortableTextResourceCard[];
};

function isInternalHref(href: string) {
  return href.startsWith("/") || href.startsWith("#");
}

function ResourceCard({
  value,
}: {
  value: PortableTextResourceCard;
}) {
  const href =
    value.isExternal === false
      ? value.linkedPost?.slug
        ? `/blog/${value.linkedPost.slug}`
        : undefined
      : value.url;

  if (!href) {
    return null;
  }

  const imageUrl = getSanityImageUrl(value.image, 960, 720);
  const internal = isInternalHref(href);
  const content = (
    <div className="grid gap-5 md:grid-cols-[160px_minmax(0,1fr)] md:items-center">
      {imageUrl ? (
        <div className="overflow-hidden rounded-[var(--radius-sm)] border border-border-token bg-surface/80">
          <EditorialImage
            src={imageUrl}
            alt={value.imageAlt || value.title || ""}
            width={960}
            height={720}
            imageClassName="h-40 w-full object-cover md:h-28"
          />
        </div>
      ) : null}

      <div className="min-w-0 space-y-2">
        {value.category ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-eyebrow-token">
            {value.category}
          </p>
        ) : null}

        {value.title ? (
          <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
            {value.title}
          </h3>
        ) : null}

        {value.description ? (
          <p className="text-sm leading-6 text-foreground/75">
            {value.description}
          </p>
        ) : null}

        {value.label ? (
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {value.label}
            {value.isExternal === false ? "" : " ->"}
          </p>
        ) : null}
      </div>
    </div>
  );

  if (internal) {
    return (
      <Link
        href={href}
        className="block rounded-[var(--radius-lg)] border border-border-token bg-surface/70 p-5 transition-all duration-300 ease-out hover:bg-surface/85 hover:shadow-[var(--shadow-soft)]"
      >
        {content}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="block rounded-[var(--radius-lg)] border border-border-token bg-surface/70 p-5 transition-all duration-300 ease-out hover:bg-surface/85 hover:shadow-[var(--shadow-soft)]"
    >
      {content}
    </a>
  );
}

function PortableTextEditorialImage({ value }: { value: PortableTextImageBlock }) {
  const imageUrl = getSanityImageUrl(value.image, 1400, 1400);

  if (!imageUrl || !value.image) {
    return null;
  }

  const dimensions = getSanityImageDimensions(value.image);
  const portrait = isPortraitImage(value.image);
  const size = value.size || "medium";
  const align = value.align || "center";

  const containerClassName =
    size === "small"
      ? align === "left"
        ? "w-full md:mr-auto md:max-w-[340px]"
        : align === "right"
          ? "w-full md:ml-auto md:max-w-[340px]"
          : "w-full md:mx-auto md:max-w-[340px]"
      : size === "full"
        ? portrait
          ? "mx-auto w-full max-w-[520px]"
          : "mx-auto w-full max-w-[920px]"
        : portrait
          ? "mx-auto w-full max-w-[460px]"
          : "mx-auto w-full max-w-[720px]";

  return (
    <figure className={`my-10 ${containerClassName}`}>
      <div className="overflow-hidden rounded-[var(--radius-sm)] border border-border-token bg-surface/70">
        <EditorialImage
          src={imageUrl}
          alt={value.alt || ""}
          width={dimensions?.width || 1400}
          height={dimensions?.height || 1200}
          imageClassName={
            portrait
              ? "max-h-[70vh] w-full object-contain"
              : "max-h-[560px] w-full object-cover"
          }
        />
      </div>
      {value.caption ? (
        <figcaption className="mt-3 text-sm leading-6 text-muted-foreground">
          {value.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function PortableTextContent({
  value,
  locale = "en",
}: PortableTextContentProps) {
  const noteComponents: PortableTextComponents = {
    block: {
      normal: ({ children }) => (
        <p className="text-sm leading-7 text-foreground/85">{children}</p>
      ),
    },
    marks: {
      strong: ({ children }) => (
        <strong className="font-semibold text-foreground">{children}</strong>
      ),
      muted: ({ children }) => (
        <span className="text-foreground/60">{children}</span>
      ),
      highlight: ({ children }) => (
        <span className="bg-accent-token/12 px-1 py-[1px] text-foreground">
          {children}
        </span>
      ),
      smallNote: ({ children }) => (
        <span className="text-[0.95em] uppercase tracking-[0.12em] text-muted-foreground">
          {children}
        </span>
      ),
    },
  };

  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => (
        <p className="text-[15px] leading-7 text-foreground/90">{children}</p>
      ),
      sectionHeading: ({ children }) => (
        <h2 className="pt-6 text-2xl font-semibold tracking-[-0.03em] text-foreground md:text-3xl">
          {children}
        </h2>
      ),
    },
    marks: {
      strong: ({ children }) => (
        <strong className="font-semibold text-foreground">{children}</strong>
      ),
      muted: ({ children }) => (
        <span className="text-foreground/62">{children}</span>
      ),
      highlight: ({ children }) => (
        <span className="bg-accent-token/12 px-1 py-[1px] text-foreground">
          {children}
        </span>
      ),
      smallNote: ({ children }) => (
        <span className="text-[0.95em] uppercase tracking-[0.12em] text-muted-foreground">
          {children}
        </span>
      ),
      link: ({ children, value }) => {
        const linkValue = value as PortableTextLinkValue;

        if (!linkValue?.href) {
          return <>{children}</>;
        }

        if (isInternalHref(linkValue.href)) {
          return (
            <Link
              href={linkValue.href}
              className="underline decoration-border-token underline-offset-4 transition-colors duration-200 hover:text-accent-token"
            >
              {children}
            </Link>
          );
        }

        return (
          <a
            href={linkValue.href}
            target={linkValue.openInNewTab ? "_blank" : undefined}
            rel={linkValue.openInNewTab ? "noreferrer" : undefined}
            className="underline decoration-border-token underline-offset-4 transition-colors duration-200 hover:text-accent-token"
          >
            {children}
          </a>
        );
      },
    },
    types: {
      imageBlock: ({ value }) => <PortableTextEditorialImage value={value as PortableTextImageBlock} />,
      noteBlock: ({ value }) => {
        const note = value as PortableTextNoteBlock;
        const toneClassName =
          note.tone === "insight"
            ? "border-accent-token/30 bg-accent-token/6"
            : note.tone === "warning"
              ? "border-foreground/20 bg-surface/95"
              : "border-border-token bg-surface/75";

        return (
          <aside className={`my-10 rounded-[var(--radius-lg)] border p-5 md:p-6 ${toneClassName}`}>
            {note.title ? (
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent-eyebrow-token">
                {note.title}
              </h3>
            ) : null}

            {note.body ? <PortableText value={note.body} components={noteComponents} /> : null}
          </aside>
        );
      },
      quoteBlock: ({ value }) => {
        const quote = value as PortableTextQuoteBlock;

        return (
          <figure className="my-10 border-l border-border-token pl-5 md:pl-6">
            {quote.quote ? (
              <blockquote className="text-xl leading-8 tracking-[-0.02em] text-foreground/88">
                {quote.quote}
              </blockquote>
            ) : null}
            {quote.attribution ? (
              <figcaption className="mt-4 text-sm uppercase tracking-[0.18em] text-muted-foreground">
                {quote.attribution}
              </figcaption>
            ) : null}
          </figure>
        );
      },
      resourceCard: ({ value }) => (
        <div className="my-10">
          <ResourceCard value={value as PortableTextResourceCard} />
        </div>
      ),
      chartPlaceholder: ({ value }) => {
        const chart = value as PortableTextChartBlock;

        return (
          <div className="my-10 rounded-[var(--radius-lg)] border border-dashed border-border-token bg-surface/60 p-5 md:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-eyebrow-token">
              Chart placeholder
            </p>
            {chart.title ? (
              <h3 className="mt-3 text-lg font-semibold tracking-[-0.02em] text-foreground">
                {chart.title}
              </h3>
            ) : null}
            {chart.description ? (
              <p className="mt-3 text-sm leading-6 text-foreground/75">
                {chart.description}
              </p>
            ) : null}
            {chart.sourceLabel ? (
              <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {chart.sourceLabel}
              </p>
            ) : null}
          </div>
        );
      },
      suggestedReadings: ({ value }) => {
        const readings = value as PortableTextSuggestedReadings;

        return (
          <section className="my-14 space-y-6 border-t border-border-token pt-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
                {readings.title || "Suggested readings"}
              </h2>
              {readings.intro ? (
                <p className="max-w-2xl text-sm leading-6 text-foreground/72">
                  {readings.intro}
                </p>
              ) : null}
            </div>

            {readings.posts?.length ? (
              <div className="space-y-2">
                {readings.posts.map((post) => (
                  <BlogCard
                    key={post.slug}
                    post={post}
                    locale={locale}
                    variant="archive"
                  />
                ))}
              </div>
            ) : null}

            {readings.resources?.length ? (
              <div className="grid gap-4">
                {readings.resources.map((resource, index) => (
                  <ResourceCard
                    key={`${resource.title || "resource"}-${index}`}
                    value={resource}
                  />
                ))}
              </div>
            ) : null}
          </section>
        );
      },
    },
  };

  return <PortableText value={value} components={components} />;
}
