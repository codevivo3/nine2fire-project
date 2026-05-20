import { defineField, defineType } from "sanity";

export const chartPlaceholderType = defineType({
  name: "chartPlaceholder",
  title: "Chart placeholder",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Working title for the future chart or data visual.",
      validation: (Rule) => Rule.required().min(4).max(120),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Short editorial note describing the chart intent, metric, or future data source.",
      validation: (Rule) => Rule.required().min(20).max(240),
    }),
    defineField({
      name: "sourceLabel",
      title: "Source label",
      type: "string",
      description: "Optional label for the expected data source or reference set.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "sourceLabel",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Chart placeholder",
        subtitle,
      };
    },
  },
});
