'use client';
/**
 * FILE: src/components/ui/NavLink.tsx
 *
 * PURPOSE:
 * - Wraps localized links with the shared navigation text treatment
 *
 * NOTES:
 * - `link-highlight` centralizes the underline animation so header and footer links stay aligned
 * - Same-page section links stay native to avoid dev-only delays in App Router hash navigation
 */
import type { AnchorHTMLAttributes } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

type NavLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
  children: React.ReactNode;
  className?: string;
};

function isHomeSectionHref(href: string) {
  return href.startsWith('/#');
}

export function NavLink({ href, children, className, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const shouldUseNativeHashLink = pathname === '/' && isHomeSectionHref(href);
  const resolvedHref = shouldUseNativeHashLink ? href.slice(1) : href;

  const linkClasses = cn(
    `
    link-highlight
    relative
    inline-block
    text-sm
    font-semibold
    text-[color:var(--color-fg)]
    transition-colors duration-200
    `,
    className,
  );

  if (shouldUseNativeHashLink) {
    return (
      <a
        {...props}
        href={resolvedHref}
        className={linkClasses}
      >
        <span>{children}</span>
      </a>
    );
  }

  return (
    <Link
      {...props}
      href={resolvedHref}
      className={linkClasses}
    >
      <span>{children}</span>
    </Link>
  );
}
