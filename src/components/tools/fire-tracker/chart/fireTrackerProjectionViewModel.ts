import type {
  ChartEndLabel,
  ChartScaleTick,
  ChartSeries,
  FireTrackerChartLegend,
  FireTrackerChartMarkers,
} from '../fireTrackerChartTypes';
import type { ProjectionChartPoint } from '../fireTrackerTypes';
import {
  CHART_HEIGHT,
  CHART_PADDING_BOTTOM,
  CHART_PADDING_LEFT,
  CHART_PADDING_RIGHT,
  CHART_PADDING_TOP,
  CHART_WIDTH,
} from './fireTrackerChartConstants';
import { buildLinePath } from './fireTrackerChartGeometry';
import { buildFireTrackerChartHoverLayout } from './fireTrackerChartHoverLayout';
import { buildFireTrackerChartMarkerLines } from './fireTrackerChartMarkerModel';
import {
  getChartXForAge,
  getChartXForIndex,
  getChartYForValue,
  getRoundedScaleMax,
} from './fireTrackerChartScales';

type BuildFireTrackerProjectionViewModelParams = {
  startLabel: string;
  endLabel: string;
  legend: FireTrackerChartLegend;
  markers: FireTrackerChartMarkers;
  formatCurrency: (value: number) => string;
  initialCapital: number;
  monthlyContribution: number;
  points: ProjectionChartPoint[];
  hoveredIndex: number | null;
};

export function buildFireTrackerProjectionViewModel({
  startLabel,
  endLabel,
  legend,
  markers,
  formatCurrency,
  initialCapital,
  monthlyContribution,
  points,
  hoveredIndex,
}: BuildFireTrackerProjectionViewModelParams) {
  const finalPoint = points[points.length - 1];
  const startAge = points[0]?.age ?? 0;
  const endAge = finalPoint.age;
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
  const xForAge = (age: number) =>
    getChartXForAge(age, startAge, endAge, innerWidth);
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
  const valueLabelX = CHART_WIDTH + 8;
  const endLabels: ChartEndLabel[] = [
    {
      key: series[0].label,
      label: formatCurrency(series[0].finalValue),
      x: valueLabelX,
      y: yForValue(series[0].finalValue) + 5,
      className: series[0].textClassName,
    },
    {
      key: series[2].label,
      label: formatCurrency(series[2].finalValue),
      x: valueLabelX,
      y: yForValue(series[2].finalValue) + 5,
      className: series[2].textClassName,
    },
  ];
  const visibleScaleTicks = scaleTicks.filter((tick) => {
    const overlapsFinalLabel = endLabels.some((label) => Math.abs(tick.y - label.y) < 20);

    return !overlapsFinalLabel;
  });
  const hoveredX = hoveredIndex === null ? null : xForIndex(hoveredIndex);
  const hoveredY =
    hoveredPoint === null ? null : yForValue(hoveredPoint.portfolioWithContributions);
  const markerLines = buildFireTrackerChartMarkerLines({
    markers,
    xForAge,
  });
  const chartBaselineY = CHART_HEIGHT - CHART_PADDING_BOTTOM;
  const {
    hideEndLabel,
    hideStartLabel,
    tooltipGap,
    tooltipPlacement,
  } = buildFireTrackerChartHoverLayout({
    startLabel,
    endLabel,
    valueLabelX,
    hoveredX,
    hoveredY,
    hoveredPoint,
    markerLines,
    endLabels,
  });

  return {
    chartBaselineY,
    endLabels,
    finalPoint,
    fireTargetY,
    hideEndLabel,
    hideStartLabel,
    hoveredPoint,
    initialCapitalY,
    innerHeight,
    markerLines,
    maxValue,
    minValue,
    series,
    tooltipGap,
    tooltipPlacement,
    visibleScaleTicks,
    xForIndex,
    yForValue,
  };
}
