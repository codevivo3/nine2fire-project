import { CHART_PADDING_LEFT, CHART_PADDING_TOP } from './fireTrackerChartConstants';

export function buildLinePath(
  values: number[],
  minValue: number,
  maxValue: number,
  innerWidth: number,
  innerHeight: number,
) {
  return values
    .map((value, index) => {
      const x =
        CHART_PADDING_LEFT +
        (values.length === 1 ? innerWidth / 2 : (index / (values.length - 1)) * innerWidth);
      const ratio = maxValue === minValue ? 0.5 : (value - minValue) / (maxValue - minValue);
      const y = CHART_PADDING_TOP + innerHeight - ratio * innerHeight;

      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
}
