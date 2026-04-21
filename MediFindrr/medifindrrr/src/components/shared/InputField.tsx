import React, { InputHTMLAttributes, ReactNode } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: ReactNode;
}

function SearchIcon() {
  return (
    <svg className="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none">
      <path d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function InputField({
  label,
  helperText,
  error,
  icon,
  className = '',
  ...props
}: InputFieldProps) {
  return (
    <label className="block">
      {label ? <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span> : null}

      <div
        className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm transition focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-blue-100 ${
          error ? 'border-red-300' : 'border-slate-200'
        }`}
      >
        {icon ?? <SearchIcon />}
        <input
          {...props}
          className={`w-full border-0 bg-transparent text-base text-slate-800 outline-none placeholder:text-slate-400 ${className}`}
        />
      </div>

      {error ? (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      ) : helperText ? (
        <p className="mt-2 text-sm text-slate-500">{helperText}</p>
      ) : null}
    </label>
  );
}