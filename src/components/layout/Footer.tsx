/**
 * FILE: src/components/layout/Footer.tsx
 *
 * PURPOSE:
 * - Renders the global footer with localized navigation, legal links, and contact actions
 *
 * NOTES:
 * - Reuses `NavLink` so link hover treatment matches the header
 * - Contact actions stay plain anchors because they target external destinations
 */
import { useTranslations } from 'next-intl';
import { BrandLogo } from '@/components/layout/BrandLogo';
import { Container } from '@/components/ui/Container';
import { NavLink } from '@/components/ui/NavLink';
import { mainNavLinks } from '@/config/navigation';
import {
  FaXTwitter,
  FaFacebook,
  FaEnvelope,
} from 'react-icons/fa6';
import { SiReddit } from 'react-icons/si';

export function Footer() {
  const t = useTranslations('Footer');
  const navT = useTranslations('Navigation');

  const legalLinks = [
    { href: '/disclaimer', label: t('legal.disclaimer') },
    { href: '/privacy', label: t('legal.privacy') },
    { href: '/terms', label: t('legal.terms') },
  ];

  // Shared icon-link treatment keeps the contact row visually consistent.
  const contactLinkClasses = `
    link-highlight
    link-highlight--icon
    group
    inline-grid place-items-center relative
    w-10 h-10
    text-[color:var(--color-fg)]
    transition-transform duration-200
    hover:scale-105
  `;

  return (
    <footer className='bg-surface/80 backdrop-blur-md text-[color:var(--color-fg)]'>
      <Container className='section-grid grid-cols-2 py-12 md:grid-cols-[2fr_1fr_1fr_1fr] md:items-start'>
        <div className='section-grid gap-4 order-1 col-span-2 md:col-span-1 md:order-none'>
          <BrandLogo />
          <p className='max-w-sm text-sm leading-7 text-[color:var(--color-fg)]/72'>
            {t('tagline')}
          </p>
          <p className='hidden md:block text-xs tracking-[0.18em] text-[color:var(--color-fg)]/50'>
            {t('copyright')}
          </p>
        </div>

        <div className='section-grid gap-4 order-2 col-span-1 md:col-span-1 justify-center md:order-none'>
          <p className='text-xs font-semibold uppercase tracking-[0.18em] text-accent-eyebrow-token'>
            {t('navTitle')}
          </p>
          <div className='section-grid gap-3'>
            {mainNavLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                className='inline-block w-fit'
                aria-label={`Go to ${navT(link.labelKey)} page`}
              >
                {navT(link.labelKey)}
              </NavLink>
            ))}
          </div>
        </div>

        <div className='section-grid gap-4 order-3 col-span-1 md:col-span-1 justify-center md:order-none'>
          <p className='text-xs font-semibold uppercase tracking-[0.18em] text-accent-eyebrow-token'>
            {t('legalTitle')}
          </p>
          <div className='section-grid gap-3'>
            {legalLinks.map((link) => (
              <NavLink
                key={link.label}
                href={link.href}
                className='inline-block w-fit'
                aria-label={`Go to ${link.label} page`}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className='section-grid gap-4 order-4 col-span-2 md:col-span-1 md:order-none items-center text-center md:justify-self-center'>
          <p className='text-xs font-semibold uppercase tracking-[0.18em] text-accent-eyebrow-token '>
            {t('contactTitle')}
          </p>
          <div className='flex w-fit mx-auto items-center justify-center gap-4'>
            <a
              href='mailto:info@nine2fire.com'
              className={contactLinkClasses}
              aria-label='Send email to Nine2Fire'
            >
              <span className='flex items-center justify-center w-full h-full'>
                <FaEnvelope className='h-4 w-4 opacity-80 group-hover:opacity-100 transition' />
              </span>
            </a>
            <a
              href='https://x.com/nine2fire'
              target='_blank'
              rel='noopener noreferrer'
              className={contactLinkClasses}
              aria-label='Visit Nine2Fire on X'
            >
              <span className='flex items-center justify-center w-full h-full'>
                <FaXTwitter className='h-4 w-4 opacity-80 group-hover:opacity-100 transition' />
              </span>
            </a>
            <a
              href='https://www.facebook.com/nine2fire/'
              target='_blank'
              rel='noopener noreferrer'
              className={contactLinkClasses}
              aria-label='Visit Nine2Fire on Facebook'
            >
              <span className='flex items-center justify-center w-full h-full'>
                <FaFacebook className='h-4 w-4 opacity-80 group-hover:opacity-100 transition' />
              </span>
            </a>
            <a
              href='https://www.reddit.com/user/nine2fire/'
              target='_blank'
              rel='noopener noreferrer'
              className={contactLinkClasses}
              aria-label='Visit Nine2Fire on Reddit'
            >
              <span className='flex items-center justify-center w-full h-full'>
                <SiReddit className='h-4 w-4 opacity-80 group-hover:opacity-100 transition' />
              </span>
            </a>
            {/* <a
              href='https://www.instagram.com/nine2fire_blog/'
              target='_blank'
              rel='noopener noreferrer'
              className={contactLinkClasses}
              aria-label='Visit Nine2Fire on Instagram'
            >
              <span className='flex items-center justify-center w-full h-full'>
                <FaInstagram className='h-4 w-4 opacity-80 group-hover:opacity-100 transition' />
              </span>
            </a> */}
          </div>
        </div>
        {/* Mobile-only copyright row at the bottom */}
        <div className='order-5 col-span-2 mt-6 md:hidden'>
          <p className='text-center text-xs tracking-[0.18em] text-[color:var(--color-fg)]/50'>
            {t('copyright')}
          </p>
        </div>
      </Container>
    </footer>
  );
}
