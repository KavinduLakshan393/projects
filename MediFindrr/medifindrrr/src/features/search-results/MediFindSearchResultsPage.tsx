import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { medicines } from '@/data/medicines';

export default function MediFindSearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState(2000);

  const query = searchParams.get('query') || '';

  const filterOptions = [
    { label: 'Prescription Required', value: 'Rx' },
    { label: 'Over the Counter', value: 'OTC' },
  ];

  const handleFilterChange = (filterValue: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterValue) ? prev.filter((f) => f !== filterValue) : [...prev, filterValue]
    );
  };

  // Filter medicines based on search query and selected filters
  const filteredMedicines = useMemo(() => {
    return medicines.filter((medicine) => {
      // Filter by search query
      const queryMatch =
        query === '' ||
        medicine.name.toLowerCase().includes(query.toLowerCase()) ||
        medicine.genericName.toLowerCase().includes(query.toLowerCase()) ||
        medicine.category.toLowerCase().includes(query.toLowerCase()) ||
        medicine.description.toLowerCase().includes(query.toLowerCase());

      // Filter by selected filter options (Rx/OTC)
      const isRx = medicine.prescriptionRequired;
      const typeStr = isRx ? 'Rx' : 'OTC';
      const filterMatch =
        selectedFilters.length === 0 || selectedFilters.includes(typeStr);

      // Filter by price range
      const priceMatch = medicine.price <= priceRange;

      return queryMatch && filterMatch && priceMatch;
    });
  }, [query, selectedFilters, priceRange]);


  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[16px] text-[#1E293B] antialiased">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <a
            href="#"
            className="flex items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
            aria-label="MediFind Home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563EB] text-white shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                <path d="M12 3 4 7v5c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10V7l-8-4Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9.5 12h5M12 9.5v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            <div>
              <p className="text-lg font-bold tracking-tight text-[#1E293B]">MediFind</p>
              <p className="text-sm text-[#64748B]">Medicine Discovery Platform</p>
            </div>
          </a>

          <div className="hidden items-center gap-5 md:flex">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-2 text-[#64748B] transition hover:bg-blue-50 hover:text-[#2563EB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
              aria-label="Search medicines"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                <path d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>

            <a
              href="#interaction-checker"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-[#1E293B] transition hover:bg-blue-50 hover:text-[#2563EB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
            >
              Interaction Checker
            </a>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-[#64748B] transition hover:bg-blue-50 hover:text-[#2563EB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
            aria-label="User profile"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
              <path d="M20 21a8 8 0 0 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="border-t border-slate-200/70 px-4 py-2 md:hidden">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-2 text-[#64748B] transition hover:bg-blue-50 hover:text-[#2563EB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
              aria-label="Search medicines"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                <path d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
            <a
              href="#interaction-checker"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-[#1E293B] transition hover:bg-blue-50 hover:text-[#2563EB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
            >
              Interaction Checker
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-6 flex flex-col gap-4 rounded-[28px] bg-gradient-to-br from-blue-50 via-sky-50 to-white p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between sm:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2563EB]">
              Search Results
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#1E293B] sm:text-4xl">
              {query ? `Results for "${query}"` : 'Find brand medicines and generic alternatives effortlessly'}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#64748B]">
              Compare medicine names, identify prescription status, and review estimated pricing through a safe, organized results layout.
            </p>
          </div>

          <div className="rounded-2xl border border-white/80 bg-white px-4 py-3 shadow-sm">
            <p className="text-sm text-[#64748B]">Showing</p>
            <p className="text-lg font-bold text-[#1E293B]">{filteredMedicines.length} results</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
          <aside className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold text-[#1E293B]">Filter Results</h2>
            <p className="mt-2 text-sm leading-6 text-[#64748B]">
              Refine medicine results by availability, form, and estimated price.
            </p>

            <div className="mt-6 space-y-4">
              {filterOptions.map((option) => (
                <label key={option.value} className="flex items-center gap-3 rounded-lg px-1 py-1 text-sm font-medium text-[#1E293B]">
                  <input
                    type="checkbox"
                    checked={selectedFilters.includes(option.value)}
                    onChange={() => handleFilterChange(option.value)}
                    className="h-4 w-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#64748B]">
                  Price Range
                </h3>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-[#2563EB]">
                  Up to Rs. {priceRange.toLocaleString()}
                </span>
              </div>

              <div className="mt-5 px-1">
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#2563EB]"
                  aria-label="Filter by price range"
                />
                <div className="mt-3 flex items-center justify-between text-sm text-[#64748B]">
                  <span>Rs. 0</span>
                  <span>Rs. 5,000</span>
                </div>
              </div>
            </div>
          </aside>

          <section aria-label="Medicine search results" className="space-y-4">
            {filteredMedicines.length === 0 ? (
              <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
                <p className="text-lg font-semibold text-[#1E293B]">No medicines found</p>
                <p className="mt-2 text-sm text-[#64748B]">Try adjusting your search query or filters.</p>
              </div>
            ) : (
              filteredMedicines.map((medicine) => {
                const isRx = medicine.prescriptionRequired;

                return (
                  <article
                    key={medicine.id}
                    className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 ring-1 ring-slate-200">
                          <div className="relative flex h-16 w-14 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
                            <div className="absolute top-2 h-1.5 w-8 rounded-full bg-[#2563EB]/20" />
                            <div className="flex items-center gap-1">
                              <span className="h-5 w-2.5 rounded-full bg-[#2563EB]" />
                              <span className="h-5 w-2.5 rounded-full bg-[#0D9488]" />
                              <span className="h-5 w-2.5 rounded-full bg-slate-300" />
                            </div>
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-xl font-bold text-[#1E293B] sm:text-2xl">
                            {medicine.name}
                          </h3>
                          <p className="mt-1 text-base text-[#64748B]">{medicine.genericName}</p>

                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                                isRx
                                  ? 'bg-red-50 text-red-600 ring-red-200'
                                  : 'bg-teal-50 text-[#0D9488] ring-teal-200'
                              }`}
                            >
                              {isRx ? 'Rx' : 'OTC'}
                            </span>
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                              Generic Alternative Available
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-3 border-t border-slate-200 pt-4 lg:min-w-[180px] lg:items-end lg:border-t-0 lg:pt-0">
                        <div className="text-left lg:text-right">
                          <p className="text-sm text-[#64748B]">Estimated price</p>
                          <p className="mt-1 text-2xl font-bold tracking-tight text-[#1E293B]">
                            Rs. {medicine.price.toLocaleString()}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => navigate(`/medicine/${medicine.slug}`)}
                          className="inline-flex items-center justify-center rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </section>
        </div>
      </main>

      <footer className="border-t-4 border-[#2563EB] bg-[#1E293B]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 text-center sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between md:text-left">
          <p className="text-sm font-semibold text-white">
            Information provided is for educational purposes only. Always consult a doctor.
          </p>
          <p className="text-sm text-slate-300">© 2026 MediFind</p>
        </div>
      </footer>
    </div>
  );
}
