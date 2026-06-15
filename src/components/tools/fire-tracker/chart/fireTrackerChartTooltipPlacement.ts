import {
  CHART_HEIGHT,
  CHART_WIDTH,
} from './fireTrackerChartConstants';
import type { ChartCollisionRect } from './fireTrackerChartCollision';

type TooltipPlacementCandidate = {
  left: number;
  top: number;
};

type ChartTooltipPlacementInput = {
  anchorX: number;
  anchorY: number;
  chartWidth?: number;
  chartHeight?: number;
  tooltipWidth?: number;
  tooltipHeight?: number;
  horizontalOffset?: number;
  verticalOffset?: number;
  padding?: number;
  avoidRects?: ChartCollisionRect[];
};

type ChartTooltipCandidateKey =
  | 'above-center'
  | 'above-left'
  | 'above-right'
  | 'side-left'
  | 'side-right'
  | 'below-center'
  | 'below-left'
  | 'below-right';

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getOverlapArea(a: ChartCollisionRect, b: ChartCollisionRect) {
  const overlapWidth = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const overlapHeight = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));

  return overlapWidth * overlapHeight;
}

export function getChartTooltipPlacement({
  anchorX,
  anchorY,
  chartWidth = CHART_WIDTH,
  chartHeight = CHART_HEIGHT,
  tooltipWidth = 224,
  tooltipHeight = 164,
  horizontalOffset = 18,
  verticalOffset = 18,
  padding = 8,
  avoidRects = [],
}: ChartTooltipPlacementInput) {
  const maxLeft = Math.max(padding, chartWidth - tooltipWidth - padding);
  const maxTop = Math.max(padding, chartHeight - tooltipHeight - padding);
  const nearLeft = anchorX < chartWidth * 0.24;
  const nearRight = anchorX > chartWidth * 0.76;
  const nearTop = anchorY < chartHeight * 0.24;
  const nearBottom = anchorY > chartHeight * 0.58;
  const candidateMap: Record<ChartTooltipCandidateKey, TooltipPlacementCandidate> = {
    'above-center': {
      left: anchorX - tooltipWidth / 2,
      top: anchorY - tooltipHeight - verticalOffset,
    },
    'above-left': {
      left: anchorX - tooltipWidth + 20,
      top: anchorY - tooltipHeight - verticalOffset,
    },
    'above-right': {
      left: anchorX - 20,
      top: anchorY - tooltipHeight - verticalOffset,
    },
    'side-left': {
      left: anchorX - tooltipWidth - horizontalOffset,
      top: anchorY - tooltipHeight / 2,
    },
    'side-right': {
      left: anchorX + horizontalOffset,
      top: anchorY - tooltipHeight / 2,
    },
    'below-center': {
      left: anchorX - tooltipWidth / 2,
      top: anchorY + verticalOffset,
    },
    'below-left': {
      left: anchorX - tooltipWidth + 20,
      top: anchorY + verticalOffset,
    },
    'below-right': {
      left: anchorX - 20,
      top: anchorY + verticalOffset,
    },
  };
  const orderedCandidateKeys: ChartTooltipCandidateKey[] = (
    nearBottom
      ? nearRight
        ? ['above-left', 'side-left', 'above-center', 'above-right', 'below-left']
        : nearLeft
          ? ['above-right', 'side-right', 'above-center', 'above-left', 'below-right']
          : ['above-center', 'above-right', 'above-left', 'side-right', 'side-left']
      : nearTop
        ? nearRight
          ? ['below-left', 'side-left', 'below-center', 'below-right', 'above-left']
          : nearLeft
            ? ['below-right', 'side-right', 'below-center', 'below-left', 'above-right']
            : ['below-center', 'side-right', 'side-left', 'below-right', 'below-left']
        : nearRight
          ? ['side-left', 'above-left', 'above-center', 'below-left', 'side-right']
          : nearLeft
            ? ['side-right', 'above-right', 'above-center', 'below-right', 'side-left']
            : ['above-center', 'side-right', 'side-left', 'below-center', 'above-right', 'above-left']
  );
  const candidates: Array<TooltipPlacementCandidate & { key: ChartTooltipCandidateKey }> =
    orderedCandidateKeys.map((key) => ({
      key,
      ...candidateMap[key],
    }));

  const bestCandidate = candidates.reduce<{
    left: number;
    top: number;
    score: number;
  } | null>((best, candidate, index) => {
    const clampedLeft = clamp(candidate.left, padding, maxLeft);
    const clampedTop = clamp(candidate.top, padding, maxTop);
    const rect = {
      left: clampedLeft,
      top: clampedTop,
      right: clampedLeft + tooltipWidth,
      bottom: clampedTop + tooltipHeight,
    };
    const clampPenalty =
      Math.abs(candidate.left - clampedLeft) + Math.abs(candidate.top - clampedTop);
    const overlapPenalty = avoidRects.reduce(
      (total, avoidRect) => total + getOverlapArea(rect, avoidRect),
      0,
    );
    const distancePenalty =
      Math.abs(anchorX - (clampedLeft + tooltipWidth / 2)) * 0.2 +
      Math.abs(anchorY - (clampedTop + tooltipHeight / 2)) * 0.12;
    const directionPenalty =
      nearTop && candidate.key.startsWith('above')
        ? 40
        : nearBottom && candidate.key.startsWith('below')
          ? 40
          : nearLeft && candidate.key.includes('left')
            ? 30
            : nearRight && candidate.key.includes('right')
              ? 30
              : 0;
    const score =
      overlapPenalty * 4 +
      clampPenalty * 8 +
      distancePenalty +
      directionPenalty +
      index * 12;

    if (best === null || score < best.score) {
      return {
        left: clampedLeft,
        top: clampedTop,
        score,
      };
    }

    return best;
  }, null);

  return {
    leftPercent: ((bestCandidate?.left ?? padding) / chartWidth) * 100,
    topPercent: ((bestCandidate?.top ?? padding) / chartHeight) * 100,
  };
}
