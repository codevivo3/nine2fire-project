import type { DocumentActionComponent } from "sanity";

type PreviewLocale = "en" | "it";

type LocalizedSlugField = Partial<Record<PreviewLocale, { current?: string }>>;

type PreviewablePostDocument = {
  slug?: LocalizedSlugField;
};

type PreviewActionContext = {
  draft: unknown;
  published: unknown;
};

function asPreviewablePostDocument(value: unknown): PreviewablePostDocument | null {
  return value && typeof value === "object" ? (value as PreviewablePostDocument) : null;
}

function getLocalizedSlug(
  context: PreviewActionContext,
  locale: PreviewLocale,
) {
  const draftDocument = asPreviewablePostDocument(context.draft);
  const publishedDocument = asPreviewablePostDocument(context.published);

  return (
    draftDocument?.slug?.[locale]?.current?.trim() ||
    publishedDocument?.slug?.[locale]?.current?.trim() ||
    ""
  );
}

function buildPreviewUrl(locale: PreviewLocale, slug: string) {
  if (!slug) {
    return null;
  }

  // Keep the launch URL relative to the current Studio host so preview actions
  // automatically follow localhost, preview deployments, or production.
  return `/api/studio/launch-preview?locale=${encodeURIComponent(locale)}&slug=${encodeURIComponent(slug)}`;
}

function getDisabledReason(locale: PreviewLocale, slug: string) {
  if (slug) {
    return undefined;
  }

  return locale === "en"
    ? "English preview is disabled because slug.en.current is missing."
    : "Italian preview is disabled because slug.it.current is missing.";
}

function createPostPreviewAction(
  locale: PreviewLocale,
  label: string,
): DocumentActionComponent {
  const PostPreviewAction: DocumentActionComponent = (props) => {
    const slug = getLocalizedSlug(
      { draft: props.draft, published: props.published },
      locale,
    );
    const previewUrl = buildPreviewUrl(locale, slug);
    const disabledReason = getDisabledReason(locale, slug);

    return {
      label,
      title: disabledReason || label,
      disabled: !previewUrl,
      onHandle: () => {
        if (previewUrl) {
          window.open(previewUrl, "_blank", "noopener,noreferrer");
        }

        props.onComplete();
      },
    };
  };

  return PostPreviewAction;
}

export const openEnglishPreviewAction = createPostPreviewAction(
  "en",
  "Open English Preview",
);

export const openItalianPreviewAction = createPostPreviewAction(
  "it",
  "Open Italian Preview",
);
