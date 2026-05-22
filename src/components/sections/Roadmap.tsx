/**
 * FILE: src/components/sections/Roadmap.tsx
 *
 * PURPOSE:
 * - Breaks the service model into an ordered sequence of implementation steps
 */
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { sectionAnchorOffsets } from "@/config/sectionAnchors";

const ROADMAP_STEP_KEYS = [
  "lifestyle",
  "habits",
  "capital",
  "time",
] as const;

type RoadmapStepKey = (typeof ROADMAP_STEP_KEYS)[number];

export function Roadmap() {
  const t = useTranslations("Roadmap");

  return (
    <section id='roadmap' className={sectionAnchorOffsets.roadmap}>
      <Container className='py-16 md:py-24'>
        <SectionHeader
          eyebrow={t('eyebrow')}
          title={t('title')}
          description={t('description')}
        />

        <div className='mt-10 grid gap-4 md:mt-12 md:grid-cols-2 xl:grid-cols-4'>
          {ROADMAP_STEP_KEYS.map((step: RoadmapStepKey, index) => (
            <article
              key={step}
              className='rounded-[var(--radius-lg)] border border-border-token bg-surface/80 p-6 backdrop-blur-md'
            >
              <p className='text-xs font-semibold uppercase tracking-[0.18em] text-accent-eyebrow-token'>
                {t('stepLabel', { index: index + 1 })}
              </p>
              <h3 className='mt-4 text-lg font-bold tracking-[-0.03em] text-foreground'>
                {t(`steps.${step}.title`)}
              </h3>
              <p className='mt-3 text-sm leading-7 text-foreground/72'>
                {t(`steps.${step}.description`)}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
