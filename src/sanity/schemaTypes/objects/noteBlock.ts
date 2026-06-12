import {
  BoldIcon,
  HighlightIcon,
  ItalicIcon,
  TextIcon,
  UnderlineIcon,
} from "@sanity/icons";
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
              { title: "Bold", value: "strong", icon: BoldIcon },
              { title: "Italic", value: "em", icon: ItalicIcon },
              { title: "Underline", value: "underline", icon: UnderlineIcon },
              { title: "Muted", value: "muted", icon: TextIcon },
              { title: "Highlight", value: "highlight", icon: HighlightIcon },
              { title: "Small note", value: "smallNote", icon: TextIcon },
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
