import type { AnchorHTMLAttributes } from 'react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

type ActionTextLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function ActionTextLink({
  href,
  children,
  className,
  ...props
}: ActionTextLinkProps) {
  return (
    <Link
      {...props}
      href={href}
      className={cn(
        'link-highlight relative inline-block text-sm font-semibold text-[color:var(--color-fg)] transition-colors duration-200',
        className,
      )}
    >
      <span>{children}</span>
    </Link>
  );
}
