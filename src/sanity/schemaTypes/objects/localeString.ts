import { defineField, defineType } from "sanity";

export const localeStringType = defineType({
  name: "localeString",
  title: "Localized short text",
  type: "object",
  fields: [
    defineField({
      name: "en",
      title: "English",
      type: "string",
      description: "English editorial value used on `/en` routes.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "it",
      title: "Italian",
      type: "string",
      description: "Italian editorial value used on `/it` routes.",
    }),
  ],
});
