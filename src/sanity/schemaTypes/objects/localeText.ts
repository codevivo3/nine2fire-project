import { defineField, defineType } from "sanity";

export const localeTextType = defineType({
  name: "localeText",
  title: "Localized long text",
  type: "object",
  fields: [
    defineField({
      name: "en",
      title: "English",
      type: "text",
      rows: 4,
      description: "English editorial value used on `/en` routes.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "it",
      title: "Italian",
      type: "text",
      rows: 4,
      description: "Italian editorial value used on `/it` routes.",
    }),
  ],
});
