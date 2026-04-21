import React, { ReactNode } from 'react';

type AlertTone = 'success' | 'warning' | 'danger';

interface AlertBannerProps {
  tone: AlertTone;
  title: string;
  message?: string;
  children?: ReactNode;
}

const toneStyles: Record<AlertTone, string> = {
  success: 'border-teal-200 bg-teal-50 text-teal-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
  danger: 'border-red-200 bg-red-50 text-red-900',
};

function Icon({ tone }: { tone: AlertTone }) {
  if (tone === 'success') {
    return (
      <svg className="mt-0.5 h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M20 7L10 17l-5-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg className="mt-0.5 h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none">
      <path d="M12 9v4m0 4h.01M10.29 3.86l-7.5 13A2 2 0 0 0 4.5 20h15a2 2 0 0 0 1.71-3.14l-7.5-13a2 2 0 0 0-3.42 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AlertBanner({ tone, title, message, children }: AlertBannerProps) {
  return (
    <div className={`rounded-xl border px-4 py-3 shadow-sm ${toneStyles[tone]}`}>
      <div className="flex items-start gap-3">
        <Icon tone={tone} />
        <div className="min-w-0">
          <p className="text-sm font-semibold">{title}</p>
          {message ? <p className="mt-1 text-sm opacity-90">{message}</p> : null}
          {children ? <div className="mt-2 text-sm">{children}</div> : null}
        </div>
      </div>
    </div>
  );
}