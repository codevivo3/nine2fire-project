import type { ChartEndLabel } from '../fireTrackerChartTypes';

type FireTrackerChartEndLabelsProps = {
  endLabels: ChartEndLabel[];
};

export function FireTrackerChartEndLabels({
  endLabels,
}: FireTrackerChartEndLabelsProps) {
  return endLabels.map((item) => (
    <text
      key={item.key}
      x={item.x}
      y={item.y}
      className={`numeric-value ${item.className} text-[16px] font-bold`}
    >
      {item.label}
    </text>
  ));
}
