'use client';
/**
 * FILE: src/components/tools/fire-tracker/FireTrackerCalculator.tsx
 *
 * PURPOSE:
 * - Hosts FIRE Tracker calculator state, parsing, calculation execution, and high-level rendering
 *
 * NOTES:
 * - Field config, input panel rendering, and result-item mapping live in sibling modules
 *   so this component stays focused on orchestration
 */

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { calculateCoastFire } from '@/lib/fire';
import { FireTrackerCalculatorForm } from './FireTrackerCalculatorForm';
import { FireTrackerProjectionChart } from './FireTrackerProjectionChart';
import { FireTrackerResults } from './FireTrackerResults';
import { getFireTrackerCalculatorFields } from './fireTrackerCalculatorFields';
import {
  buildFireTrackerResultItems,
} from './fireTrackerResultItems';
import {
  getLocaleTag,
  parseNumber,
  toDecimalPercent,
} from './fireTrackerFormatters';
import type {
  CalculatorFormState,
  FireTrackerPlanStatus,
} from './fireTrackerTypes';

const defaultValues: CalculatorFormState = {
  currency: 'EUR',
  currentAge: '46',
  retirementAge: '60',
  annualSpending: '30000',
  currentInvestedAssets: '30000',
  monthlyContribution: '500',
  expectedReturn: '7',
  inflationRate: '3',
  withdrawalRate: '4',
};

const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 1,
});

const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
});

export function FireTrackerCalculator() {
  const locale = useLocale();
  const decimalSeparator = locale === 'it' ? ',' : '.';
  const t = useTranslations('FireTracker');
  const [form, setForm] = useState<CalculatorFormState>(defaultValues);
  const [editingField, setEditingField] = useState<keyof CalculatorFormState | null>(
    null,
  );
  const [result, setResult] = useState<ReturnType<typeof calculateCoastFire> | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const fields = getFireTrackerCalculatorFields({
    currency: t('beta.fields.currency'),
    currentAge: t('beta.fields.currentAge'),
    retirementAge: t('beta.fields.retirementAge'),
    annualSpending: t('beta.fields.annualSpending'),
    currentInvestedAssets: t('beta.fields.currentInvestedAssets'),
    monthlyContribution: t('beta.fields.monthlyContribution'),
    expectedReturn: t('beta.fields.expectedReturn'),
    inflationRate: t('beta.fields.inflation'),
    withdrawalRate: t('beta.fields.safeWithdrawalRate'),
  });

  const currencyFormatter = new Intl.NumberFormat(getLocaleTag(locale), {
    style: 'currency',
    currency: form.currency,
    maximumFractionDigits: 0,
  });

  function handleChange(key: keyof CalculatorFormState, value: string) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleCalculate() {
    try {
      const nextResult = calculateCoastFire({
        currentAge: parseNumber(form.currentAge, t('beta.fields.currentAge')),
        retirementAge: parseNumber(
          form.retirementAge,
          t('beta.fields.retirementAge'),
        ),
        annualSpending: parseNumber(
          form.annualSpending,
          t('beta.fields.annualSpending'),
        ),
        currentInvestedAssets: parseNumber(
          form.currentInvestedAssets,
          t('beta.fields.currentInvestedAssets'),
        ),
        monthlyContribution: parseNumber(
          form.monthlyContribution,
          t('beta.fields.monthlyContribution'),
        ),
        expectedReturn: toDecimalPercent(
          parseNumber(form.expectedReturn, t('beta.fields.expectedReturn')),
        ),
        inflationRate: toDecimalPercent(
          parseNumber(form.inflationRate, t('beta.fields.inflation')),
        ),
        withdrawalRate: toDecimalPercent(
          parseNumber(form.withdrawalRate, t('beta.fields.safeWithdrawalRate')),
        ),
      });

      setResult(nextResult);
      setError(null);
    } catch (caughtError) {
      setResult(null);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : t('beta.errors.generic'),
      );
    }
  }

  const resultItems = result
    ? [
        ...buildFireTrackerResultItems({
          result,
          formatCurrency: (value) => currencyFormatter.format(value),
          formatPercent: (value) => percentFormatter.format(value),
          formatNumber: (value) => numberFormatter.format(value),
          labels: {
            planStatus: t('beta.results.planStatus'),
            fireNumber: t('beta.results.fireNumber'),
            coastFireNumberToday: t('beta.results.coastFireNumberToday'),
            projectedPortfolioAtRetirement: t('beta.results.projectedPortfolioAtRetirement'),
            coastFireToday: t('beta.results.coastFireToday'),
            fireByRetirement: t('beta.results.fireByRetirement'),
            progressToCoastFire: t('beta.results.progressToCoastFire'),
            progressToFullFire: t('beta.results.progressToFullFire'),
            yearsToRetirement: t('beta.results.yearsToRetirement'),
            realReturn: t('beta.results.realReturn'),
            yes: t('beta.results.yes'),
            no: t('beta.results.no'),
          },
          getStatusLabel: (status) =>
            t(`beta.results.statuses.${status as FireTrackerPlanStatus}`),
        }),
      ]
    : [];

  return (
    <>
      <FireTrackerCalculatorForm
        title={t('beta.calculator.title')}
        calculateLabel={t('beta.actions.calculate')}
        fields={fields}
        form={form}
        currency={form.currency}
        locale={locale}
        decimalSeparator={decimalSeparator}
        editingField={editingField}
        error={error}
        onChange={handleChange}
        onFocus={setEditingField}
        onBlur={() => setEditingField(null)}
        onCalculate={handleCalculate}
      />

      {result ? (
        <>
          <FireTrackerResults
            title={t('beta.results.title')}
            summaryText={t(
              `beta.results.summaries.${result.planStatus as FireTrackerPlanStatus}`,
            )}
            items={resultItems}
          />
          <FireTrackerProjectionChart
            title={t('beta.chart.title')}
            startLabel={`${t('beta.chart.age')} ${result.projection[0]?.age ?? ''}`}
            endLabel={`${t('beta.chart.age')} ${
              result.projection[result.projection.length - 1]?.age ?? ''
            }`}
            legend={{
              totalPortfolio: t('beta.chart.legend.totalPortfolio'),
              capitalInvested: t('beta.chart.legend.capitalInvested'),
              currentCapitalGrowth: t('beta.chart.legend.currentCapitalGrowth'),
              fireTarget: t('beta.chart.legend.fireTarget'),
            }}
            help={{
              title: t('beta.chart.help.title'),
              items: [
                t('beta.chart.help.items.totalPortfolio'),
                t('beta.chart.help.items.capitalInvested'),
                t('beta.chart.help.items.currentCapitalGrowth'),
                t('beta.chart.help.items.fireTarget'),
                t('beta.chart.help.items.reachesFire'),
              ],
            }}
            tooltipLabels={{
              age: t('beta.chart.tooltip.age'),
              portfolio: t('beta.chart.tooltip.portfolio'),
              withoutContributions: t('beta.chart.tooltip.withoutContributions'),
              fireTarget: t('beta.chart.tooltip.fireTarget'),
              gap: t('beta.chart.tooltip.gap'),
            }}
            formatCurrency={(value) => currencyFormatter.format(value)}
            initialCapital={result.currentInvestedAssets}
            monthlyContribution={result.monthlyContribution}
            points={result.projection}
          />
        </>
      ) : null}
    </>
  );
}
