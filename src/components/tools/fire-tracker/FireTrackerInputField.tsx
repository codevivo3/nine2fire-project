/**
 * FILE: src/components/tools/fire-tracker/FireTrackerInputField.tsx
 *
 * PURPOSE:
 * - Renders a single calculator field while preserving locale-aware money input behavior
 *
 * NOTES:
 * - Money fields stay text-based for localized grouping; simpler numeric inputs
 *   keep native browser controls
 */
import {
  formatEditingValue,
  formatMoneyValue,
  getCurrencySymbol,
  normalizeLocalizedNumber,
} from './fireTrackerFormatters';
import { FireTrackerInfoTooltip } from './FireTrackerInfoTooltip';
import type {
  CalculatorField,
  CalculatorFormState,
  CurrencyCode,
} from './fireTrackerTypes';

type FireTrackerInputFieldProps = {
  field: CalculatorField;
  value: string;
  currency: CurrencyCode;
  locale: string;
  decimalSeparator: string;
  isEditing: boolean;
  onChange: (key: keyof CalculatorFormState, value: string) => void;
  onFocus: (key: keyof CalculatorFormState) => void;
  onBlur: () => void;
};

export function FireTrackerInputField({
  field,
  value,
  currency,
  locale,
  decimalSeparator,
  isEditing,
  onChange,
  onFocus,
  onBlur,
}: FireTrackerInputFieldProps) {
  const currencySymbol = getCurrencySymbol(currency);
  const isCurrencyField = field.kind === 'currency';
  const isMoneyField = field.kind === 'money';
  const isNativeNumberField = field.kind === 'number' || field.kind === 'percent';
  const adornment = isMoneyField ? currencySymbol : field.suffix;
  const displayValue = isMoneyField && !isEditing
    ? formatMoneyValue(value, locale)
    : isNativeNumberField
      ? value
      : formatEditingValue(value, locale);

  return (
    <div className='flex min-w-0 flex-col'>
      <div className='mb-1 flex items-center justify-between gap-3 px-1'>
        <label
          htmlFor={field.key}
          className='min-w-0 text-[11px] font-medium leading-none text-foreground/72'
        >
          {field.label}
        </label>
        <FireTrackerInfoTooltip
          label={field.tooltipAriaLabel}
          text={field.tooltip}
        />
      </div>

      <div className='relative'>
        {isCurrencyField ? (
          <>
            <select
              id={field.key}
              value={value}
              onChange={(event) => onChange(field.key, event.target.value)}
              className='h-9 w-full appearance-none rounded-full border border-border-token bg-input px-3.5 pr-10 text-sm font-medium text-primary-token outline-none focus:border-accent-token'
            >
              <option value='EUR'>EUR (€)</option>
              <option value='USD'>USD ($)</option>
            </select>
            <span className='pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-primary-token/70'>
              ▾
            </span>
          </>
        ) : (
          <>
            <input
              id={field.key}
              type={isMoneyField ? 'text' : 'number'}
              inputMode={field.inputMode}
              step={field.step}
              value={displayValue}
              placeholder={decimalSeparator === ',' ? '0,0' : '0.0'}
              onChange={(event) => {
                onChange(
                  field.key,
                  isMoneyField
                    ? normalizeLocalizedNumber(event.target.value, locale)
                    : event.target.value,
                );
              }}
              onFocus={() => onFocus(field.key)}
              onBlur={onBlur}
              className={`h-9 w-full rounded-full border border-border-token bg-input px-3.5 text-sm font-medium text-primary-token outline-none placeholder:text-primary-token/40 focus:border-accent-token${
                adornment ? ' pr-8' : ''
              }`}
            />
            {adornment ? (
              <span className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-primary-token/80'>
                {adornment}
              </span>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
