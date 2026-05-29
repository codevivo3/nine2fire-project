/**
 * FILE: src/components/tools/fire-tracker/FireTrackerProjectionChart.tsx
 *
 * PURPOSE:
 * - Prepares the FIRE Tracker projection chart view model and wires hover/help state into subcomponents
 */
import { useState } from 'react';
import { FireTrackerCard } from './FireTrackerCard';
import { FireTrackerChartLegend } from './FireTrackerChartLegend';
import { FireTrackerChartSvg } from './FireTrackerChartSvg';
import { FireTrackerChartTooltip } from './FireTrackerChartTooltip';
import {
  buildLinePath,
  CHART_HEIGHT,
  CHART_PADDING_BOTTOM,
  CHART_PADDING_LEFT,
  CHART_PADDING_RIGHT,
  CHART_PADDING_TOP,
  CHART_WIDTH,
  getChartXForIndex,
  getChartYForValue,
  getRoundedScaleMax,
} from './fireTrackerChartHelpers';
import type {
  ChartEndLabel,
  ChartScaleTick,
  ChartSeries,
  FireTrackerProjectionChartProps,
} from './fireTrackerChartTypes';

export function FireTrackerProjectionChart({
  title,
  startLabel,
  endLabel,
  legend,
  help,
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

  const finalPoint = points[points.length - 1];
  const contributionValues = points.map(
    (point, index) => initialCapital + index * 12 * monthlyContribution,
  );
  const portfolioValues = points.flatMap((point, index) => [
    point.portfolioWithContributions,
    point.portfolioWithoutContributions,
    contributionValues[index],
    initialCapital,
  ]);
  const minValue = Math.min(0, ...portfolioValues);
  const maxPortfolioValue = Math.max(...portfolioValues);
  const maxReferenceValue = Math.max(maxPortfolioValue, finalPoint.fireNumber);
  const maxValue = maxReferenceValue === 0 ? 1 : getRoundedScaleMax(maxReferenceValue * 1.08);
  const innerWidth = CHART_WIDTH - CHART_PADDING_LEFT - CHART_PADDING_RIGHT;
  const innerHeight = CHART_HEIGHT - CHART_PADDING_TOP - CHART_PADDING_BOTTOM;
  const hoveredPoint = hoveredIndex === null ? null : points[hoveredIndex];

  const xForIndex = (index: number) =>
    getChartXForIndex(index, points.length, innerWidth);
  const yForValue = (value: number) =>
    getChartYForValue(value, minValue, maxValue, innerHeight);

  const series: ChartSeries[] = [
    {
      label: legend.totalPortfolio,
      lineClassName: 'text-chart-total',
      textClassName: 'fill-chart-total-label',
      dotClassName: 'bg-chart-total',
      linePath: buildLinePath(
        points.map((point) => point.portfolioWithContributions),
        minValue,
        maxValue,
        innerWidth,
        innerHeight,
      ),
      finalValue: finalPoint.portfolioWithContributions,
      strokeWidth: 4.5,
    },
    {
      label: legend.currentCapitalGrowth,
      lineClassName: 'text-chart-capital',
      textClassName: 'fill-chart-capital',
      dotClassName: 'bg-chart-capital',
      linePath: buildLinePath(
        points.map((point) => point.portfolioWithoutContributions),
        minValue,
        maxValue,
        innerWidth,
        innerHeight,
      ),
      finalValue: finalPoint.portfolioWithoutContributions,
      strokeWidth: 2.5,
    },
    {
      label: legend.capitalInvested,
      lineClassName: 'text-chart-contributions',
      textClassName: 'fill-chart-contributions',
      dotClassName: 'bg-chart-contributions',
      linePath: buildLinePath(
        contributionValues,
        minValue,
        maxValue,
        innerWidth,
        innerHeight,
      ),
      finalValue: contributionValues[contributionValues.length - 1] ?? initialCapital,
      strokeWidth: 2,
      strokeDasharray: '9 7',
    },
  ];

  const fireTargetY = yForValue(finalPoint.fireNumber);
  const scaleTicks: ChartScaleTick[] = [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
    const value = minValue + (maxValue - minValue) * ratio;
    return {
      value,
      y: yForValue(value),
    };
  });
  const initialCapitalY = yForValue(initialCapital);
  const endLabels: ChartEndLabel[] = [
    {
      key: series[0].label,
      label: formatCurrency(series[0].finalValue),
      x: CHART_WIDTH - CHART_PADDING_RIGHT + 18,
      y: yForValue(series[0].finalValue) + 5,
      className: series[0].textClassName,
    },
    {
      key: series[2].label,
      label: formatCurrency(series[2].finalValue),
      x: CHART_WIDTH - CHART_PADDING_RIGHT + 18,
      y: yForValue(series[2].finalValue) + 5,
      className: series[2].textClassName,
    },
  ];
  const visibleScaleTicks = scaleTicks.filter((tick) => {
    const overlapsFinalLabel = endLabels.some(
      (label) => Math.abs(tick.y - label.y) < 20,
    );
    return !overlapsFinalLabel;
  });
  const tooltipLeft =
    hoveredIndex === null ? 0 : Math.min(Math.max((xForIndex(hoveredIndex) / CHART_WIDTH) * 100, 18), 82);
  const tooltipGap =
    hoveredPoint === null
      ? 0
      : Math.max(hoveredPoint.fireNumber - hoveredPoint.portfolioWithContributions, 0);

  return (
    <FireTrackerCard title={title} className='h-full content-start gap-3 xl:p-5'>
      <div
        className='relative overflow-visible rounded-[var(--radius-sm)] border border-border-token/70 bg-surface/50 px-2 py-3 xl:px-3'
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {hoveredPoint ? (
          <FireTrackerChartTooltip
            point={hoveredPoint}
            leftPercent={tooltipLeft}
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
          fireTargetY={fireTargetY}
          initialCapitalY={initialCapitalY}
          innerHeight={innerHeight}
          minValue={minValue}
          maxValue={maxValue}
          hoveredIndex={hoveredIndex}
          hoveredPoint={hoveredPoint}
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
