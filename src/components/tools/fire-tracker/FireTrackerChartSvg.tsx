/**
 * FILE: src/components/tools/fire-tracker/FireTrackerChartSvg.tsx
 *
 * PURPOSE:
 * - Renders the FIRE Tracker projection SVG once the parent chart has prepared its view model
 */
import {
  CHART_HEIGHT,
  CHART_PADDING_BOTTOM,
  CHART_PADDING_LEFT,
  CHART_PADDING_RIGHT,
  CHART_PADDING_TOP,
  CHART_WIDTH,
} from './fireTrackerChartHelpers';
import type {
  ChartEndLabel,
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
  fireTargetY: number;
  initialCapitalY: number;
  innerHeight: number;
  minValue: number;
  maxValue: number;
  hoveredIndex: number | null;
  hoveredPoint: ProjectionChartPoint | null;
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
  fireTargetY,
  initialCapitalY,
  innerHeight,
  minValue,
  maxValue,
  hoveredIndex,
  hoveredPoint,
  xForIndex,
  yForValue,
  onHoverIndex,
}: FireTrackerChartSvgProps) {
  return (
    <svg
      viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      className='h-[340px] w-full'
      role='img'
      aria-label={title}
    >
      <line
        x1={CHART_PADDING_LEFT}
        y1={initialCapitalY}
        x2={CHART_WIDTH - CHART_PADDING_RIGHT + 12}
        y2={initialCapitalY}
        className='stroke-border-token/90'
        strokeWidth='1'
        strokeDasharray='3 7'
      />
      <line
        x1={CHART_PADDING_LEFT}
        y1={CHART_HEIGHT - CHART_PADDING_BOTTOM}
        x2={CHART_WIDTH - CHART_PADDING_RIGHT + 12}
        y2={CHART_HEIGHT - CHART_PADDING_BOTTOM}
        className='stroke-border-token/80'
        strokeWidth='1'
      />
      <line
        x1={CHART_PADDING_LEFT}
        y1={fireTargetY}
        x2={CHART_WIDTH - CHART_PADDING_RIGHT + 12}
        y2={fireTargetY}
        className='stroke-chart-target'
        strokeWidth='2'
        strokeDasharray='5 5'
      />
      <text
        x={CHART_PADDING_LEFT + 8}
        y={fireTargetY - 10}
        className='fill-chart-target text-[18px] font-extrabold'
        paintOrder='stroke'
        stroke='rgba(0,0,0,0.50)'
        strokeWidth='0.5'
      >
        {`${fireTargetLabel}: ${formatCurrency(fireTargetValue)}`}
      </text>

      {visibleScaleTicks.map((tick) => (
        <g key={tick.value}>
          {tick.value > minValue && tick.value < maxValue ? (
            <line
              x1={CHART_PADDING_LEFT}
              y1={tick.y}
              x2={CHART_WIDTH - CHART_PADDING_RIGHT + 12}
              y2={tick.y}
              className='stroke-border-token/35'
              strokeWidth='1'
              strokeDasharray='2 8'
            />
          ) : null}
          <text
            x={CHART_WIDTH - CHART_PADDING_RIGHT + 18}
            y={tick.y + 5}
            className='fill-foreground/78 text-[16px] font-semibold'
          >
            {formatCurrency(tick.value)}
          </text>
        </g>
      ))}

      {series.map((item) => (
        <path
          key={item.label}
          d={item.linePath}
          className={`${item.lineClassName} fill-none stroke-current`}
          strokeWidth={item.strokeWidth}
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeDasharray={item.strokeDasharray}
        />
      ))}

      {hoveredPoint && hoveredIndex !== null ? (
        <>
          <line
            x1={xForIndex(hoveredIndex)}
            y1={CHART_PADDING_TOP}
            x2={xForIndex(hoveredIndex)}
            y2={CHART_HEIGHT - CHART_PADDING_BOTTOM}
            className='stroke-border-token'
            strokeWidth='1'
            strokeDasharray='4 6'
          />
          <circle
            cx={xForIndex(hoveredIndex)}
            cy={yForValue(hoveredPoint.portfolioWithContributions)}
            r='5'
            className='fill-chart-total'
          />
          <circle
            cx={xForIndex(hoveredIndex)}
            cy={yForValue(hoveredPoint.portfolioWithContributions)}
            r='9'
            className='fill-chart-total/16'
          />
        </>
      ) : null}

      {endLabels.map((item) => (
        <text
          key={item.key}
          x={item.x}
          y={item.y}
          className={`${item.className} text-[17px] font-bold`}
        >
          {item.label}
        </text>
      ))}

      <text
        x={CHART_PADDING_LEFT}
        y={CHART_HEIGHT - 14}
        className='fill-foreground/95 text-[17px] font-bold'
      >
        {startLabel}
      </text>
      <text
        x={CHART_WIDTH - CHART_PADDING_RIGHT + 12}
        y={CHART_HEIGHT - 14}
        textAnchor='end'
        className='fill-foreground/95 text-[17px] font-bold'
      >
        {endLabel}
      </text>

      {points.map((point, index) => {
        const nextX =
          index === points.length - 1
            ? CHART_WIDTH - CHART_PADDING_RIGHT + 12
            : xForIndex(index + 1);
        const width = Math.max(nextX - xForIndex(index), 18);

        return (
          <rect
            key={point.age}
            x={xForIndex(index) - width / 2}
            y={CHART_PADDING_TOP}
            width={width}
            height={innerHeight}
            fill='transparent'
            onMouseEnter={() => onHoverIndex(index)}
            onMouseMove={() => onHoverIndex(index)}
          />
        );
      })}
    </svg>
  );
}
