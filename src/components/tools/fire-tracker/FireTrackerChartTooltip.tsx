/**
 * FILE: src/components/tools/fire-tracker/FireTrackerChartTooltip.tsx
 *
 * PURPOSE:
 * - Renders the FIRE Tracker hover tooltip independently from the chart SVG markup
 */
import type { ProjectionChartPoint } from './fireTrackerTypes';
import type { FireTrackerChartTooltipLabels } from './fireTrackerChartTypes';

type FireTrackerChartTooltipProps = {
  point: ProjectionChartPoint;
  leftPercent: number;
  labels: FireTrackerChartTooltipLabels;
  gap: number;
  formatCurrency: (value: number) => string;
};

export function FireTrackerChartTooltip({
  point,
  leftPercent,
  labels,
  gap,
  formatCurrency,
}: FireTrackerChartTooltipProps) {
  return (
    <div
      className='pointer-events-none absolute top-4 z-50 w-56 -translate-x-1/2 rounded-[var(--radius-sm)] border border-border-token bg-surface-strong/95 p-3 text-xs text-foreground shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-sm'
      style={{ left: `${leftPercent}%` }}
    >
      <div className='space-y-1.5'>
        <div className='flex items-center justify-between gap-3 text-foreground/64'>
          <span>{labels.age}</span>
          <span className='text-foreground'>{point.age}</span>
        </div>
        <div className='flex items-center justify-between gap-3'>
          <span className='text-foreground/64'>{labels.portfolio}</span>
          <span className='text-chart-total font-semibold'>
            {formatCurrency(point.portfolioWithContributions)}
          </span>
        </div>
        <div className='flex items-center justify-between gap-3 text-foreground/64'>
          <span>{labels.withoutContributions}</span>
          <span className='text-chart-capital font-semibold'>
            {formatCurrency(point.portfolioWithoutContributions)}
          </span>
        </div>
        <div className='flex items-center justify-between gap-3 text-foreground/64'>
          <span>{labels.fireTarget}</span>
          <span className='text-chart-target font-semibold'>
            {formatCurrency(point.fireNumber)}
          </span>
        </div>
        <div className='flex items-center justify-between gap-3 text-foreground/64'>
          <span>{labels.gap}</span>
          <span className='text-foreground font-semibold'>{formatCurrency(gap)}</span>
        </div>
      </div>
    </div>
  );
}
