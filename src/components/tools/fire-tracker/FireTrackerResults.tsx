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
  summaryText?: string;
  items: ResultItem[];
};

export function FireTrackerResults({
  title,
  summaryText,
  items,
}: FireTrackerResultsProps) {
  const valueToneClassNames: Record<NonNullable<ResultItem['tone']>, string> = {
    positive: 'text-chart-target',
    warning: 'text-warning-text-token',
  };

  return (
    <FireTrackerCard title={title} className='h-full content-start gap-3 xl:p-5'>
      {summaryText ? (
        <p className='rounded-[var(--radius-sm)] border border-border-token/60 bg-surface/40 px-4 py-3 text-xs leading-6 text-foreground/70 md:text-sm'>
          {summaryText}
        </p>
      ) : null}

      <dl className='grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:gap-2.5'>
        {items.map((item) => (
          <div
            key={item.key}
            className='rounded-[var(--radius-sm)] border border-border-token/70 bg-surface/50 p-2.5 xl:min-h-[88px] xl:p-3'
          >
            <dt className='text-[11px] leading-4 text-foreground/64'>
              {item.label}
            </dt>
            <dd
              className={`mt-0.5 text-sm font-semibold ${
                item.tone ? valueToneClassNames[item.tone] : 'text-foreground'
              }`}
            >
              {item.value}
            </dd>
            {typeof item.progressPercent === 'number' ? (
              <div className='mt-2 h-2 overflow-hidden rounded-full bg-border-token/45'>
                <div
                  className='h-full rounded-full bg-chart-target/80'
                  style={{ width: `${item.progressPercent}%` }}
                />
              </div>
            ) : null}
          </div>
        ))}
      </dl>
    </FireTrackerCard>
  );
}
