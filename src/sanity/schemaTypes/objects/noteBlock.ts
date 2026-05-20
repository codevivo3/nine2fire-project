import { defineField, defineType } from "sanity";

export const noteBlockType = defineType({
  name: "noteBlock",
  title: "Note / callout",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Optional short heading for the note.",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      description: "Compact note content with the same editorial text constraints as the article body.",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Muted", value: "muted" },
              { title: "Highlight", value: "highlight" },
              { title: "Small note", value: "smallNote" },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "tone",
      title: "Tone",
      type: "string",
      description: "Keeps the callout subtle while signaling the editorial intent.",
      initialValue: "neutral",
      options: {
        list: [
          { title: "Neutral", value: "neutral" },
          { title: "Insight", value: "insight" },
          { title: "Warning", value: "warning" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      tone: "tone",
    },
    prepare({ title, tone }) {
      return {
        title: title || "Note / callout",
        subtitle: tone ? `Tone: ${tone}` : "Callout",
      };
    },
  },
});
