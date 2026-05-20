import { cn } from '@/lib/utils';
import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

type Variant = 'gold' | 'secondary';

type BaseProps = {
  variant?: Variant;
  className?: string;
};

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

function getClasses(variant: Variant = 'gold') {
  const base =
    'inline-flex h-12 cursor-pointer items-center justify-center rounded-full border px-5 text-sm font-bold tracking-tight transition-all duration-200';

  const gold =
    'border-accent-token bg-accent-token text-[color:var(--color-button-text-dark)] hover:bg-secondary-token hover:text-[color:var(--color-button-text-light)]';

  const secondary =
    'border-border-token bg-secondary-token text-[color:var(--color-button-text-light)] hover:bg-accent-token hover:text-[color:var(--color-button-text-dark)]';

  return cn(base, variant === 'gold' ? gold : secondary);
}

export function Button({
  variant = 'gold',
  className,
  ...props
}: ButtonProps) {
  const classes = cn(getClasses(variant), className);

  if ('href' in props && props.href) {
    return <Link {...props} href={props.href} className={classes} />;
  }

  const { type, ...buttonProps } = props as ButtonAsButton;

  return (
    <button
      {...buttonProps}
      type={type ?? 'button'}
      className={classes}
    />
  );
}
