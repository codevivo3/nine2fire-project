"use client";

import { useCallback, useRef, useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

type EditorialImageProps = Omit<ImageProps, "className"> & {
  wrapperClassName?: string;
  imageClassName?: string;
  skeletonClassName?: string;
};

function getImageSrcKey(src: ImageProps["src"]) {
  if (typeof src === "string") {
    return src;
  }

  if ("src" in src) {
    return src.src;
  }

  return String(src);
}

export function EditorialImage({
  alt,
  wrapperClassName,
  imageClassName,
  skeletonClassName,
  onLoad,
  onError,
  ...props
}: EditorialImageProps) {
  const srcKey = getImageSrcKey(props.src);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const isLoaded = loadedSrc === srcKey;

  const handleImageRef = useCallback(
    (node: HTMLImageElement | null) => {
      imageRef.current = node;

      if (node?.complete) {
        setLoadedSrc(srcKey);
      }
    },
    [srcKey],
  );

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-surface/60", wrapperClassName)}>
      {!isLoaded && (
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 animate-pulse bg-surface-strong/60 motion-reduce:animate-none",
            skeletonClassName,
          )}
        />
      )}

      <Image
        alt={alt}
        {...props}
        ref={handleImageRef}
        onLoad={(event) => {
          setLoadedSrc(srcKey);
          onLoad?.(event);
        }}
        onError={(event) => {
          setLoadedSrc(srcKey);
          onError?.(event);
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
