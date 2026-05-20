'use client';
/**
 * FILE: src/components/layout/BrandLogo.tsx
 *
 * PURPOSE:
 * - Renders the primary brand mark as a locale-aware home link
 *
 * NOTES:
 * - Both logo variants stay mounted so theme switching can be handled entirely in CSS
 */
import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";

type BrandLogoProps = {
  className?: string;
};

export function BrandLogo({ className }: BrandLogoProps) {
  const pathname = usePathname();

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (pathname === "/" || pathname === "") {
      const alreadyAtTop = window.scrollY < 8;

      if (alreadyAtTop) {
        return;
      }

      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  return (
    <Link
      href="/"
      className={`inline-flex items-center ${className ?? ""}`.trim()}
      aria-label="Nine2Fire"
      onClick={handleClick}
    >
      <Image
        className="logo-light h-auto w-38"
        src="/logo/nine2fire-logo-text-dark-mode.svg"
        alt="Nine2Fire"
        width={158}
        height={28}
        priority
      />
      <Image
        className="logo-dark h-auto w-38"
        src="/logo/nine2fire-logo-text-light-mode.svg"
        alt="Nine2Fire"
        width={158}
        height={28}
        priority
      />
    </Link>
  );
}
