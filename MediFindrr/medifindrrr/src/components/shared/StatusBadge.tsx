import React from 'react';

type StatusVariant = 'rx' | 'otc' | 'generic';

interface StatusBadgeProps {
  variant: StatusVariant;
  label?: string;
}

const styles: Record<StatusVariant, string> = {
  rx: 'bg-red-50 text-red-600 ring-red-200',
  otc: 'bg-blue-50 text-blue-700 ring-blue-200',
  generic: 'bg-teal-50 text-teal-700 ring-teal-200',
};

const defaultLabels: Record<StatusVariant, string> = {
  rx: 'Rx',
  otc: 'OTC',
  generic: 'Generic Substitute',
};

export default function StatusBadge({ variant, label }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${styles[variant]}`}
    >
      {label ?? defaultLabels[variant]}
    </span>
  );
}