import { Link } from "@/i18n/navigation";
import { routes } from "@/config/routes";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { getSanityImageUrl } from "@/lib/sanity/image";
import type { PortableTextResourceCard } from "../types";

type ResourceCardProps = {
  value: PortableTextResourceCard;
};

function isInternalHref(href: string) {
  return href.startsWith("/") || href.startsWith("#");
}

export function ResourceCard({ value }: ResourceCardProps) {
  const href =
    value.isExternal === false
      ? value.linkedPost?.slug
        ? routes.blogPost(value.linkedPost.slug)
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

