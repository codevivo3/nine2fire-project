/**
 * FILE: src/components/tools/fire-tracker/FireTrackerCard.tsx
 *
 * PURPOSE:
 * - Provides the shared shell used by FIRE Tracker calculator, results, and projection panels
 */
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type FireTrackerCardProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function FireTrackerCard({
  title,
  description,
  children,
  className,
}: FireTrackerCardProps) {
  return (
    <section
      className={cn(
        'section-grid w-full rounded-[var(--radius-md)] border border-border-token bg-surface-strong p-4 md:p-5',
        className,
      )}
    >
      {title ? (
        <div className='section-grid gap-1'>
          <h3 className='text-base font-bold tracking-[-0.02em] text-foreground'>
            {title}
          </h3>
          {description ? (
            <p className='text-sm text-foreground/64'>{description}</p>
          ) : null}
        </div>
      ) : null}

      {children}
    </section>
  );
}
