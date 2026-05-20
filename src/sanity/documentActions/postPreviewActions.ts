import type { DocumentActionComponent } from "sanity";
import { sanityPreviewSecret } from "@/lib/sanity/env";

type PreviewLocale = "en" | "it";

type LocalizedSlugField = Partial<Record<PreviewLocale, { current?: string }>>;

type PreviewablePostDocument = {
  slug?: LocalizedSlugField;
};

function getPreviewDocument(
  draft: unknown,
  published: unknown,
): PreviewablePostDocument | null {
  if (draft && typeof draft === "object") {
    return draft as PreviewablePostDocument;
  }

  if (published && typeof published === "object") {
    return published as PreviewablePostDocument;
  }

  return null;
}

function getLocalizedSlug(
  document: PreviewablePostDocument | null,
  locale: PreviewLocale,
) {
  return document?.slug?.[locale]?.current?.trim() || "";
}

function buildPreviewUrl(locale: PreviewLocale, slug: string) {
  if (!sanityPreviewSecret || !slug) {
    return null;
  }

  const previewPath = `/${locale}/blog/${slug}`;

  return `/${locale}/api/studio/preview?secret=${encodeURIComponent(sanityPreviewSecret)}&slug=${encodeURIComponent(previewPath)}`;
}

function createPostPreviewAction(
  locale: PreviewLocale,
  label: string,
): DocumentActionComponent {
  const PostPreviewAction: DocumentActionComponent = (props) => {
    const document = getPreviewDocument(props.draft, props.published);
    const slug = getLocalizedSlug(document, locale);
    const previewUrl = buildPreviewUrl(locale, slug);

    return {
      label,
      title: label,
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
