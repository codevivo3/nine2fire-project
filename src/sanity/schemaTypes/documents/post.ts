import { defineArrayMember, defineField, defineType } from "sanity";
import { postTagOptions } from "@/sanity/schemaTypes/options/postTags";

export const postType = defineType({
  name: "post",
  title: "Post",
  type: "document",
  groups: [
    { name: "editorial", title: "Editorial", default: true },
    { name: "body", title: "Body" },
    { name: "seo", title: "SEO" },
    { name: "future", title: "Future-ready" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localeString",
      group: "editorial",
      description: "Public article title shown on the website and article page.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "localeSlug",
      group: "editorial",
      description:
        "Localized URL paths generated from the translated titles. Editors should only override them when necessary.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "localeText",
      group: "editorial",
      description:
        "Short editorial summary used in blog cards, previews, and article introduction.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      group: "editorial",
      description: "Public publication date used for article ordering and display.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Updated at",
      type: "datetime",
      group: "editorial",
      description: "Optional update timestamp for revised articles.",
    }),
    defineField({
      name: "readingTime",
      title: "Reading time",
      type: "string",
      group: "editorial",
      description: "Estimated reading duration displayed near publication date.",
      validation: (Rule) =>
        Rule.required().regex(/^\d+\s?min$/i, {
          name: "reading time",
          invert: false,
        }),
    }),
    defineField({
      name: "tags",
      title: "Suggested tags",
      type: "array",
      group: "editorial",
      description: "Choose from the predefined reusable tag list.",
      of: [defineArrayMember({ type: "string" })],
      validation: (Rule) => Rule.required().min(1),
      options: {
        list: postTagOptions,
      },
    }),
    defineField({
      name: "customTags",
      title: "Custom tags",
      type: "array",
      group: "editorial",
      description: "Optional. Add extra tags only when none of the suggested tags fit.",
      of: [
        defineArrayMember({
          type: "string",
          validation: (Rule) =>
            Rule.custom((value) => {
              if (typeof value !== "string") {
                return true;
              }

              return /^[a-z0-9]+(?: [a-z0-9]+)*$/.test(value)
                ? true
                : "Tags must be lowercase, human-readable, and use spaces instead of kebab-case.";
            }),
        }),
      ],
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      group: "editorial",
      description: "Main article image used for hero section and article cards.",
      options: {
        hotspot: true,
        metadata: ["lqip", "palette", "blurhash"],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coverImageAlt",
      title: "Cover image alt",
      type: "localeString",
      group: "editorial",
      description: "Required accessibility and SEO description for the cover image.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body content",
      type: "localePortableText",
      group: "body",
      description:
        "Structured article body using editorial text blocks, media, notes, quotes, resources, and suggested readings.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "seoTitle",
      title: "SEO title",
      type: "localeString",
      group: "seo",
      description:
        "Search engine and social media title. Can differ slightly from article title.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "localeText",
      group: "seo",
      description:
        "Short SEO description for search engines and previews (recommended ~150 chars).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL",
      type: "url",
      group: "seo",
      description:
        "Use only if this article references or mirrors another canonical source.",
      validation: (Rule) =>
        Rule.uri({
          allowRelative: false,
          scheme: ["http", "https"],
        }),
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph image",
      type: "image",
      group: "seo",
      description:
        "Optional custom social sharing image. Falls back to cover image if omitted.",
      options: {
        hotspot: true,
        metadata: ["lqip", "palette", "blurhash"],
      },
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      group: "future",
      description:
        "Future-ready field for author attribution. Keep simple for now unless editorial ownership changes.",
    }),
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      group: "future",
      description:
        "Future-ready language marker for multilingual publishing. Defaults to the current editorial language.",
      initialValue: "en",
      options: {
        list: [
          { title: "English", value: "en" },
          { title: "Italian", value: "it" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "relatedPosts",
      title: "Related posts",
      type: "array",
      group: "future",
      description:
        "Future-ready internal references for related readings. Add only when useful editorial relationships exist.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "post" }],
          options: {
            disableNew: true,
          },
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: "Publish date, new",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title.en",
      subtitle: "publishedAt",
      media: "coverImage",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? `Published ${subtitle}` : "Unscheduled",
        media,
      };
    },
  },
});
