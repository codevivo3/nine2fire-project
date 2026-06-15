'use client';
import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { calculateCoastFire } from '@/lib/fire';
import { FireTrackerCalculatorForm } from './FireTrackerCalculatorForm';
import { FireTrackerProjectionChart } from './FireTrackerProjectionChart';
import { FireTrackerResults } from './FireTrackerResults';
import { buildFireTrackerProjectionProps } from './calculator/fireTrackerProjectionProps';
import { buildFireTrackerResultViewModel } from './calculator/fireTrackerResultViewModel';
import { getFireTrackerCalculatorFields } from './fireTrackerCalculatorFields';
import { getLocaleTag, parseNumber, toDecimalPercent } from './fireTrackerFormatters';
import type { CalculatorFormState } from './fireTrackerTypes';

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

const FIRE_TRACKER_CALCULATOR_INPUTS_STORAGE_KEY = 'nine2fire-fire-tracker-calculator-inputs';

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

  const resultViewModel = result
    ? buildFireTrackerResultViewModel({
        result,
        t,
        formatCurrency: (value) => currencyFormatter.format(value),
        formatPercent: (value) => percentFormatter.format(value),
        formatNumber: (value) => numberFormatter.format(value),
        formatEstimate: (value) => estimateFormatter.format(value),
      })
    : null;
  const projectionChartProps = result
    ? buildFireTrackerProjectionProps({
        result,
        t,
        formatCurrency: (value) => currencyFormatter.format(value),
      })
    : null;

  return (
    <>
      <div className='min-w-0 w-full lg:col-start-2'>
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
          <div className='min-w-0 w-full lg:col-span-2'>
            {projectionChartProps ? <FireTrackerProjectionChart {...projectionChartProps} /> : null}
          </div>
          <div className='min-w-0 w-full lg:col-span-2'>
            <FireTrackerResults
              title={t('beta.results.title')}
              summaryText={resultViewModel?.summaryText}
              items={resultViewModel?.resultItems ?? []}
            />
          </div>
        </>
      ) : null}
    </>
  );
}
