import { defineArrayMember, defineField, defineType } from "sanity";

const portableTextMembers = [
  defineArrayMember({
    type: "block",
    styles: [
      { title: "Normal", value: "normal" },
      { title: "Section heading", value: "sectionHeading" },
    ],
    lists: [],
    marks: {
      decorators: [
        { title: "Strong", value: "strong" },
        { title: "Muted", value: "muted" },
        { title: "Highlight", value: "highlight" },
        { title: "Small note", value: "smallNote" },
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
