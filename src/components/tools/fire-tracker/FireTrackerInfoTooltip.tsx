import { Info } from 'lucide-react';
import { useId } from 'react';

type FireTrackerInfoTooltipProps = {
  label: string;
  text: string;
};

export function FireTrackerInfoTooltip({
  label,
  text,
}: FireTrackerInfoTooltipProps) {
  const tooltipId = useId();

  return (
    <div className='group relative inline-flex items-center'>
      <button
        type='button'
        aria-label={label}
        aria-describedby={tooltipId}
        className='inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full text-muted outline-none transition-colors hover:text-foreground/72 focus-visible:text-foreground/78 focus-visible:ring-1 focus-visible:ring-accent-token/55'
      >
        <Info size={15} strokeWidth={2} aria-hidden='true' />
      </button>
      <div
        id={tooltipId}
        role='tooltip'
        className='pointer-events-none absolute left-1/2 top-full z-20 hidden w-52 -translate-x-1/2 rounded-[var(--radius-sm)] border border-border-token bg-surface-strong/96 px-3 py-2 text-left text-[11px] leading-4 text-foreground shadow-[0_14px_30px_rgba(0,0,0,0.18)] group-hover:block group-focus-within:block'
      >
        {text}
      </div>
    </div>
  );
}
