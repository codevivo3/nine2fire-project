import {
  BoldIcon,
  HighlightIcon,
  ItalicIcon,
  TextIcon,
  UnderlineIcon,
} from "@sanity/icons";
import { createElement } from "react";
import {
  defineArrayMember,
  defineField,
  defineType,
  type BlockStyleProps,
} from "sanity";

function StudioBlockquoteStyle(props: BlockStyleProps) {
  return createElement(
    "blockquote",
    {
      style: {
        margin: 0,
        paddingLeft: "1rem",
        borderLeft: "3px solid var(--card-border-color)",
      },
    },
    props.children,
  );
}

const portableTextMembers = [
  defineArrayMember({
    type: "block",
    styles: [
      { title: "Normal", value: "normal" },
      { title: "Heading 2", value: "h2" },
      { title: "Heading 3", value: "h3" },
      { title: "Heading 4", value: "h4" },
      {
        title: "Quote",
        value: "blockquote",
        component: StudioBlockquoteStyle,
      },
    ],
    lists: [
      { title: "Bullet", value: "bullet" },
      { title: "Numbered", value: "number" },
    ],
    marks: {
      decorators: [
        { title: "Bold", value: "strong", icon: BoldIcon },
        { title: "Italic", value: "em", icon: ItalicIcon },
        { title: "Underline", value: "underline", icon: UnderlineIcon },
        { title: "Muted", value: "muted", icon: TextIcon },
        { title: "Highlight", value: "highlight", icon: HighlightIcon },
        { title: "Small note", value: "smallNote", icon: TextIcon },
      ],
      annotations: [
        defineArrayMember({
          name: "link",
          title: "Link",
          type: "object",
          fields: [
            defineField({
              name: "href",
              title: "URL",
              type: "url",
              validation: (Rule) =>
                Rule.required().uri({
                  allowRelative: true,
                  scheme: ["http", "https", "mailto", "tel"],
                }),
            }),
            defineField({
              name: "openInNewTab",
              title: "Open in new tab",
              type: "boolean",
              initialValue: false,
            }),
          ],
        }),
      ],
    },
  }),
  defineArrayMember({ type: "imageBlock" }),
  defineArrayMember({ type: "noteBlock" }),
  defineArrayMember({ type: "quoteBlock" }),
  defineArrayMember({ type: "resourceCard" }),
  defineArrayMember({ type: "chartPlaceholder" }),
  defineArrayMember({ type: "suggestedReadings" }),
];

export const localePortableTextType = defineType({
  name: "localePortableText",
  title: "Localized portable text",
  type: "object",
  fields: [
    defineField({
      name: "en",
      title: "English",
      type: "array",
      description: "English article body used on `/en` routes.",
      of: portableTextMembers,
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "it",
      title: "Italian",
      type: "array",
      description: "Italian article body used on `/it` routes.",
      of: portableTextMembers,
    }),
  ],
});
