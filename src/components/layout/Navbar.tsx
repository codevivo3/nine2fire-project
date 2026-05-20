'use client';
/**
 * PURPOSE:
 * Renders the persistent site header, localized navigation, and mobile controls.
 *
 * NOTES:
 * - Theme and locale controls are visually hidden until the menu is opened so
 *   the compact desktop header stays focused on navigation first.
 * - The scroll state only affects presentation; it does not change layout structure.
 */
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { BrandLogo } from '@/components/layout/BrandLogo';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { ThemeToggle, useTheme } from '@/components/layout/ThemeToggle';
import { cn } from '@/lib/utils';
import { NavLink } from '@/components/ui/NavLink';
import { mainNavLinks } from '@/config/navigation';
import { List, X, Globe as GlobeIcon } from 'phosphor-react';
import Image from 'next/image';

export function Navbar() {
  const t = useTranslations('Navigation');
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const { isLight } = useTheme();

  return (
    <header className='fixed inset-x-0 top-0 z-50 bg-surface/80 backdrop-blur-xl'>
      <Container
        className={cn(
          'relative flex items-center justify-between gap-6 transition-all duration-300 ease-out',
          isScrolled ? 'h-14 scale-[0.97]' : 'h-14 scale-100',
        )}
      >
        <BrandLogo className='shrink-0' />

        <nav className='hidden items-center gap-8 md:flex absolute left-1/2 -translate-x-1/2'>
          {mainNavLinks.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {t(link.labelKey)}
            </NavLink>
          ))}
        </nav>

        <div className='flex items-center gap-2 md:ml-auto'>
          {/* Keep these controls mounted so their internal state persists while hidden. */}
          <div
            className={cn(
              'hidden items-center gap-2 md:flex transition-all duration-200 ease-out',
              isOpen
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-6 pointer-events-none',
            )}
          >
            <div className='flex items-center gap-1.5'>
              {isLight ? (
                <GlobeIcon
                  size={22}
                  weight='thin'
                  className='text-muted-foreground opacity-90'
                />
              ) : (
                <GlobeIcon
                  size={22}
                  weight='thin'
                  color='#ffcf40'
                  className='opacity-90'
                />
              )}
              <LanguageSwitcher />
            </div>

            <div className='flex items-center gap-1.5'>
              <Image
                src={isLight ? '/theme/off-bulb.svg' : '/theme/on-bulb.svg'}
                alt=''
                width={12}
                height={12}
                className=''
              />
              <ThemeToggle />
            </div>
          </div>

          <button
            type='button'
            className='inline-flex items-center justify-center p-2 text-foreground'
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-controls='mobile-navigation'
            aria-haspopup='menu'
          >
            <span className='relative inline-flex h-6 w-6'>
              <span
                className={cn(
                  'absolute inset-0 flex items-center justify-center transition-all duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                  isOpen
                    ? 'opacity-0 scale-90 rotate-[-20deg] translate-y-1'
                    : 'opacity-100 scale-100 rotate-0 translate-y-0',
                )}
              >
                <List size={24} weight='regular' />
              </span>

              <span
                className={cn(
                  'absolute inset-0 flex items-center justify-center transition-all duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                  isOpen
                    ? 'opacity-100 scale-100 rotate-0 translate-y-0'
                    : 'opacity-0 scale-90 rotate-[20deg] -translate-y-1',
                )}
              >
                <X size={24} weight='regular' />
              </span>
            </span>
          </button>
        </div>
      </Container>

      <div
        id='mobile-navigation'
        className={cn(
          'bg-background/95 backdrop-blur-sm md:hidden',
          isOpen ? 'block' : 'hidden',
        )}
      >
        <Container className='section-grid py-4 gap-6'>
          <nav className='section-grid'>
            {mainNavLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
              >
                {t(link.labelKey)}
              </NavLink>
            ))}
          </nav>

          <div className='flex flex-col items-start gap-4'>
            <div className='section-grid gap-1'>
              <span className='text-[10px] uppercase tracking-[0.18em] text-muted-foreground'>
                Language
              </span>
              <LanguageSwitcher />
            </div>

            <div className='section-grid gap-1'>
              <span className='text-[10px] uppercase tracking-[0.18em] text-muted-foreground'>
                Theme
              </span>
              <ThemeToggle />
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
}
