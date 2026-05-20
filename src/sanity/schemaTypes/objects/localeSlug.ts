import { defineField, defineType, type SanityDocument } from "sanity";

type LocalizedTitleDocument = SanityDocument & {
  title?: {
    en?: string;
    it?: string;
  };
};

export const localeSlugType = defineType({
  name: "localeSlug",
  title: "Localized slug",
  type: "object",
  fields: [
    defineField({
      name: "en",
      title: "English slug",
      type: "slug",
      description: "English URL segment used on `/en/blog/...` routes.",
      options: {
        source: (document) =>
          (document as LocalizedTitleDocument).title?.en || "",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "it",
      title: "Italian slug",
      type: "slug",
      description: "Italian URL segment used on `/it/blog/...` routes.",
      options: {
        source: (document) => {
          const localizedDocument = document as LocalizedTitleDocument;

          return localizedDocument.title?.it || localizedDocument.title?.en || "";
        },
        maxLength: 96,
      },
    }),
  ],
});
