import { defineArrayMember, defineField, defineType } from "sanity";

export const suggestedReadingsType = defineType({
  name: "suggestedReadings",
  title: "Suggested readings",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Section title",
      type: "string",
      description: "Bottom-of-article section heading for related readings or references.",
      initialValue: "Suggested readings",
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 2,
      description: "Optional short introduction that frames the linked readings.",
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: "posts",
      title: "Related posts",
      type: "array",
      description: "Internal article references to keep readers moving through the editorial system.",
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
    defineField({
      name: "resources",
      title: "External resources",
      type: "array",
      description: "Optional external references rendered using the same editorial resource card pattern.",
      of: [defineArrayMember({ type: "resourceCard" })],
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: title || "Suggested readings",
      };
    },
  },
});
