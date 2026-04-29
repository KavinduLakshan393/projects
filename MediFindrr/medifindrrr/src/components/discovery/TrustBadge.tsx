import React from 'react';

export default function TrustBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-800 shadow-sm">
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
        <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3Zm-2 9 1.5 1.5L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Educational Medicine Information
    </div>
  );
}