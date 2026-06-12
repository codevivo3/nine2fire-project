import type { PortableTextComponents } from "@portabletext/react";
import { Link } from "@/i18n/navigation";
import type { PortableTextLinkValue } from "../types";

type PortableTextMarkRenderers = NonNullable<PortableTextComponents["marks"]>;

const highlightClassName =
  "rounded-[0.2rem] bg-accent-token/18 px-1.5 py-[1px] font-medium text-[color:var(--color-highlight-text)]";

function isInternalHref(href: string) {
  return href.startsWith("/") || href.startsWith("#");
}

const sharedMarks = {
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-foreground">{children}</em>,
  underline: ({ children }) => (
    <span className="underline decoration-accent-token/55 underline-offset-[0.18em]">
      {children}
    </span>
  ),
  highlight: ({ children }) => (
    <span className={highlightClassName}>{children}</span>
  ),
  smallNote: ({ children }) => (
    <span className="text-[0.95em] uppercase tracking-[0.12em] text-muted-foreground">
      {children}
    </span>
  ),
} satisfies PortableTextMarkRenderers;

export const noteMarks: PortableTextMarkRenderers = {
  ...sharedMarks,
  muted: ({ children }) => (
    <span className="text-foreground/60">{children}</span>
  ),
};

export const marks: PortableTextMarkRenderers = {
  ...sharedMarks,
  muted: ({ children }) => (
    <span className="text-foreground/62">{children}</span>
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
};
