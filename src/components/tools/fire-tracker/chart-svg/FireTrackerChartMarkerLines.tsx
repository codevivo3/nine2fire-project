import type { ChartMarkerLine } from '../fireTrackerChartTypes';

type FireTrackerChartMarkerLinesProps = {
  markerLines: ChartMarkerLine[];
  chartTopY: number;
  chartBaselineY: number;
};

export function FireTrackerChartMarkerLines({
  markerLines,
  chartTopY,
  chartBaselineY,
}: FireTrackerChartMarkerLinesProps) {
  return markerLines.map((marker) => {
    const isFireMarker = marker.key === 'fire';
    const labelX = isFireMarker
      ? marker.x
      : marker.textAnchor === 'middle'
        ? marker.x
        : marker.textAnchor === 'end'
          ? marker.x - 8
          : marker.x + 8;

    return (
      <g key={marker.key}>
        <line
          x1={marker.x}
          y1={marker.lineStartY ?? chartTopY}
          x2={marker.x}
          y2={chartBaselineY}
          className={marker.lineClassName ?? 'stroke-foreground/35'}
          strokeWidth={marker.lineStrokeWidth ?? 1}
          strokeDasharray={isFireMarker ? '5 5' : '4 6'}
        />
        {marker.showLabelBadge ? (
          <rect
            x={labelX - 14}
            y={marker.y - 12}
            width='28'
            height='18'
            rx='9'
            className='fill-surface stroke-chart-target/24'
            strokeWidth='1'
          />
        ) : null}
        <text
          x={labelX}
          y={marker.y}
          textAnchor={isFireMarker ? 'middle' : marker.textAnchor}
          dominantBaseline={isFireMarker ? 'middle' : undefined}
          dy={isFireMarker ? '-0.1em' : undefined}
          className={marker.labelClassName ?? 'fill-foreground/72 text-[12px] font-semibold'}
        >
          {marker.label}
        </text>
      </g>
    );
  });
}
