import { EditorialImage } from "@/components/ui/EditorialImage";
import {
  getSanityImageDimensions,
  getSanityImageUrl,
  isPortraitImage,
} from "@/lib/sanity/image";
import type { PortableTextImageBlock } from "../types";

type EditorialImageBlockProps = {
  value: PortableTextImageBlock;
};

export function EditorialImageBlock({ value }: EditorialImageBlockProps) {
  const imageUrl = getSanityImageUrl(value.image, 1400, 1400);

  if (!imageUrl || !value.image) {
    return null;
  }

  const dimensions = getSanityImageDimensions(value.image);
  const portrait = isPortraitImage(value.image);
  const size = value.size || "medium";
  const align = value.align || "center";

  const containerClassName =
    size === "small"
      ? align === "left"
        ? "w-full md:mr-auto md:max-w-[340px]"
        : align === "right"
          ? "w-full md:ml-auto md:max-w-[340px]"
          : "w-full md:mx-auto md:max-w-[340px]"
      : size === "full"
        ? portrait
          ? "mx-auto w-full max-w-[520px]"
          : "mx-auto w-full max-w-[920px]"
        : portrait
          ? "mx-auto w-full max-w-[460px]"
          : "mx-auto w-full max-w-[720px]";

  return (
    <figure className={`my-10 ${containerClassName}`}>
      <div className="overflow-hidden rounded-[var(--radius-sm)] border border-border-token bg-surface/70">
        <EditorialImage
          src={imageUrl}
          alt={value.alt || ""}
          width={dimensions?.width || 1400}
          height={dimensions?.height || 1200}
          imageClassName={
            portrait
              ? "max-h-[70vh] w-full object-contain"
              : "max-h-[560px] w-full object-cover"
          }
        />
      </div>
      {value.caption ? (
        <figcaption className="mt-3 text-sm leading-6 text-muted-foreground">
          {value.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

