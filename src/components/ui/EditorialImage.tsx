"use client";

import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

type EditorialImageProps = Omit<ImageProps, "className"> & {
  wrapperClassName?: string;
  imageClassName?: string;
  skeletonClassName?: string;
};

export function EditorialImage({
  alt,
  wrapperClassName,
  imageClassName,
  skeletonClassName,
  onLoad,
  onError,
  ...props
}: EditorialImageProps) {
  void skeletonClassName;

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-surface/60", wrapperClassName)}>
      <Image
        alt={alt}
        {...props}
        onLoad={onLoad}
        onError={onError}
        className={cn("opacity-100 transition-opacity duration-500 ease-out", imageClassName)}
      />
    </div>
  );
}
