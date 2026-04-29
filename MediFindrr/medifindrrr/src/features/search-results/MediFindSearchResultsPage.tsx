import { type FormEvent, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { medicineCategories, searchMedicines } from '@/data/medicines'

export default function MediFindSearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const initialQuery = searchParams.get('q') ?? ''
  const selectedCategory = searchParams.get('category') ?? ''

  const [query, setQuery] = useState(initialQuery)

  const results = useMemo(
    () => searchMedicines(initialQuery, selectedCategory),
    [initialQuery, selectedCategory],
  )

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextParams = new URLSearchParams()

    if (query.trim()) nextParams.set('q', query.trim())
    if (selectedCategory) nextParams.set('category', selectedCategory)

    setSearchParams(nextParams)
  }

  function handleCategoryChange(category: string) {
    const nextParams = new URLSearchParams()

    if (query.trim()) nextParams.set('q', query.trim())
    if (category) nextParams.set('category', category)

    setSearchParams(nextParams)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-600 font-bold text-white">
              M
            </div>
            <div>
              <p className="text-lg font-bold">MediFindrr</p>
              <p className="text-xs text-slate-500">Medicine search</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <Link to="/" className="hover:text-emerald-700">Home</Link>
            <Link to="/search" className="text-emerald-700">Search</Link>
            <Link to="/interaction-checker" className="hover:text-emerald-700">
              Interaction Checker
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">
            Search medicines
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Find educational medicine information
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Search by brand name, generic name, category, use case, or interaction keyword.
            Results are based on demo data only.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="search"
              placeholder="Example: Panadol, Paracetamol, Pain Relief"
              className="min-h-12 flex-1 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
            <button
              type="submit"
              className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-700"
            >
              Search
            </button>
          </form>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-950">Filter by category</h2>

            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={() => handleCategoryChange('')}
                className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold ${!selectedCategory
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
              >
                All categories
              </button>

              {medicineCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold ${selectedCategory === category
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </aside>

          <div>
            <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <p className="text-sm font-semibold text-slate-600">
                Showing {results.length} result{results.length === 1 ? '' : 's'}
              </p>

              {(initialQuery || selectedCategory) && (
                <Link to="/search" className="text-sm font-bold text-emerald-700">
                  Clear filters
                </Link>
              )}
            </div>

            {results.length > 0 ? (
              <div className="grid gap-5">
                {results.map((medicine) => (
                  <article
                    key={medicine.id}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                            {medicine.category}
                          </span>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                            {medicine.prescriptionRequired ? 'Prescription' : 'OTC / Non-prescription'}
                          </span>
                        </div>

                        <h2 className="mt-4 text-2xl font-bold text-slate-950">
                          {medicine.name}
                        </h2>
                        <p className="mt-1 text-sm font-semibold text-slate-500">
                          {medicine.genericName}
                        </p>
                        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                          {medicine.description}
                        </p>
                      </div>

                      <div className="shrink-0 text-left sm:text-right">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Demo price
                        </p>
                        <p className="text-2xl font-bold text-slate-950">
                          Rs. {medicine.price.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link
                        to={`/medicine/${medicine.slug}`}
                        className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
                      >
                        View details
                      </Link>

                      <Link
                        to={`/interaction-checker?med1=${encodeURIComponent(medicine.name)}`}
                        className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:border-emerald-200 hover:text-emerald-700"
                      >
                        Check interaction
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <h2 className="text-xl font-bold text-slate-950">No medicines found</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Try searching by another brand name, generic name, category, or use case.
                  This demo database contains only a small set of medicines.
                </p>
                <Link
                  to="/search"
                  className="mt-6 inline-flex rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700"
                >
                  Reset search
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-950 px-4 py-8 text-center text-sm text-slate-300">
        <p>
          This website provides educational information only and should not be used as a
          substitute for professional medical advice, diagnosis, or treatment.
        </p>
      </footer>
    </div>
  )
}