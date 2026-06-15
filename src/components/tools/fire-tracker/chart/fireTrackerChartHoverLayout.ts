import type {
  ChartEndLabel,
  ChartMarkerLine,
  ChartTooltipPlacement,
} from '../fireTrackerChartTypes';
import {
  CHART_HEIGHT,
  CHART_PADDING_LEFT,
  CHART_PADDING_TOP,
  CHART_VIEWBOX_WIDTH,
} from './fireTrackerChartConstants';
import {
  doChartRectsOverlap,
  estimateChartTextRect,
  expandChartRect,
  getChartRectFromCenter,
} from './fireTrackerChartCollision';
import { getChartTooltipPlacement } from './fireTrackerChartTooltipPlacement';

type BuildFireTrackerChartHoverLayoutParams = {
  startLabel: string;
  endLabel: string;
  valueLabelX: number;
  hoveredX: number | null;
  hoveredY: number | null;
  hoveredPoint: {
    portfolioWithContributions: number;
    fireNumber: number;
  } | null;
  markerLines: ChartMarkerLine[];
  endLabels: ChartEndLabel[];
};

export function buildFireTrackerChartHoverLayout({
  startLabel,
  endLabel,
  valueLabelX,
  hoveredX,
  hoveredY,
  hoveredPoint,
  markerLines,
  endLabels,
}: BuildFireTrackerChartHoverLayoutParams) {
  const chartBaselineY = CHART_HEIGHT - 42;
  const ageLabelCenterY = CHART_HEIGHT - 23;
  const startLabelRect = expandChartRect(
    estimateChartTextRect(startLabel, CHART_PADDING_LEFT, ageLabelCenterY, {
      lineHeight: 18,
    }),
    { x: 14, y: 8 },
  );
  const endLabelRect = expandChartRect(
    estimateChartTextRect(endLabel, valueLabelX, ageLabelCenterY, {
      textAnchor: 'end',
      lineHeight: 18,
    }),
    { x: 14, y: 8 },
  );
  const hoverBadgeRect =
    hoveredX === null ? null : getChartRectFromCenter(hoveredX, ageLabelCenterY, 40, 40);
  const baselineAvoidRect = {
    left: CHART_PADDING_LEFT,
    top: chartBaselineY - 10,
    right: CHART_VIEWBOX_WIDTH,
    bottom: CHART_HEIGHT,
  };
  const hideStartLabel =
    hoverBadgeRect === null ? false : doChartRectsOverlap(hoverBadgeRect, startLabelRect);
  const hideEndLabel =
    hoverBadgeRect === null ? false : doChartRectsOverlap(hoverBadgeRect, endLabelRect);
  const tooltipGap =
    hoveredPoint === null
      ? 0
      : Math.max(hoveredPoint.fireNumber - hoveredPoint.portfolioWithContributions, 0);
  const tooltipPlacement: ChartTooltipPlacement =
    hoveredPoint && hoveredX !== null && hoveredY !== null
      ? getChartTooltipPlacement({
          anchorX: hoveredX,
          anchorY: hoveredY,
          chartWidth: CHART_VIEWBOX_WIDTH,
          avoidRects: [
            ...endLabels.map((label) => ({
              left: CHART_VIEWBOX_WIDTH - 116,
              top: label.y - 20,
              right: CHART_VIEWBOX_WIDTH - 4,
              bottom: label.y + 20,
            })),
            ...markerLines.map((marker) => ({
              left: marker.key === 'fire' ? marker.x - 32 : marker.x - 52,
              top: CHART_PADDING_TOP - 4,
              right: marker.key === 'fire' ? marker.x + 32 : marker.x + 52,
              bottom: (marker.lineStartY ?? marker.y) + 18,
            })),
            startLabelRect,
            endLabelRect,
            baselineAvoidRect,
            ...(hoverBadgeRect ? [hoverBadgeRect] : []),
          ],
        })
      : {
          leftPercent: 0,
          topPercent: 0,
        };

  return {
    hideEndLabel,
    hideStartLabel,
    tooltipGap,
    tooltipPlacement,
  };
}
