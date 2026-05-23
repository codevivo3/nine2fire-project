import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SkeletonCardProps = HTMLAttributes<HTMLDivElement>;

export function SkeletonCard({
  className,
  "aria-hidden": ariaHidden = true,
  ...props
}: SkeletonCardProps) {
  return (
    <div
      aria-hidden={ariaHidden}
      className={cn(
        "rounded-[var(--radius-lg)] border border-border-token bg-surface/75",
        className,
      )}
      {...props}
    />
  );
}
