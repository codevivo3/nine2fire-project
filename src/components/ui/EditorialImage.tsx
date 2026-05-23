"use client";

import { useState } from "react";
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
  ...props
}: EditorialImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-surface/60", wrapperClassName)}>
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 animate-pulse bg-surface-strong/60 transition-opacity duration-300 motion-reduce:animate-none",
          isLoaded ? "opacity-0" : "opacity-100",
          skeletonClassName,
        )}
      />

      <Image
        alt={alt}
        {...props}
        onLoad={(event) => {
          setIsLoaded(true);
          onLoad?.(event);
        }}
        className={cn(
          "transition-opacity duration-500 ease-out",
          isLoaded ? "opacity-100" : "opacity-0",
          imageClassName,
        )}
      />
    </div>
  );
}
