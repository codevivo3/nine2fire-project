import { chartPlaceholderType } from "@/sanity/schemaTypes/objects/chartPlaceholder";
import { imageBlockType } from "@/sanity/schemaTypes/objects/imageBlock";
import { localePortableTextType } from "@/sanity/schemaTypes/objects/localePortableText";
import { localeSlugType } from "@/sanity/schemaTypes/objects/localeSlug";
import { localeStringType } from "@/sanity/schemaTypes/objects/localeString";
import { localeTextType } from "@/sanity/schemaTypes/objects/localeText";
import { noteBlockType } from "@/sanity/schemaTypes/objects/noteBlock";
import { quoteBlockType } from "@/sanity/schemaTypes/objects/quoteBlock";
import { resourceCardType } from "@/sanity/schemaTypes/objects/resourceCard";
import { suggestedReadingsType } from "@/sanity/schemaTypes/objects/suggestedReadings";
import { postType } from "@/sanity/schemaTypes/documents/post";

export const schemaTypes = [
  postType,
  localeStringType,
  localeTextType,
  localeSlugType,
  localePortableTextType,
  imageBlockType,
  noteBlockType,
  quoteBlockType,
  resourceCardType,
  chartPlaceholderType,
  suggestedReadingsType,
];
