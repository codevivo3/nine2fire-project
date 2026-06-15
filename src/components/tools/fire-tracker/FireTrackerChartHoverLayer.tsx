/**
 * FILE: src/components/tools/fire-tracker/FireTrackerChartHoverLayer.tsx
 *
 * PURPOSE:
 * - Renders only the hover-specific SVG elements for the FIRE Tracker projection chart
 */
import type { ProjectionChartPoint } from './fireTrackerTypes';

type FireTrackerChartHoverLayerProps = {
  hoveredIndex: number | null;
  hoveredPoint: ProjectionChartPoint | null;
  hoverX: number | null;
  hoverY: number | null;
  fireTargetY: number;
  hoverAgeBadgeCenterY: number;
};

export function FireTrackerChartHoverLayer({
  hoveredIndex,
  hoveredPoint,
  hoverX,
  hoverY,
  fireTargetY,
  hoverAgeBadgeCenterY,
}: FireTrackerChartHoverLayerProps) {
  if (!hoveredPoint || hoveredIndex === null) {
    return null;
  }

  return (
    <>
      <line
        x1={hoverX ?? 0}
        y1={fireTargetY}
        x2={hoverX ?? 0}
        y2={hoverAgeBadgeCenterY}
        className='stroke-chart-total-label/72'
        strokeWidth='1'
        strokeDasharray='4 7'
      />
      <circle
        cx={hoverX ?? 0}
        cy={hoverY ?? 0}
        r='5'
        className='fill-chart-total'
      />
      <circle
        cx={hoverX ?? 0}
        cy={hoverY ?? 0}
        r='9'
        className='fill-chart-total/16'
      />
      <circle
        cx={hoverX ?? 0}
        cy={hoverAgeBadgeCenterY}
        r='15'
        className='fill-surface/92 stroke-chart-total-label/90'
        strokeWidth='2'
      />
      <text
        x={hoverX ?? 0}
        y={hoverAgeBadgeCenterY}
        textAnchor='middle'
        dominantBaseline='middle'
        dy='0.06em'
        className='numeric-value fill-chart-total-label text-[13px] font-bold'
      >
        {hoveredPoint.age}
      </text>
    </>
  );
}
