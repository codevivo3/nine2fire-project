import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityClient } from "@/lib/sanity/client";

const builder = sanityClient
  ? createImageUrlBuilder(sanityClient)
  : null;

export type SanityImageAsset = {
  _id?: string;
  url?: string;
  metadata?: {
    lqip?: string;
    dimensions?: {
      width?: number;
      height?: number;
      aspectRatio?: number;
    };
  };
};

export type SanityImageValue = {
  asset?: SanityImageAsset;
};

export function urlForImage(source: SanityImageValue) {
  if (!builder || !source) {
    return null;
  }

  return builder.image(source);
}

export function getSanityImageUrl(
  source: SanityImageValue | undefined,
  width: number,
  height?: number,
) {
  if (!source) {
    return undefined;
  }

  const imageBuilder = urlForImage(source);

  if (!imageBuilder) {
    return source.asset?.url;
  }

  const configuredBuilder = imageBuilder.width(width).fit("max").auto("format");

  return height
    ? configuredBuilder.height(height).url()
    : configuredBuilder.url();
}

export function getSanityImageDimensions(image?: SanityImageValue) {
  return image?.asset?.metadata?.dimensions;
}

export function isPortraitImage(image?: SanityImageValue) {
  const dimensions = getSanityImageDimensions(image);

  if (!dimensions?.width || !dimensions?.height) {
    return false;
  }

  return dimensions.height > dimensions.width;
}
