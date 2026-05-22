/**
 * FILE: src/components/sections/ValueProps.tsx
 *
 * PURPOSE:
 * - Explains the core operating principles behind the product philosophy
 */
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { sectionAnchorOffsets } from "@/config/sectionAnchors";

export function ValueProps() {
  const t = useTranslations("ValueProps");

  return (
    <section id='approach' className={sectionAnchorOffsets.base}>
      <Container className='pt-8 pb-16 md:pt-12 md:pb-24 2xl:pt-8'>
        <SectionHeader
          eyebrow={t('eyebrow')}
          title={t('title')}
          description={t('description')}
        />

        <div className='mt-10 grid gap-4 md:mt-12 md:grid-cols-3'>
          {['system', 'clarity', 'rhythm'].map((item) => (
            <article
              key={item}
              className='rounded-[var(--radius-lg)] border border-border-token bg-surface/80 p-6 backdrop-blur-md md:p-7'
            >
              <p className='text-xs font-semibold uppercase tracking-[0.18em] text-accent-eyebrow-token'>
                {t(`items.${item}.eyebrow`)}
              </p>
              <h3 className='mt-4 text-xl font-bold tracking-[-0.03em] text-foreground'>
                {t(`items.${item}.title`)}
              </h3>
              <p className='whitespace-break-spaces mt-3 text-sm leading-7 text-foreground/72'>
                {t(`items.${item}.description`)}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
