/**
 * FILE: src/components/tools/fire-tracker/FireTrackerCalculatorForm.tsx
 *
 * PURPOSE:
 * - Renders the FIRE Tracker input panel while leaving state ownership to the parent calculator
 */
import { Button } from '@/components/ui/Button';
import { FireTrackerCard } from './FireTrackerCard';
import { FireTrackerInputField } from './FireTrackerInputField';
import type { CalculatorField, CalculatorFormState, CurrencyCode } from './fireTrackerTypes';

type FireTrackerCalculatorFormProps = {
  title: string;
  calculateLabel: string;
  fields: CalculatorField[];
  form: CalculatorFormState;
  currency: CurrencyCode;
  locale: string;
  decimalSeparator: string;
  editingField: keyof CalculatorFormState | null;
  error: string | null;
  onChange: (key: keyof CalculatorFormState, value: string) => void;
  onFocus: (key: keyof CalculatorFormState | null) => void;
  onBlur: () => void;
  onCalculate: () => void;
};

export function FireTrackerCalculatorForm({
  title,
  calculateLabel,
  fields,
  form,
  currency,
  locale,
  decimalSeparator,
  editingField,
  error,
  onChange,
  onFocus,
  onBlur,
  onCalculate,
}: FireTrackerCalculatorFormProps) {
  return (
    <FireTrackerCard title={title} className='gap-4'>
      <div className='grid w-full grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2 lg:grid-cols-3'>
        {fields.map((field) => (
          <FireTrackerInputField
            key={field.key}
            field={field}
            value={form[field.key]}
            currency={currency}
            locale={locale}
            decimalSeparator={decimalSeparator}
            isEditing={editingField === field.key}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        ))}
      </div>

      <div className='flex items-center justify-end gap-2 pt-2'>
        <Button type='button' onClick={onCalculate}>
          {calculateLabel}
        </Button>
      </div>

      {error ? <p className='text-sm text-red-500'>{error}</p> : null}
    </FireTrackerCard>
  );
}
