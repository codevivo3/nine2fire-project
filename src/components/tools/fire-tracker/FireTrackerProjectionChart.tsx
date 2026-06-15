import { useState } from 'react';
import { FireTrackerCard } from './FireTrackerCard';
import { FireTrackerChartLegend } from './FireTrackerChartLegend';
import { FireTrackerChartSvg } from './FireTrackerChartSvg';
import { FireTrackerChartTooltip } from './FireTrackerChartTooltip';
import { buildFireTrackerProjectionViewModel } from './chart/fireTrackerProjectionViewModel';
import type { FireTrackerProjectionChartProps } from './fireTrackerChartTypes';

export function FireTrackerProjectionChart({
  title,
  startLabel,
  endLabel,
  legend,
  help,
  markers,
  formatCurrency,
  tooltipLabels,
  initialCapital,
  monthlyContribution,
  points,
}: FireTrackerProjectionChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  if (points.length === 0) {
    return null;
  }

  const {
    endLabels,
    finalPoint,
    fireTargetY,
    hideEndLabel,
    hideStartLabel,
    hoveredPoint,
    initialCapitalY,
    innerHeight,
    markerLines,
    maxValue,
    minValue,
    series,
    tooltipGap,
    tooltipPlacement,
    visibleScaleTicks,
    xForIndex,
    yForValue,
  } = buildFireTrackerProjectionViewModel({
    startLabel,
    endLabel,
    legend,
    markers,
    formatCurrency,
    initialCapital,
    monthlyContribution,
    points,
    hoveredIndex,
  });

  return (
    <FireTrackerCard title={title} className='min-w-0 h-full content-start gap-2 xl:p-4'>
      <div
        className='relative min-w-0 overflow-x-hidden overflow-y-visible rounded-[var(--radius-sm)] border border-border-token/70 bg-surface/50 px-0.5 py-2 sm:px-1 xl:px-1'
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {hoveredPoint ? (
          <FireTrackerChartTooltip
            point={hoveredPoint}
            placement={tooltipPlacement}
            labels={tooltipLabels}
            gap={tooltipGap}
            formatCurrency={formatCurrency}
          />
        ) : null}

        <FireTrackerChartSvg
          title={title}
          startLabel={startLabel}
          endLabel={endLabel}
          fireTargetLabel={legend.fireTarget}
          fireTargetValue={finalPoint.fireNumber}
          formatCurrency={formatCurrency}
          points={points}
          series={series}
          visibleScaleTicks={visibleScaleTicks}
          endLabels={endLabels}
          markerLines={markerLines}
          fireTargetY={fireTargetY}
          initialCapitalY={initialCapitalY}
          innerHeight={innerHeight}
          minValue={minValue}
          maxValue={maxValue}
          hoveredIndex={hoveredIndex}
          hoveredPoint={hoveredPoint}
          hideStartLabel={hideStartLabel}
          hideEndLabel={hideEndLabel}
          xForIndex={xForIndex}
          yForValue={yForValue}
          onHoverIndex={setHoveredIndex}
        />
      </div>

      <FireTrackerChartLegend
        series={series}
        fireTargetLabel={legend.fireTarget}
        help={help}
        isHelpOpen={isHelpOpen}
        onToggleHelp={() => setIsHelpOpen((value) => !value)}
      />
    </FireTrackerCard>
  );
}
