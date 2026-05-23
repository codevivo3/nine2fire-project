import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SkeletonBlockProps = HTMLAttributes<HTMLDivElement>;

export function SkeletonBlock({
  className,
  "aria-hidden": ariaHidden = true,
  ...props
}: SkeletonBlockProps) {
  return (
    <div
      aria-hidden={ariaHidden}
      className={cn(
        "animate-pulse rounded-[var(--radius-sm)] bg-surface-strong/70 motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  );
}
