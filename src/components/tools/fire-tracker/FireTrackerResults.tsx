/**
 * FILE: src/components/tools/fire-tracker/FireTrackerResults.tsx
 *
 * PURPOSE:
 * - Presents the calculator result cards without owning any calculation logic
 */
import { FireTrackerCard } from './FireTrackerCard';
import type { ResultItem } from './fireTrackerTypes';

type FireTrackerResultsProps = {
  title: string;
  items: ResultItem[];
};

export function FireTrackerResults({
  title,
  items,
}: FireTrackerResultsProps) {
  return (
    <FireTrackerCard title={title} className='h-full content-start gap-3 xl:p-5'>
      <dl className='grid gap-2 sm:grid-cols-2 xl:gap-2.5'>
        {items.map((item) => (
          <div
            key={item.label}
            className='rounded-[var(--radius-sm)] border border-border-token/70 bg-surface/50 p-2.5 xl:p-3'
          >
            <dt className='text-[11px] leading-4 text-foreground/64'>
              {item.label}
            </dt>
            <dd className='mt-0.5 text-sm font-semibold text-foreground'>
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </FireTrackerCard>
  );
}
