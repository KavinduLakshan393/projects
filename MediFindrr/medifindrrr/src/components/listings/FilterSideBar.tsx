import React from 'react';

export interface MedicineFilters {
  prescription: boolean;
  otc: boolean;
  tablet: boolean;
  syrup: boolean;
}

type FilterKey = keyof MedicineFilters;

interface FilterSidebarProps {
  filters: MedicineFilters;
  priceRange: number;
  maxPrice?: number;
  onFilterChange: (key: FilterKey, checked: boolean) => void;
  onPriceChange: (value: number) => void;
}

const filterOptions: { key: FilterKey; label: string }[] = [
  { key: 'prescription', label: 'Prescription Required' },
  { key: 'otc', label: 'Over the Counter' },
  { key: 'tablet', label: 'Tablet' },
  { key: 'syrup', label: 'Syrup' },
];

export default function FilterSidebar({
  filters,
  priceRange,
  maxPrice = 5000,
  onFilterChange,
  onPriceChange,
}: FilterSidebarProps) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Filters</h2>

      <div className="mt-5 space-y-4">
        {filterOptions.map((item) => (
          <label key={item.key} className="flex items-center gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={filters[item.key]}
              onChange={(e) => onFilterChange(item.key, e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-[#2563EB] focus:ring-blue-500"
            />
            <span>{item.label}</span>
          </label>
        ))}
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">Price Range</span>
          <span className="text-sm font-semibold text-[#2563EB]">Up to Rs. {priceRange}</span>
        </div>

        <input
          type="range"
          min={0}
          max={maxPrice}
          value={priceRange}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="w-full accent-[#2563EB]"
        />
      </div>
    </aside>
  );
}