'use client';
/**
 * FILE: src/components/tools/fire-tracker/FireTrackerCalculator.tsx
 *
 * PURPOSE:
 * - Hosts the localized FIRE Tracker calculator state, field config, and result mapping
 *
 * NOTES:
 * - Formatting and parsing helpers are kept in sibling modules so this file can
 *   stay focused on calculator behavior and rendering
 */

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { calculateCoastFire } from '@/lib/fire';
import { FireTrackerCard } from './FireTrackerCard';
import { FireTrackerInputField } from './FireTrackerInputField';
import { FireTrackerProjectionChart } from './FireTrackerProjectionChart';
import { FireTrackerResults } from './FireTrackerResults';
import {
  getLocaleTag,
  parseNumber,
  toDecimalPercent,
} from './fireTrackerFormatters';
import type {
  CalculatorField,
  CalculatorFormState,
  ResultItem,
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
  const chartPercentFormatter = new Intl.NumberFormat(
    locale === 'it' ? 'it-IT' : 'en-US',
    {
      style: 'percent',
      maximumFractionDigits: 1,
    },
  );
  const [form, setForm] = useState<CalculatorFormState>(defaultValues);
  const [editingField, setEditingField] = useState<keyof CalculatorFormState | null>(
    null,
  );
  const [result, setResult] = useState<ReturnType<typeof calculateCoastFire> | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const fields: CalculatorField[] = [
    {
      key: 'currency',
      label: t('beta.fields.currency'),
      kind: 'currency',
    },
    {
      key: 'currentAge',
      label: t('beta.fields.currentAge'),
      kind: 'number',
      inputMode: 'numeric',
      step: '1',
    },
    {
      key: 'retirementAge',
      label: t('beta.fields.retirementAge'),
      kind: 'number',
      inputMode: 'numeric',
      step: '1',
    },
    {
      key: 'annualSpending',
      label: t('beta.fields.annualSpending'),
      kind: 'money',
      inputMode: 'decimal',
    },
    {
      key: 'currentInvestedAssets',
      label: t('beta.fields.currentInvestedAssets'),
      kind: 'money',
      inputMode: 'decimal',
    },
    {
      key: 'monthlyContribution',
      label: t('beta.fields.monthlyContribution'),
      kind: 'money',
      inputMode: 'decimal',
    },
    {
      key: 'expectedReturn',
      label: t('beta.fields.expectedReturn'),
      kind: 'percent',
      inputMode: 'decimal',
      step: '0.5',
      suffix: '%',
    },
    {
      key: 'inflationRate',
      label: t('beta.fields.inflation'),
      kind: 'percent',
      inputMode: 'decimal',
      step: '0.5',
      suffix: '%',
    },
    {
      key: 'withdrawalRate',
      label: t('beta.fields.safeWithdrawalRate'),
      kind: 'percent',
      inputMode: 'decimal',
      step: '0.5',
      suffix: '%',
    },
  ];

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

  const resultItems: ResultItem[] = result
    ? [
        {
          label: t('beta.results.fireNumber'),
          value: currencyFormatter.format(result.fireNumber),
        },
        {
          label: t('beta.results.coastFireNumberToday'),
          value: currencyFormatter.format(result.coastFireNumberToday),
        },
        {
          label: t('beta.results.projectedPortfolioAtRetirement'),
          value: currencyFormatter.format(result.projectedPortfolioAtRetirement),
        },
        {
          label: t('beta.results.hasReachedCoastFire'),
          value: result.hasReachedCoastFire
            ? t('beta.results.yes')
            : t('beta.results.no'),
        },
        {
          label: t('beta.results.progressToCoastFire'),
          value: percentFormatter.format(result.progressToCoastFire),
        },
        {
          label: t('beta.results.progressToFullFire'),
          value: percentFormatter.format(result.progressToFullFire),
        },
        {
          label: t('beta.results.yearsToRetirement'),
          value: numberFormatter.format(result.yearsToRetirement),
        },
        {
          label: t('beta.results.realReturn'),
          value: percentFormatter.format(result.realReturn),
        },
      ]
    : [];

  return (
    <>
      <FireTrackerCard title={t('beta.calculator.title')} className='gap-4'>
        <div className='grid w-full grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2 lg:grid-cols-3'>
          {fields.map((field) => (
            <FireTrackerInputField
              key={field.key}
              field={field}
              value={form[field.key]}
              currency={form.currency}
              locale={locale}
              decimalSeparator={decimalSeparator}
              isEditing={editingField === field.key}
              onChange={handleChange}
              onFocus={setEditingField}
              onBlur={() => setEditingField(null)}
            />
          ))}
        </div>

        <div className='flex items-center justify-end gap-2 pt-2'>
          <Button type='button' onClick={handleCalculate}>
            {t('beta.actions.calculate')}
          </Button>
        </div>

        {error ? <p className='text-sm text-red-500'>{error}</p> : null}
      </FireTrackerCard>

      {result ? (
        <>
          <FireTrackerResults title={t('beta.results.title')} items={resultItems} />
          <FireTrackerProjectionChart
            title={t('beta.chart.title')}
            description={t('beta.chart.description')}
            startLabel={`${t('beta.chart.age')} ${result.projection[0]?.age ?? ''}`}
            endLabel={`${t('beta.chart.age')} ${
              result.projection[result.projection.length - 1]?.age ?? ''
            }`}
            legend={{
              withContributions: t('beta.chart.legend.withContributions'),
              withoutContributions: t('beta.chart.legend.withoutContributions'),
              fireTarget: t('beta.chart.legend.fireTarget'),
            }}
            summaryText={t('beta.chart.summaryText', {
              value: currencyFormatter.format(
                result.projection[result.projection.length - 1]?.portfolioWithContributions ?? 0,
              ),
              progress: chartPercentFormatter.format(
                result.fireNumber === 0
                  ? 0
                  : (result.projection[result.projection.length - 1]?.portfolioWithContributions ??
                      0) / result.fireNumber,
              ),
            })}
            formatCurrency={(value) => currencyFormatter.format(value)}
            points={result.projection}
          />
        </>
      ) : null}
    </>
  );
}
