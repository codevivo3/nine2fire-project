import type { ChartSeries } from '../fireTrackerChartTypes';

type FireTrackerChartSeriesPathsProps = {
  series: ChartSeries[];
};

export function FireTrackerChartSeriesPaths({
  series,
}: FireTrackerChartSeriesPathsProps) {
  return series.map((item) => (
    <path
      key={item.label}
      d={item.linePath}
      className={`${item.lineClassName} fill-none stroke-current`}
      strokeWidth={item.strokeWidth}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeDasharray={item.strokeDasharray}
    />
  ));
}
