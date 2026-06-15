import { FireTrackerChartHoverLayer } from './FireTrackerChartHoverLayer';
import { FireTrackerChartBaseAgeLabels } from './chart-svg/FireTrackerChartBaseAgeLabels';
import { FireTrackerChartEndLabels } from './chart-svg/FireTrackerChartEndLabels';
import { FireTrackerChartFrame } from './chart-svg/FireTrackerChartFrame';
import { FireTrackerChartInteractionRects } from './chart-svg/FireTrackerChartInteractionRects';
import { FireTrackerChartMarkerLines } from './chart-svg/FireTrackerChartMarkerLines';
import { FireTrackerChartScaleTicks } from './chart-svg/FireTrackerChartScaleTicks';
import { FireTrackerChartSeriesPaths } from './chart-svg/FireTrackerChartSeriesPaths';
import {
  CHART_HEIGHT,
  CHART_PADDING_BOTTOM,
  CHART_PADDING_LEFT,
  CHART_PADDING_TOP,
  CHART_VIEWBOX_WIDTH,
  CHART_WIDTH,
} from './fireTrackerChartHelpers';
import type {
  ChartEndLabel,
  ChartMarkerLine,
  ChartScaleTick,
  ChartSeries,
} from './fireTrackerChartTypes';
import type { ProjectionChartPoint } from './fireTrackerTypes';

type FireTrackerChartSvgProps = {
  title: string;
  startLabel: string;
  endLabel: string;
  fireTargetLabel: string;
  fireTargetValue: number;
  formatCurrency: (value: number) => string;
  points: ProjectionChartPoint[];
  series: ChartSeries[];
  visibleScaleTicks: ChartScaleTick[];
  endLabels: ChartEndLabel[];
  markerLines: ChartMarkerLine[];
  fireTargetY: number;
  initialCapitalY: number;
  innerHeight: number;
  minValue: number;
  maxValue: number;
  hoveredIndex: number | null;
  hoveredPoint: ProjectionChartPoint | null;
  hideStartLabel: boolean;
  hideEndLabel: boolean;
  xForIndex: (index: number) => number;
  yForValue: (value: number) => number;
  onHoverIndex: (index: number) => void;
};

export function FireTrackerChartSvg({
  title,
  startLabel,
  endLabel,
  fireTargetLabel,
  fireTargetValue,
  formatCurrency,
  points,
  series,
  visibleScaleTicks,
  endLabels,
  markerLines,
  fireTargetY,
  initialCapitalY,
  innerHeight,
  minValue,
  maxValue,
  hoveredIndex,
  hoveredPoint,
  hideStartLabel,
  hideEndLabel,
  xForIndex,
  yForValue,
  onHoverIndex,
}: FireTrackerChartSvgProps) {
  const plotEndX = CHART_WIDTH - 2;
  const valueLabelX = CHART_WIDTH + 8;
  const chartBaselineY = CHART_HEIGHT - CHART_PADDING_BOTTOM;
  const hoverAgeBadgeCenterY = CHART_HEIGHT - 23;
  const hoverX = hoveredIndex === null ? null : xForIndex(hoveredIndex);
  const hoverY =
    hoveredPoint === null ? null : yForValue(hoveredPoint.portfolioWithContributions);

  return (
    <svg
      viewBox={`0 0 ${CHART_VIEWBOX_WIDTH} ${CHART_HEIGHT}`}
      className='h-[332px] w-full max-w-full overflow-hidden md:h-[358px] lg:h-[378px]'
      role='img'
      aria-label={title}
    >
      <FireTrackerChartFrame
        plotEndX={plotEndX}
        chartBaselineY={chartBaselineY}
        initialCapitalY={initialCapitalY}
        fireTargetY={fireTargetY}
        fireTargetLabel={fireTargetLabel}
        fireTargetValue={fireTargetValue}
        formatCurrency={formatCurrency}
        leftPadding={CHART_PADDING_LEFT}
      />
      <FireTrackerChartMarkerLines
        markerLines={markerLines}
        chartTopY={CHART_PADDING_TOP}
        chartBaselineY={chartBaselineY}
      />
      <FireTrackerChartScaleTicks
        visibleScaleTicks={visibleScaleTicks}
        minValue={minValue}
        maxValue={maxValue}
        plotEndX={plotEndX}
        valueLabelX={valueLabelX}
        leftPadding={CHART_PADDING_LEFT}
        formatCurrency={formatCurrency}
      />
      <FireTrackerChartSeriesPaths series={series} />

      <FireTrackerChartHoverLayer
        hoveredIndex={hoveredIndex}
        hoveredPoint={hoveredPoint}
        hoverX={hoverX}
        hoverY={hoverY}
        fireTargetY={fireTargetY}
        hoverAgeBadgeCenterY={hoverAgeBadgeCenterY}
      />
      <FireTrackerChartEndLabels endLabels={endLabels} />
      <FireTrackerChartBaseAgeLabels
        startLabel={startLabel}
        endLabel={endLabel}
        hideStartLabel={hideStartLabel}
        hideEndLabel={hideEndLabel}
        leftPadding={CHART_PADDING_LEFT}
        valueLabelX={valueLabelX}
        labelCenterY={hoverAgeBadgeCenterY}
      />
      <FireTrackerChartInteractionRects
        points={points}
        plotEndX={plotEndX}
        innerHeight={innerHeight}
        chartTopY={CHART_PADDING_TOP}
        xForIndex={xForIndex}
        onHoverIndex={onHoverIndex}
      />
    </svg>
  );
}
