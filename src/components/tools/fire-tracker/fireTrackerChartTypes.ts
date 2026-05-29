/**
 * FILE: src/components/tools/fire-tracker/fireTrackerChartTypes.ts
 *
 * PURPOSE:
 * - Defines shared props and view-model types used across the FIRE Tracker chart subcomponents
 */
import type { ProjectionChartPoint } from './fireTrackerTypes';

export type FireTrackerChartLegend = {
  totalPortfolio: string;
  capitalInvested: string;
  currentCapitalGrowth: string;
  fireTarget: string;
};

export type FireTrackerChartHelp = {
  title: string;
  items: [string, string, string, string, string];
};

export type FireTrackerChartTooltipLabels = {
  age: string;
  portfolio: string;
  withoutContributions: string;
  fireTarget: string;
  gap: string;
};

export type FireTrackerProjectionChartProps = {
  title: string;
  startLabel: string;
  endLabel: string;
  legend: FireTrackerChartLegend;
  help: FireTrackerChartHelp;
  formatCurrency: (value: number) => string;
  tooltipLabels: FireTrackerChartTooltipLabels;
  initialCapital: number;
  monthlyContribution: number;
  points: ProjectionChartPoint[];
};

export type ChartSeries = {
  label: string;
  lineClassName: string;
  textClassName: string;
  dotClassName: string;
  linePath: string;
  finalValue: number;
  strokeWidth: number;
  strokeDasharray?: string;
};

export type ChartScaleTick = {
  value: number;
  y: number;
};

export type ChartEndLabel = {
  key: string;
  label: string;
  x: number;
  y: number;
  className: string;
};
