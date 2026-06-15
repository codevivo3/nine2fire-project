/**
 * FILE: src/components/tools/fire-tracker/FireTrackerChartLegend.tsx
 *
 * PURPOSE:
 * - Renders the FIRE Tracker chart legend and its compact help disclosure
 */
import type { ChartSeries, FireTrackerChartHelp } from './fireTrackerChartTypes';

type FireTrackerChartLegendProps = {
  series: ChartSeries[];
  fireTargetLabel: string;
  help: FireTrackerChartHelp;
  isHelpOpen: boolean;
  onToggleHelp: () => void;
};

export function FireTrackerChartLegend({
  series,
  fireTargetLabel,
  help,
  isHelpOpen,
  onToggleHelp,
}: FireTrackerChartLegendProps) {
  return (
    <>
      <div className='flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs leading-4 text-foreground/78'>
        {series.map((item) => (
          <div key={item.label} className='flex items-center gap-2'>
            <span className={`h-2.5 w-2.5 rounded-full ${item.dotClassName}`} />
            <span>{item.label}</span>
          </div>
        ))}
        <div className='flex items-center gap-2'>
          <span className='h-2.5 w-2.5 rounded-full bg-chart-target' />
          <span>{fireTargetLabel}</span>
        </div>
      </div>

      <div className='rounded-[var(--radius-sm)] border border-border-token/60 bg-surface/30'>
        <button
          type='button'
          className='flex w-full items-center justify-between gap-3 px-3 py-1 text-left text-xs font-medium text-foreground/72 transition-colors hover:text-foreground'
          aria-expanded={isHelpOpen}
          onClick={onToggleHelp}
        >
          <span>{help.title}</span>
          <span
            className={`text-[10px] text-foreground/56 transition-transform duration-200 ${
              isHelpOpen ? 'rotate-180' : ''
            }`}
          >
            v
          </span>
        </button>
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
            isHelpOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className='overflow-hidden'>
            <ol className='space-y-1.5 px-3 pb-2 text-xs leading-5 text-foreground/64'>
              {help.items.map((item, index) => (
                <li key={item} className='flex gap-2'>
                  <span className='text-foreground/40'>{index + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}
