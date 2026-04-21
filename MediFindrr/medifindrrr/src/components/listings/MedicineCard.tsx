import React from 'react';
import PrimaryButton from '../shared/PrimaryButton';
import StatusBadge from '../shared/StatusBadge';

interface MedicineCardProps {
  brandName: string;
  genericName: string;
  type: 'rx' | 'otc';
  price: string;
  imageUrl?: string;
  dosage?: string;
  onViewDetails?: () => void;
  showGenericSubstituteBadge?: boolean;
}

function PlaceholderPillImage() {
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-slate-100">
      <svg className="h-10 w-10 text-slate-400" viewBox="0 0 24 24" fill="none">
        <path d="M10 14 6.5 17.5a4.95 4.95 0 1 1-7-7L3 7m7 7 7-7m0 0a4.95 4.95 0 1 1 7 7L17 17m0-10L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function MedicineCard({
  brandName,
  genericName,
  type,
  price,
  imageUrl,
  dosage,
  onViewDetails,
  showGenericSubstituteBadge = false,
}: MedicineCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-4">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={brandName}
            className="h-20 w-20 rounded-xl object-cover"
          />
        ) : (
          <PlaceholderPillImage />
        )}

        <div>
          <h3 className="text-lg font-semibold text-slate-900">{brandName}</h3>
          <p className="mt-1 text-sm text-slate-500">{genericName}</p>
          {dosage ? <p className="mt-1 text-sm text-slate-500">{dosage}</p> : null}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge variant={type} />
            {showGenericSubstituteBadge ? <StatusBadge variant="generic" /> : null}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start gap-3 md:items-end">
        <p className="text-lg font-bold text-slate-900">{price}</p>
        <PrimaryButton onClick={onViewDetails}>View Details</PrimaryButton>
      </div>
    </div>
  );
}