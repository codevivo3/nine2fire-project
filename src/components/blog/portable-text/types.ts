import type { AppLocale } from "@/i18n/routing";
import type {
  PortableTextContent as PortableTextValue,
  Post,
} from "@/lib/sanity/types";
import type { SanityImageValue } from "@/lib/sanity/image";

export type PortableTextContentProps = {
  value: PortableTextValue;
  locale: AppLocale;
};

export type PortableTextLinkValue = {
  href?: string;
  openInNewTab?: boolean;
};

export type PortableTextImageBlock = {
  image?: SanityImageValue;
  alt?: string;
  caption?: string;
  size?: "small" | "medium" | "full";
  align?: "left" | "right" | "center";
};

export type PortableTextNoteBlock = {
  title?: string;
  body?: PortableTextValue;
  tone?: "neutral" | "insight" | "warning";
};

export type PortableTextQuoteBlock = {
  quote?: string;
  attribution?: string;
};

export type PortableTextResourceCard = {
  title?: string;
  description?: string;
  image?: SanityImageValue;
  imageAlt?: string;
  url?: string;
  label?: string;
  category?: string;
  isExternal?: boolean;
  linkedPost?: {
    slug?: string;
    title?: string;
  };
};

export type PortableTextChartBlock = {
  title?: string;
  description?: string;
  sourceLabel?: string;
};

export type PortableTextSuggestedReadings = {
  title?: string;
  intro?: string;
  posts?: Post[];
  resources?: PortableTextResourceCard[];
};

