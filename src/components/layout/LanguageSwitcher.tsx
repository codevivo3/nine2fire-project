'use client';
/**
 * PURPOSE:
 * Renders a locale toggle that preserves the current route shape.
 *
 * NOTES:
 * - Navigation is delayed briefly so the switch animation can complete before
 *   the route transition swaps localized content.
 * - The component derives the next URL from the current pathname rather than
 *   hardcoding section routes, which keeps it compatible with localized blog pages.
 */

import * as React from 'react';
import { useLocale } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { useTheme } from '@/components/layout/ThemeToggle';
import { useRouter } from 'next/navigation';

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const { isLight, mounted } = useTheme();
  const isItalian = locale === 'it';
  const nextLocale = isItalian ? 'en' : 'it';

  const router = useRouter();
  const [isSwitching, setIsSwitching] = React.useState(false);

  const isItalianVisual = isSwitching ? !isItalian : isItalian;
  const trackBoxShadow = mounted
    ? isLight
      ? 'inset 0 2px 3px rgba(0,0,0,0.7), inset 0 -0.5px 3px var(--color-accent), 0 1.5px 2px 1px var(--color-secondary)'
      : 'inset 0 2px 3px rgba(0,0,0,1), inset 0 -2px 2px rgba(255,255,255,0.33), 0 0 3px 1px var(--color-accent)'
    : 'inset 0 2px 3px rgba(0,0,0,0.75), 0 1px 2px rgba(0,0,0,0.18)';
  const thumbBackground = mounted
    ? isLight
      ? 'var(--color-accent)'
      : 'var(--color-primary)'
    : 'var(--color-secondary)';
  const thumbBoxShadow = mounted
    ? isLight
      ? 'inset 0 2px 3px rgba(255,255,255,0.2), inset 0 -2px 3px rgba(0,0,0,0.2), 0 2px 6px rgba(0,0,0,0.25), 0 0 4px var(--color-primary)'
      : 'inset 0 2px 3px rgba(255,255,255,0.05), inset 0 -2px 3px rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.6), 0 0 4px var(--color-accent)'
    : 'inset 0 1px 2px rgba(255,255,255,0.08), inset 0 -1px 2px rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.18)';
  const thumbTransform = isItalianVisual ? 'translateX(26px)' : 'translateX(2px)';

  return (
    <button
      onClick={() => {
        if (isSwitching) return;
        setIsSwitching(true);
        setTimeout(() => {
          // Rebuild the same pathname under the opposite locale prefix.
          router.push(`/${nextLocale}${pathname}`);
        }, 250);
      }}
      aria-label={`Switch language to ${nextLocale.toUpperCase()}`}
      className='relative inline-flex h-6 w-12 items-center overflow-hidden rounded-full border border-border-token bg-surface transition-all'
      style={{
        boxShadow: trackBoxShadow,
      }}
    >
      <span className='relative inline-flex h-full w-full items-center'>
        <span
          className='relative z-10 inline-flex h-4.5 w-4.5 items-center justify-center rounded-full transition-transform duration-[150ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform'
          style={{
            backgroundColor: thumbBackground,
            boxShadow: thumbBoxShadow,
            transform: thumbTransform,
          }}
        >
          <span
            className='absolute inline-flex h-4 w-4 items-center justify-center rounded-full overflow-hidden'
            style={{
              backgroundColor: thumbBackground,
              boxShadow:
                'inset 0 1px 2px rgba(0,0,0,0.5), 0 2px 3px rgba(0,0,0,0.5)',
            }}
          >
            {isItalianVisual ? (
              <span className='fi fi-gb fis w-full h-full opacity-90 bg-cover' />
            ) : (
              <span className='fi fi-it fis w-full h-full opacity-90 bg-cover' />
            )}
            <span
              className='pointer-events-none absolute inset-0 rounded-full'
              style={{
                boxShadow: 'inset 0 2px 3px rgba(0,0,0,0.35), inset 0 -1px 2px rgba(255,255,255,0.1)'
              }}
            />
          </span>
        </span>
      </span>
    </button>
  );
}
