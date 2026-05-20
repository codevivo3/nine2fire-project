import { defineField, defineType } from "sanity";

export const resourceCardType = defineType({
  name: "resourceCard",
  title: "Resource card",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Editorial title for the resource, book, tool, article, or reference.",
      validation: (Rule) => Rule.required().min(4).max(120),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Short explanation of why this resource matters in the article context.",
      validation: (Rule) => Rule.required().min(20).max(220),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      description: "Optional visual for the resource card. Reuse assets when appropriate.",
      options: {
        hotspot: true,
        metadata: ["lqip", "palette", "blurhash"],
      },
    }),
    defineField({
      name: "imageAlt",
      title: "Image alt",
      type: "string",
      description: "Accessibility description for the resource image when one is used.",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document && context.parent && (context.parent as { image?: unknown }).image && !value) {
            return "Image alt is required when an image is added.";
          }

          return true;
        }),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      description: "Destination URL for external resources.",
      validation: (Rule) =>
        Rule.uri({
          allowRelative: false,
          scheme: ["http", "https"],
        }),
      hidden: ({ parent }) => Boolean((parent as { isExternal?: boolean })?.isExternal === false),
    }),
    defineField({
      name: "linkedPost",
      title: "Linked post",
      type: "reference",
      to: [{ type: "post" }],
      description: "Internal article reference when the card points to content in this publication.",
      options: {
        disableNew: true,
      },
      hidden: ({ parent }) => Boolean((parent as { isExternal?: boolean })?.isExternal !== false),
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: "Short CTA label such as Read, Explore, Buy, or Reference.",
      initialValue: "Explore",
      validation: (Rule) => Rule.required().max(30),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description: "Optional concise category such as Book, Tool, Reference, or Article.",
    }),
    defineField({
      name: "isExternal",
      title: "External destination",
      type: "boolean",
      description: "Turn on for external links. Turn off to link this card to an internal post.",
      initialValue: true,
    }),
  ],
  validation: (Rule) =>
    Rule.custom((value) => {
      if (!value) {
        return true;
      }

      if (value.isExternal && !value.url) {
        return "External resource cards require a URL.";
      }

      if (!value.isExternal && !value.linkedPost) {
        return "Internal resource cards require a linked post.";
      }

      return true;
    }),
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "image",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Resource card",
        subtitle,
        media,
      };
    },
  },
});
