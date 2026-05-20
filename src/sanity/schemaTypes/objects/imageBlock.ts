import { defineField, defineType } from "sanity";

export const imageBlockType = defineType({
  name: "imageBlock",
  title: "Editorial image",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      description: "Editorial image asset. Reuse existing assets whenever possible.",
      options: {
        hotspot: true,
        metadata: ["lqip", "palette", "blurhash"],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description: "Required accessibility description for the image.",
      validation: (Rule) => Rule.required().min(10).max(180),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Optional editorial caption shown below the image.",
    }),
    defineField({
      name: "size",
      title: "Size",
      type: "string",
      description: "Controls the visual width of the image within the article flow.",
      initialValue: "medium",
      options: {
        list: [
          { title: "Small", value: "small" },
          { title: "Medium", value: "medium" },
          { title: "Full", value: "full" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "align",
      title: "Alignment",
      type: "string",
      description:
        "Manual alignment control for editorial image placement. Mobile will stack for readability.",
      initialValue: "center",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Right", value: "right" },
          { title: "Center", value: "center" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "caption",
      media: "image",
      size: "size",
    },
    prepare({ title, media, size }) {
      return {
        title: title || "Editorial image",
        subtitle: size ? `Size: ${size}` : "Image block",
        media,
      };
    },
  },
});
