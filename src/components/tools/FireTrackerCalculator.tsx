"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { calculateCoastFire } from "@/lib/fire";

type CalculatorFormState = {
  currentAge: string;
  retirementAge: string;
  annualSpending: string;
  currentInvestedAssets: string;
  monthlyContribution: string;
  expectedReturn: string;
  inflationRate: string;
  withdrawalRate: string;
};

type CalculatorField = {
  key: keyof CalculatorFormState;
  label: string;
  inputMode: "numeric" | "decimal";
  step: string;
  suffix?: string;
};

const defaultValues: CalculatorFormState = {
  currentAge: "46",
  retirementAge: "60",
  annualSpending: "30000",
  currentInvestedAssets: "30000",
  monthlyContribution: "500",
  expectedReturn: "7",
  inflationRate: "3",
  withdrawalRate: "4",
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

function parseNumber(value: string, label: string) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(`${label} must be a valid number`);
  }

  return parsed;
}

function toDecimalPercent(value: number) {
  return value / 100;
}

export function FireTrackerCalculator() {
  const t = useTranslations("FireTracker");
  const [form, setForm] = useState<CalculatorFormState>(defaultValues);
  const [result, setResult] = useState<ReturnType<typeof calculateCoastFire> | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const fields: CalculatorField[] = [
    {
      key: "currentAge",
      label: t("beta.fields.currentAge"),
      inputMode: "numeric",
      step: "1",
    },
    {
      key: "retirementAge",
      label: t("beta.fields.retirementAge"),
      inputMode: "numeric",
      step: "1",
    },
    {
      key: "annualSpending",
      label: t("beta.fields.annualSpending"),
      inputMode: "decimal",
      step: "100",
    },
    {
      key: "currentInvestedAssets",
      label: t("beta.fields.currentInvestedAssets"),
      inputMode: "decimal",
      step: "100",
    },
    {
      key: "monthlyContribution",
      label: t("beta.fields.monthlyContribution"),
      inputMode: "decimal",
      step: "50",
    },
    {
      key: "expectedReturn",
      label: t("beta.fields.expectedReturn"),
      inputMode: "decimal",
      step: "0.1",
      suffix: "%",
    },
    {
      key: "inflationRate",
      label: t("beta.fields.inflation"),
      inputMode: "decimal",
      step: "0.1",
      suffix: "%",
    },
    {
      key: "withdrawalRate",
      label: t("beta.fields.safeWithdrawalRate"),
      inputMode: "decimal",
      step: "0.1",
      suffix: "%",
    },
  ];

  function handleChange(key: keyof CalculatorFormState, value: string) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleCalculate() {
    try {
      const nextResult = calculateCoastFire({
        currentAge: parseNumber(form.currentAge, t("beta.fields.currentAge")),
        retirementAge: parseNumber(
          form.retirementAge,
          t("beta.fields.retirementAge"),
        ),
        annualSpending: parseNumber(
          form.annualSpending,
          t("beta.fields.annualSpending"),
        ),
        currentInvestedAssets: parseNumber(
          form.currentInvestedAssets,
          t("beta.fields.currentInvestedAssets"),
        ),
        monthlyContribution: parseNumber(
          form.monthlyContribution,
          t("beta.fields.monthlyContribution"),
        ),
        expectedReturn: toDecimalPercent(
          parseNumber(form.expectedReturn, t("beta.fields.expectedReturn")),
        ),
        inflationRate: toDecimalPercent(
          parseNumber(form.inflationRate, t("beta.fields.inflation")),
        ),
        withdrawalRate: toDecimalPercent(
          parseNumber(
            form.withdrawalRate,
            t("beta.fields.safeWithdrawalRate"),
          ),
        ),
      });

      setResult(nextResult);
      setError(null);
    } catch (caughtError) {
      setResult(null);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : t("beta.errors.generic"),
      );
    }
  }

  const resultItems = result
    ? [
        {
          label: t("beta.results.fireNumber"),
          value: currencyFormatter.format(result.fireNumber),
        },
        {
          label: t("beta.results.coastFireNumberToday"),
          value: currencyFormatter.format(result.coastFireNumberToday),
        },
        {
          label: t("beta.results.projectedPortfolioAtRetirement"),
          value: currencyFormatter.format(result.projectedPortfolioAtRetirement),
        },
        {
          label: t("beta.results.hasReachedCoastFire"),
          value: result.hasReachedCoastFire
            ? t("beta.results.yes")
            : t("beta.results.no"),
        },
        {
          label: t("beta.results.progressToCoastFire"),
          value: percentFormatter.format(result.progressToCoastFire),
        },
        {
          label: t("beta.results.progressToFullFire"),
          value: percentFormatter.format(result.progressToFullFire),
        },
        {
          label: t("beta.results.yearsToRetirement"),
          value: numberFormatter.format(result.yearsToRetirement),
        },
        {
          label: t("beta.results.realReturn"),
          value: percentFormatter.format(result.realReturn),
        },
      ]
    : [];

  return (
    <div className="section-grid gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.key}
            className="section-grid gap-2 rounded-[var(--radius-md)] border border-border-token bg-surface-strong p-4"
          >
            <label
              htmlFor={field.key}
              className="text-sm font-semibold text-foreground"
            >
              {field.label}
            </label>
            <div className="flex items-center gap-3">
              <input
                id={field.key}
                type="number"
                inputMode={field.inputMode}
                step={field.step}
                value={form[field.key]}
                onChange={(event) => handleChange(field.key, event.target.value)}
                className="h-12 w-full rounded-full border border-border-token bg-input px-5 text-sm text-foreground outline-none placeholder:text-foreground/50 focus:border-accent-token"
              />
              {field.suffix ? (
                <span className="text-sm text-foreground/64">{field.suffix}</span>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Button type="button" onClick={handleCalculate}>
          {t("beta.actions.calculate")}
        </Button>
      </div>

      {error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : null}

      {result ? (
        <div className="section-grid gap-3 rounded-[var(--radius-md)] border border-border-token bg-surface-strong p-4">
          <h3 className="text-lg font-bold tracking-[-0.02em] text-foreground">
            {t("beta.results.title")}
          </h3>
          <dl className="section-grid gap-3">
            {resultItems.map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-1 border-b border-border-token/70 pb-3 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <dt className="text-sm text-foreground/72">{item.label}</dt>
                <dd className="text-sm font-semibold text-foreground">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
    </div>
  );
}
