import {
  CHART_PADDING_LEFT,
  CHART_PADDING_TOP,
} from './fireTrackerChartConstants';

export function getRoundedScaleMax(value: number) {
  if (value <= 100_000) return Math.ceil(value / 25_000) * 25_000;
  if (value <= 500_000) return Math.ceil(value / 50_000) * 50_000;
  if (value <= 1_000_000) return Math.ceil(value / 100_000) * 100_000;

  return Math.ceil(value / 250_000) * 250_000;
}

export function getChartXForIndex(
  index: number,
  totalPoints: number,
  innerWidth: number,
) {
  return (
    CHART_PADDING_LEFT +
    (totalPoints === 1 ? innerWidth / 2 : (index / (totalPoints - 1)) * innerWidth)
  );
}

export function getChartXForAge(
  age: number,
  startAge: number,
  endAge: number,
  innerWidth: number,
) {
  const ageSpan = endAge - startAge;

  if (ageSpan <= 0) {
    return CHART_PADDING_LEFT + innerWidth / 2;
  }

  const clampedAge = Math.min(Math.max(age, startAge), endAge);

  return CHART_PADDING_LEFT + ((clampedAge - startAge) / ageSpan) * innerWidth;
}

export function getChartYForValue(
  value: number,
  minValue: number,
  maxValue: number,
  innerHeight: number,
) {
  const ratio = maxValue === minValue ? 0.5 : (value - minValue) / (maxValue - minValue);

  return CHART_PADDING_TOP + innerHeight - ratio * innerHeight;
}
