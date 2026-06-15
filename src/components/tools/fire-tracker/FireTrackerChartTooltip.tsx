/**
 * FILE: src/components/tools/fire-tracker/FireTrackerChartTooltip.tsx
 *
 * PURPOSE:
 * - Renders the FIRE Tracker hover tooltip independently from the chart SVG markup
 */
import type { ProjectionChartPoint } from './fireTrackerTypes';
import type {
  ChartTooltipPlacement,
  FireTrackerChartTooltipLabels,
} from './fireTrackerChartTypes';

type FireTrackerChartTooltipProps = {
  point: ProjectionChartPoint;
  placement: ChartTooltipPlacement;
  labels: FireTrackerChartTooltipLabels;
  gap: number;
  formatCurrency: (value: number) => string;
};

export function FireTrackerChartTooltip({
  point,
  placement,
  labels,
  gap,
  formatCurrency,
}: FireTrackerChartTooltipProps) {
  return (
    <div
      className='pointer-events-none absolute z-50 w-56 rounded-[var(--radius-sm)] border border-border-token bg-surface-strong/95 p-3 text-xs text-foreground shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-sm'
      style={{
        left: `${placement.leftPercent}%`,
        top: `${placement.topPercent}%`,
      }}
    >
      <div className='space-y-1.5'>
        <div className='flex items-center justify-between gap-3'>
          <span className='text-foreground/64'>{labels.portfolio}</span>
          <span className='numeric-value text-warning-text-token font-semibold'>
            {formatCurrency(point.portfolioWithContributions)}
          </span>
        </div>
        <div className='flex items-center justify-between gap-3 text-foreground/64'>
          <span>{labels.withoutContributions}</span>
          <span className='numeric-value text-chart-capital font-semibold'>
            {formatCurrency(point.portfolioWithoutContributions)}
          </span>
        </div>
        <div className='flex items-center justify-between gap-3 text-foreground/64'>
          <span>{labels.fireTarget}</span>
          <span className='numeric-value text-chart-target font-semibold'>
            {formatCurrency(point.fireNumber)}
          </span>
        </div>
        <div className='flex items-center justify-between gap-3 text-foreground/64'>
          <span>{labels.gap}</span>
          <span className='numeric-value text-foreground font-semibold'>{formatCurrency(gap)}</span>
        </div>
        <div className='flex items-center justify-between gap-3 text-foreground/64'>
          <span>{labels.pensionActive}</span>
          <span className='text-foreground font-semibold'>
            {point.pensionActive ? labels.yes : labels.no}
          </span>
        </div>
      </div>
    </div>
  );
}
