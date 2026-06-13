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

import { useEffect, useState } from 'react';
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
  pensionStartAge: '67',
  annualSpending: '30000',
  annualPensionIncome: '0',
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

const FIRE_TRACKER_CALCULATOR_INPUTS_STORAGE_KEY =
  'nine2fire-fire-tracker-calculator-inputs';

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
  const [hasHydratedStoredForm, setHasHydratedStoredForm] = useState(false);

  const fields = getFireTrackerCalculatorFields({
    currency: t('beta.fields.currency'),
    currentAge: t('beta.fields.currentAge'),
    retirementAge: t('beta.fields.retirementAge'),
    pensionStartAge: t('beta.fields.pensionStartAge'),
    annualSpending: t('beta.fields.annualSpending'),
    annualPensionIncome: t('beta.fields.annualPensionIncome'),
    currentInvestedAssets: t('beta.fields.currentInvestedAssets'),
    monthlyContribution: t('beta.fields.monthlyContribution'),
    expectedReturn: t('beta.fields.expectedReturn'),
    inflationRate: t('beta.fields.inflation'),
    withdrawalRate: t('beta.fields.safeWithdrawalRate'),
    tooltipAriaLabel: (field) => t('beta.fieldsInfo.ariaLabel', { field }),
    tooltips: {
      currency: t('beta.fieldsInfo.items.currency'),
      currentAge: t('beta.fieldsInfo.items.currentAge'),
      retirementAge: t('beta.fieldsInfo.items.retirementAge'),
      pensionStartAge: t('beta.fieldsInfo.items.pensionStartAge'),
      annualSpending: t('beta.fieldsInfo.items.annualSpending'),
      annualPensionIncome: t('beta.fieldsInfo.items.annualPensionIncome'),
      currentInvestedAssets: t('beta.fieldsInfo.items.currentInvestedAssets'),
      monthlyContribution: t('beta.fieldsInfo.items.monthlyContribution'),
      expectedReturn: t('beta.fieldsInfo.items.expectedReturn'),
      inflationRate: t('beta.fieldsInfo.items.inflation'),
      withdrawalRate: t('beta.fieldsInfo.items.safeWithdrawalRate'),
    },
  });

  const currencyFormatter = new Intl.NumberFormat(getLocaleTag(locale), {
    style: 'currency',
    currency: form.currency,
    maximumFractionDigits: 0,
  });
  const estimateFormatter = new Intl.NumberFormat(getLocaleTag(locale), {
    maximumFractionDigits: 1,
  });

  useEffect(() => {
    try {
      const storedForm = window.localStorage.getItem(
        FIRE_TRACKER_CALCULATOR_INPUTS_STORAGE_KEY,
      );

      if (!storedForm) {
        return;
      }

      const parsedForm = JSON.parse(storedForm) as Partial<CalculatorFormState>;
      const nextForm = {
        ...defaultValues,
        ...Object.fromEntries(
          Object.entries(parsedForm).filter((entry): entry is [
            keyof CalculatorFormState,
            string,
          ] => {
            const [key, value] = entry;

            return key in defaultValues && typeof value === 'string';
          }),
        ),
      };

      setForm(nextForm);
    } catch {
      // Ignore malformed saved inputs and keep the defaults.
    } finally {
      setHasHydratedStoredForm(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydratedStoredForm) {
      return;
    }

    window.localStorage.setItem(
      FIRE_TRACKER_CALCULATOR_INPUTS_STORAGE_KEY,
      JSON.stringify(form),
    );
  }, [form, hasHydratedStoredForm]);

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
        pensionStartAge: parseNumber(
          form.pensionStartAge,
          t('beta.fields.pensionStartAge'),
        ),
        annualSpending: parseNumber(
          form.annualSpending,
          t('beta.fields.annualSpending'),
        ),
        annualPensionIncome: parseNumber(
          form.annualPensionIncome,
          t('beta.fields.annualPensionIncome'),
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
          formatEstimate: (value) => estimateFormatter.format(value),
          labels: {
            planStatus: t('beta.results.planStatus'),
            fireNumber: t('beta.results.fireNumber'),
            adjustedFireNumber: t('beta.results.adjustedFireNumber'),
            yearsToFire: t('beta.results.yearsToFire'),
            estimatedFireAge: t('beta.results.estimatedFireAge'),
            pensionStartAge: t('beta.results.pensionStartAge'),
            annualPensionIncome: t('beta.results.annualPensionIncome'),
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
            alreadyReached: t('beta.results.alreadyReached'),
            notReachedWithinCurrentAssumptions: t('beta.results.notReachedWithinCurrentAssumptions'),
          },
          getStatusLabel: (status) =>
            t(`beta.results.statuses.${status as FireTrackerPlanStatus}`),
        }),
      ]
    : [];

  return (
    <>
      <div className='w-full lg:col-start-2'>
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
      </div>

      {result ? (
        <>
          <div className='w-full lg:col-span-2'>
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
              markers={{
                retirementAge: {
                  age: result.retirementAge,
                  label: t('beta.chart.markers.retirementAge'),
                },
                pensionStartAge: {
                  age: result.pensionStartAge,
                  label: t('beta.chart.markers.pensionStartAge'),
                },
                fireAge:
                  result.fireAge === null
                    ? null
                    : {
                        age: result.fireAge,
                        label: t('beta.chart.markers.fireAge'),
                      },
              }}
              tooltipLabels={{
                age: t('beta.chart.tooltip.age'),
                portfolio: t('beta.chart.tooltip.portfolio'),
                withoutContributions: t('beta.chart.tooltip.withoutContributions'),
                fireTarget: t('beta.chart.tooltip.fireTarget'),
                gap: t('beta.chart.tooltip.gap'),
                pensionActive: t('beta.chart.tooltip.pensionActive'),
                yes: t('beta.results.yes'),
                no: t('beta.results.no'),
              }}
              formatCurrency={(value) => currencyFormatter.format(value)}
              initialCapital={result.currentInvestedAssets}
              monthlyContribution={result.monthlyContribution}
              points={result.projection}
            />
          </div>
          <div className='w-full lg:col-span-2'>
            <FireTrackerResults
              title={t('beta.results.title')}
              summaryText={t(
                `beta.results.summaries.${result.planStatus as FireTrackerPlanStatus}`,
              )}
              items={resultItems}
            />
          </div>
        </>
      ) : null}
    </>
  );
}
