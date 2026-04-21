import React from 'react';

interface ActionRowProps {
  onSave?: () => void;
  onShare?: () => void;
  onFindPharmacy?: () => void;
}

function ActionButton({
  label,
  onClick,
  icon,
}: {
  label: string;
  onClick?: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-[#2563EB]"
    >
      {icon}
      {label}
    </button>
  );
}

export default function ActionRow({
  onSave,
  onShare,
  onFindPharmacy,
}: ActionRowProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <ActionButton
        label="Save to Profile"
        onClick={onSave}
        icon={
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      />

      <ActionButton
        label="Share"
        onClick={onShare}
        icon={
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
            <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      />

      <ActionButton
        label="Find Pharmacy"
        onClick={onFindPharmacy}
        icon={
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
            <path d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11Z" stroke="currentColor" strokeWidth="2" />
            <path d="M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke="currentColor" strokeWidth="2" />
          </svg>
        }
      />
    </div>
  );
}