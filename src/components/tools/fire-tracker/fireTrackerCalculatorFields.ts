/**
 * FILE: src/components/tools/fire-tracker/fireTrackerCalculatorFields.ts
 *
 * PURPOSE:
 * - Centralizes the localized FIRE Tracker calculator field definitions
 */
import type { CalculatorField } from './fireTrackerTypes';

type FireTrackerCalculatorFieldLabels = {
  currency: string;
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
  tooltipAriaLabel: (field: string) => string;
  tooltips: {
    currency: string;
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
};

export function getFireTrackerCalculatorFields(
  labels: FireTrackerCalculatorFieldLabels,
): CalculatorField[] {
  return [
    {
      key: 'currentInvestedAssets',
      label: labels.currentInvestedAssets,
      tooltip: labels.tooltips.currentInvestedAssets,
      tooltipAriaLabel: labels.tooltipAriaLabel(labels.currentInvestedAssets),
      kind: 'money',
      inputMode: 'decimal',
    },
    {
      key: 'monthlyContribution',
      label: labels.monthlyContribution,
      tooltip: labels.tooltips.monthlyContribution,
      tooltipAriaLabel: labels.tooltipAriaLabel(labels.monthlyContribution),
      kind: 'money',
      inputMode: 'decimal',
    },
    {
      key: 'annualSpending',
      label: labels.annualSpending,
      tooltip: labels.tooltips.annualSpending,
      tooltipAriaLabel: labels.tooltipAriaLabel(labels.annualSpending),
      kind: 'money',
      inputMode: 'decimal',
    },
    {
      key: 'currentAge',
      label: labels.currentAge,
      tooltip: labels.tooltips.currentAge,
      tooltipAriaLabel: labels.tooltipAriaLabel(labels.currentAge),
      kind: 'number',
      inputMode: 'numeric',
      step: '1',
    },
    {
      key: 'retirementAge',
      label: labels.retirementAge,
      tooltip: labels.tooltips.retirementAge,
      tooltipAriaLabel: labels.tooltipAriaLabel(labels.retirementAge),
      kind: 'number',
      inputMode: 'numeric',
      step: '1',
    },
    {
      key: 'pensionStartAge',
      label: labels.pensionStartAge,
      tooltip: labels.tooltips.pensionStartAge,
      tooltipAriaLabel: labels.tooltipAriaLabel(labels.pensionStartAge),
      kind: 'number',
      inputMode: 'numeric',
      step: '1',
    },
    {
      key: 'expectedReturn',
      label: labels.expectedReturn,
      tooltip: labels.tooltips.expectedReturn,
      tooltipAriaLabel: labels.tooltipAriaLabel(labels.expectedReturn),
      kind: 'percent',
      inputMode: 'decimal',
      step: '0.5',
      suffix: '%',
    },
    {
      key: 'inflationRate',
      label: labels.inflationRate,
      tooltip: labels.tooltips.inflationRate,
      tooltipAriaLabel: labels.tooltipAriaLabel(labels.inflationRate),
      kind: 'percent',
      inputMode: 'decimal',
      step: '0.5',
      suffix: '%',
    },
    {
      key: 'withdrawalRate',
      label: labels.withdrawalRate,
      tooltip: labels.tooltips.withdrawalRate,
      tooltipAriaLabel: labels.tooltipAriaLabel(labels.withdrawalRate),
      kind: 'percent',
      inputMode: 'decimal',
      step: '0.5',
      suffix: '%',
    },
    {
      key: 'currency',
      label: labels.currency,
      tooltip: labels.tooltips.currency,
      tooltipAriaLabel: labels.tooltipAriaLabel(labels.currency),
      kind: 'currency',
    },
    {
      key: 'annualPensionIncome',
      label: labels.annualPensionIncome,
      tooltip: labels.tooltips.annualPensionIncome,
      tooltipAriaLabel: labels.tooltipAriaLabel(labels.annualPensionIncome),
      kind: 'money',
      inputMode: 'decimal',
    },
  ];
}
