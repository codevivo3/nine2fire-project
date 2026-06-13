import type { CoastFirePlanStatus, CoastFireProjectionPoint } from '@/lib/fire';

/**
 * FILE: src/components/tools/fire-tracker/fireTrackerTypes.ts
 *
 * PURPOSE:
 * - Centralizes shared FIRE Tracker calculator types used across the extracted modules
 */
export type CurrencyCode = 'EUR' | 'USD';

export type CalculatorFormState = {
  currency: CurrencyCode;
  currentAge: string;
  retirementAge: string;
  pensionStartAge: string;
  annualSpending: string;
  annualPensionIncome: string;
  currentInvestedAssets: string;
  monthlyContribution: string;
  expectedReturn: string;
  inflationRate: string;
  withdrawalRate: string;
};

export type CalculatorField = {
  key: keyof CalculatorFormState;
  label: string;
  tooltip: string;
  tooltipAriaLabel: string;
  kind: 'currency' | 'number' | 'money' | 'percent';
  inputMode?: 'numeric' | 'decimal';
  step?: string;
  suffix?: string;
};

export type ResultItem = {
  key: string;
  label: string;
  value: string;
  tone?: 'positive' | 'warning';
  progressPercent?: number;
};

export type FireTrackerPlanStatus = CoastFirePlanStatus;

export type ProjectionChartSeries = {
  label: string;
  colorClassName: string;
  linePath: string;
};

export type ProjectionChartPoint = CoastFireProjectionPoint;
