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
    <FireTrackerCard title={title} className='min-w-0 h-full content-start gap-2 xl:p-4'>
      {summaryText ? (
        <p className='rounded-[var(--radius-sm)] border border-border-token/60 bg-surface/40 px-3 py-2 text-xs leading-6 text-foreground/70 md:text-sm'>
          {summaryText}
        </p>
      ) : null}

      <dl className='grid gap-1.5 md:grid-cols-2 lg:grid-cols-3 xl:gap-1.5'>
        {items.map((item) => (
          <div
            key={item.key}
            className='rounded-[var(--radius-sm)] border border-border-token/70 bg-surface/50 p-2 xl:min-h-[72px] xl:p-2'
          >
            <dt className='text-[11px] leading-4 text-foreground/64'>
              {item.label}
            </dt>
            <dd
              className={`mt-px text-sm font-semibold ${
                item.valueType === 'numeric' ? 'numeric-value ' : ''
              }${
                item.tone ? valueToneClassNames[item.tone] : 'text-foreground'
              }`}
            >
              {item.value}
            </dd>
            {typeof item.progressPercent === 'number' ? (
              <div className='mt-1 h-2 overflow-hidden rounded-full bg-border-token/45'>
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
