import React from 'react';
import InputField from '../shared/InputField';
import PrimaryButton from '../shared/PrimaryButton';

interface StackedSearchInputsProps {
  values: string[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove?: (index: number) => void;
}

export default function StackedSearchInputs({
  values,
  onChange,
  onAdd,
  onRemove,
}: StackedSearchInputsProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {values.map((value, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className="flex-1">
            <InputField
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(index, e.target.value)}
              placeholder={`Search medicine ${index + 1}`}
            />
          </div>

          {values.length > 2 && onRemove ? (
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="rounded-lg border border-slate-200 px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Remove
            </button>
          ) : null}
        </div>
      ))}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onAdd}
          className="rounded-lg border border-dashed border-[#2563EB] px-4 py-3 text-sm font-semibold text-[#2563EB] transition hover:bg-blue-50"
        >
          + Add another medicine
        </button>

        <PrimaryButton>Check Interactions</PrimaryButton>
      </div>
    </div>
  );
}