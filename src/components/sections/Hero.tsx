/**
 * PURPOSE:
 * Renders the opening value proposition and primary CTA entry points.
 *
 * NOTES:
 * - The right-hand panel is structured as a compact editorial summary rather
 *   than separate components so the hero can stay visually unified.
 * - CTAs intentionally target in-page anchors to keep the homepage as a single
 *   narrative flow.
 */
import { getTranslations } from "next-intl/server";
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { routes, withLocale } from "@/config/routes";
import type { AppLocale } from "@/i18n/routing";
import { ScrollCue } from '../ui/ScrollCue';

type HeroProps = {
  locale: AppLocale;
};

export async function Hero({ locale }: HeroProps) {
  // Bind server-rendered homepage copy to the route locale explicitly so
  // hard refreshes on `/it` cannot fall back to the default request locale.
  const t = await getTranslations({ locale, namespace: "Hero" });

  return (
    <section className='relative min-h-screen 2xl:min-h-[85vh] flex items-start 2xl:mt-72 justify-center'>
      <Container className='grid gap-12 md:gap-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-start'>
        <div className='section-grid max-w-3xl gap-8'>
          <div className='section-grid gap-4'>
            <p className='pl-[4px] text-sm font-semibold uppercase tracking-[0.18em] text-accent-eyebrow-token opacity-90'>
              {t('eyebrow')}
            </p>
            <h1 className='max-w-3xl text-4xl font-extrabold leading-tight tracking-[-0.045em] text-foreground sm:text-5xl md:text-6xl'>
              {t('title')}
            </h1>
            <p className='whitespace-break-spaces max-w-2xl text-base leading-8 text-foreground/72 md:text-lg'>
              {t('description')}
            </p>
          </div>

          <div className='flex flex-col gap-3 sm:flex-row'>
            <Button href={routes.sections.insights} variant='gold'>
              {t('primaryCta')}
            </Button>
            <Button href={withLocale(locale, routes.fireTracker)} variant='secondary'>
              {t('secondaryCta')}
            </Button>
          </div>
        </div>

        <div className='rounded-[var(--radius-lg)] border border-border-token bg-surface/80 px-6 py-8 backdrop-blur-md md:px-8'>
          <div className='section-grid gap-6'>
            <div className='flex items-center justify-between border-b border-border-token pb-4'>
              <p className='text-sm font-semibold text-foreground'>
                {t('panel.title')}
              </p>
              <span className='rounded-full bg-accent-token px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary-token'>
                {t('panel.badge')}
              </span>
            </div>
            <div className='section-grid gap-4'>
              {['signal', 'capital', 'decisions'].map((item) => (
                <div
                  key={item}
                  className='rounded-[var(--radius-md)] border border-border-token bg-surface-strong/85 shadow-[var(--shadow-soft)] p-4'
                >
                  <p className='text-xs font-semibold uppercase tracking-[0.18em] text-muted'>
                    {t(`panel.items.${item}.label`)}
                  </p>
                  <p className='mt-2 text-base font-semibold text-foreground'>
                    {t(`panel.items.${item}.value`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
      <div className='mb-56 pointer-events-none absolute bottom-2 left-1/2 hidden -translate-x-1/2 2xl:block'>
        <ScrollCue />
      </div>
    </section>
  );
}
