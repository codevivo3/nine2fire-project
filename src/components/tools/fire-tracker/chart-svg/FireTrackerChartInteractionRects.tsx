import type { ProjectionChartPoint } from '../fireTrackerTypes';

type FireTrackerChartInteractionRectsProps = {
  points: ProjectionChartPoint[];
  plotEndX: number;
  innerHeight: number;
  chartTopY: number;
  xForIndex: (index: number) => number;
  canHover: boolean;
  onHoverIndex: (index: number) => void;
};

export function FireTrackerChartInteractionRects({
  points,
  plotEndX,
  innerHeight,
  chartTopY,
  xForIndex,
  canHover,
  onHoverIndex,
}: FireTrackerChartInteractionRectsProps) {
  return points.map((point, index) => {
    const nextX = index === points.length - 1 ? plotEndX : xForIndex(index + 1);
    const width = Math.max(nextX - xForIndex(index), 18);

    return (
      <rect
        key={point.age}
        x={xForIndex(index) - width / 2}
        y={chartTopY}
        width={width}
        height={innerHeight}
        fill='transparent'
        onMouseEnter={canHover ? () => onHoverIndex(index) : undefined}
        onMouseMove={canHover ? () => onHoverIndex(index) : undefined}
      />
    );
  });
}
