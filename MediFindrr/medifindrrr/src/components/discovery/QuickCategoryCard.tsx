import React, { ReactNode } from 'react';

interface QuickCategoryCardProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}

export default function QuickCategoryCard({
  icon,
  label,
  onClick,
}: QuickCategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
        {icon}
      </span>
      <span className="text-sm font-semibold text-slate-800">{label}</span>
    </button>
  );
}