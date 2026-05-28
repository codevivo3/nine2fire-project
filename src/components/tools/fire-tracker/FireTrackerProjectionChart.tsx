/**
 * FILE: src/components/tools/fire-tracker/FireTrackerProjectionChart.tsx
 *
 * PURPOSE:
 * - Renders a compact SVG projection chart for the first FIRE Tracker beta output
 */
import { FireTrackerCard } from './FireTrackerCard';
import type { ProjectionChartPoint } from './fireTrackerTypes';

type FireTrackerProjectionChartProps = {
  title: string;
  description: string;
  startLabel: string;
  endLabel: string;
  legend: {
    withContributions: string;
    withoutContributions: string;
    fireTarget: string;
  };
  summaryText: string;
  formatCurrency: (value: number) => string;
  points: ProjectionChartPoint[];
};

type ChartSeries = {
  label: string;
  lineClassName: string;
  textClassName: string;
  linePath: string;
  finalValue: number;
  strokeWidth: number;
  strokeDasharray?: string;
};

const CHART_WIDTH = 700;
const CHART_HEIGHT = 256;
const CHART_PADDING_X = 16;
const CHART_PADDING_TOP = 16;
const CHART_PADDING_RIGHT = 112;
const CHART_PADDING_BOTTOM = 30;

function buildLinePath(
  values: number[],
  minValue: number,
  maxValue: number,
  innerWidth: number,
  innerHeight: number,
) {
  return values
    .map((value, index) => {
      const x =
        CHART_PADDING_X +
        (values.length === 1 ? innerWidth / 2 : (index / (values.length - 1)) * innerWidth);
      const ratio = maxValue === minValue ? 0.5 : (value - minValue) / (maxValue - minValue);
      const y = CHART_PADDING_TOP + innerHeight - ratio * innerHeight;

      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
}

export function FireTrackerProjectionChart({
  title,
  description,
  startLabel,
  endLabel,
  legend,
  summaryText,
  formatCurrency,
  points,
}: FireTrackerProjectionChartProps) {
  if (points.length === 0) {
    return null;
  }

  const finalPoint = points[points.length - 1];
  const values = points.flatMap((point) => [
    point.portfolioWithContributions,
    point.portfolioWithoutContributions,
    point.fireNumber,
  ]);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const innerWidth = CHART_WIDTH - CHART_PADDING_X - CHART_PADDING_RIGHT;
  const innerHeight = CHART_HEIGHT - CHART_PADDING_TOP - CHART_PADDING_BOTTOM;
  const series: ChartSeries[] = [
    {
      label: legend.withContributions,
      lineClassName: 'text-accent-token',
      textClassName: 'fill-accent-token',
      linePath: buildLinePath(
        points.map((point) => point.portfolioWithContributions),
        minValue,
        maxValue,
        innerWidth,
        innerHeight,
      ),
      finalValue: finalPoint.portfolioWithContributions,
      strokeWidth: 3,
    },
    {
      label: legend.withoutContributions,
      lineClassName: 'text-foreground/72',
      textClassName: 'fill-foreground/72',
      linePath: buildLinePath(
        points.map((point) => point.portfolioWithoutContributions),
        minValue,
        maxValue,
        innerWidth,
        innerHeight,
      ),
      finalValue: finalPoint.portfolioWithoutContributions,
      strokeWidth: 2,
    },
    {
      label: legend.fireTarget,
      lineClassName: 'text-foreground/42',
      textClassName: 'fill-foreground/56',
      linePath: buildLinePath(
        points.map((point) => point.fireNumber),
        minValue,
        maxValue,
        innerWidth,
        innerHeight,
      ),
      finalValue: finalPoint.fireNumber,
      strokeWidth: 1.5,
      strokeDasharray: '5 5',
    },
  ];

  const lastIndex = points.length - 1;
  const xForIndex =
    CHART_PADDING_X +
    (lastIndex === 0 ? innerWidth / 2 : (lastIndex / lastIndex) * innerWidth);
  const yForValue = (value: number) => {
    const ratio = maxValue === minValue ? 0.5 : (value - minValue) / (maxValue - minValue);
    return CHART_PADDING_TOP + innerHeight - ratio * innerHeight;
  };
  const endLabels = [
    {
      key: series[0].label,
      label: `${series[0].label}: ${formatCurrency(series[0].finalValue)}`,
      x: xForIndex + 10,
      y: yForValue(series[0].finalValue) - 10,
      className: series[0].textClassName,
    },
    {
      key: series[1].label,
      label: `${series[1].label}: ${formatCurrency(series[1].finalValue)}`,
      x: xForIndex + 10,
      y: yForValue(series[1].finalValue) + 4,
      className: series[1].textClassName,
    },
    {
      key: series[2].label,
      label: `${series[2].label}: ${formatCurrency(series[2].finalValue)}`,
      x: xForIndex + 10,
      y: yForValue(series[2].finalValue) - 4,
      className: series[2].textClassName,
    },
  ];

  return (
    <FireTrackerCard
      title={title}
      description={description}
      className='h-full content-start gap-3 xl:p-5'
    >
      <p className='text-sm leading-6 text-foreground/72'>{summaryText}</p>

      <div className='flex flex-wrap gap-3 text-[11px] leading-4 text-foreground/72'>
        {series.map((item) => (
          <div key={item.label} className='flex items-center gap-2'>
            <span className='relative inline-flex h-2.5 w-4 items-center'>
              <span
                className={`${item.lineClassName} w-full border-t border-current`}
                style={{
                  borderTopWidth: item.strokeWidth,
                  borderTopStyle: item.strokeDasharray ? 'dashed' : 'solid',
                }}
              />
            </span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <div className='overflow-hidden rounded-[var(--radius-sm)] border border-border-token/70 bg-surface/50 px-2 py-3 xl:px-3'>
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          className='h-auto w-full'
          role='img'
          aria-label={title}
        >
          <line
            x1={CHART_PADDING_X}
            y1={CHART_HEIGHT - CHART_PADDING_BOTTOM}
            x2={CHART_WIDTH - CHART_PADDING_X}
            y2={CHART_HEIGHT - CHART_PADDING_BOTTOM}
            className='stroke-border-token/80'
            strokeWidth='1'
          />

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

          {endLabels.map((item) => (
            <text
              key={item.key}
              x={item.x}
              y={item.y}
              className={`${item.className} text-[10px]`}
            >
              {item.label}
            </text>
          ))}

          <text
            x={CHART_PADDING_X}
            y={CHART_HEIGHT - 8}
            className='fill-foreground/64 text-[10px]'
          >
            {startLabel}
          </text>
          <text
            x={CHART_WIDTH - CHART_PADDING_X}
            y={CHART_HEIGHT - 8}
            textAnchor='end'
            className='fill-foreground/64 text-[10px]'
          >
            {endLabel}
          </text>
        </svg>
      </div>
    </FireTrackerCard>
  );
}
