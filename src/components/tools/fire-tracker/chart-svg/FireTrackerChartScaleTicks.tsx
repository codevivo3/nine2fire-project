import type { ChartScaleTick } from '../fireTrackerChartTypes';

type FireTrackerChartScaleTicksProps = {
  visibleScaleTicks: ChartScaleTick[];
  minValue: number;
  maxValue: number;
  plotEndX: number;
  valueLabelX: number;
  leftPadding: number;
  formatCurrency: (value: number) => string;
};

export function FireTrackerChartScaleTicks({
  visibleScaleTicks,
  minValue,
  maxValue,
  plotEndX,
  valueLabelX,
  leftPadding,
  formatCurrency,
}: FireTrackerChartScaleTicksProps) {
  return visibleScaleTicks.map((tick) => (
    <g key={tick.value}>
      {tick.value > minValue && tick.value < maxValue ? (
        <line
          x1={leftPadding}
          y1={tick.y}
          x2={plotEndX}
          y2={tick.y}
          className='stroke-border-token/35'
          strokeWidth='1'
          strokeDasharray='2 8'
        />
      ) : null}
      <text
        x={valueLabelX}
        y={tick.y + 5}
        className='numeric-value fill-foreground/78 text-[16px] font-semibold'
      >
        {formatCurrency(tick.value)}
      </text>
    </g>
  ));
}
