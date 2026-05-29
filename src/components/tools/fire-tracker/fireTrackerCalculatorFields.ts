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
  annualSpending: string;
  currentInvestedAssets: string;
  monthlyContribution: string;
  expectedReturn: string;
  inflationRate: string;
  withdrawalRate: string;
};

export function getFireTrackerCalculatorFields(
  labels: FireTrackerCalculatorFieldLabels,
): CalculatorField[] {
  return [
    {
      key: 'currency',
      label: labels.currency,
      kind: 'currency',
    },
    {
      key: 'currentAge',
      label: labels.currentAge,
      kind: 'number',
      inputMode: 'numeric',
      step: '1',
    },
    {
      key: 'retirementAge',
      label: labels.retirementAge,
      kind: 'number',
      inputMode: 'numeric',
      step: '1',
    },
    {
      key: 'annualSpending',
      label: labels.annualSpending,
      kind: 'money',
      inputMode: 'decimal',
    },
    {
      key: 'currentInvestedAssets',
      label: labels.currentInvestedAssets,
      kind: 'money',
      inputMode: 'decimal',
    },
    {
      key: 'monthlyContribution',
      label: labels.monthlyContribution,
      kind: 'money',
      inputMode: 'decimal',
    },
    {
      key: 'expectedReturn',
      label: labels.expectedReturn,
      kind: 'percent',
      inputMode: 'decimal',
      step: '0.5',
      suffix: '%',
    },
    {
      key: 'inflationRate',
      label: labels.inflationRate,
      kind: 'percent',
      inputMode: 'decimal',
      step: '0.5',
      suffix: '%',
    },
    {
      key: 'withdrawalRate',
      label: labels.withdrawalRate,
      kind: 'percent',
      inputMode: 'decimal',
      step: '0.5',
      suffix: '%',
    },
  ];
}
