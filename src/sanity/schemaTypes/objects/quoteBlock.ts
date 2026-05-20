import { defineField, defineType } from "sanity";

export const quoteBlockType = defineType({
  name: "quoteBlock",
  title: "Quote",
  type: "object",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      description: "Quoted passage or highlighted statement.",
      validation: (Rule) => Rule.required().min(20),
    }),
    defineField({
      name: "attribution",
      title: "Attribution",
      type: "string",
      description: "Optional source, speaker, or context label.",
    }),
  ],
  preview: {
    select: {
      title: "quote",
      subtitle: "attribution",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Quote",
        subtitle,
      };
    },
  },
});
