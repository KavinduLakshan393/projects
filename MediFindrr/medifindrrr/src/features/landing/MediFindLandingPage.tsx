import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { medicineCategories } from '@/data/medicines'

export default function MediFindLandingPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [firstMedicine, setFirstMedicine] = useState('')
  const [secondMedicine, setSecondMedicine] = useState('')

  const navigate = useNavigate()

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const query = searchQuery.trim()
    navigate(query ? `/search?q=${encodeURIComponent(query)}` : '/search')
  }

  function handleInteractionSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const params = new URLSearchParams()

    if (firstMedicine.trim()) params.set('med1', firstMedicine.trim())
    if (secondMedicine.trim()) params.set('med2', secondMedicine.trim())

    navigate(`/interaction-checker${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-600 text-lg font-bold text-white">
              M
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">MediFindrr</p>
              <p className="text-xs text-slate-500">Educational medicine lookup</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <Link to="/" className="text-emerald-700">Home</Link>
            <Link to="/search" className="hover:text-emerald-700">Search</Link>
            <Link to="/interaction-checker" className="hover:text-emerald-700">
              Interaction Checker
            </Link>
          </nav>

          <Link
            to="/search"
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
          >
            Search
          </Link>
        </div>
      </header>

      <main>
        <section className="bg-gradient-to-br from-emerald-50 via-white to-cyan-50">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
            <div className="flex flex-col justify-center">
              <span className="mb-4 inline-flex w-fit rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700">
                Educational medicine information
              </span>

              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Find medicine details in a clear and responsible way.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                MediFindrr helps users search demo medicine information, view basic details,
                and check selected demo drug interactions. It is not a replacement for
                professional medical advice.
              </p>

              <form
                onSubmit={handleSearchSubmit}
                className="mt-8 flex max-w-2xl flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-3 shadow-lg sm:flex-row"
              >
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  type="search"
                  placeholder="Search by brand, generic name, or category"
                  className="min-h-12 flex-1 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
                <button
                  type="submit"
                  className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-700"
                >
                  Search medicines
                </button>
              </form>

              <div className="mt-8 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
                {[
                  'Search by brand or generic name',
                  'Simple educational medicine pages',
                  'Demo interaction awareness',
                ].map((point) => (
                  <div key={point} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <span className="mb-2 block h-2 w-2 rounded-full bg-emerald-500" />
                    {point}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
              <div className="rounded-[1.5rem] bg-slate-950 p-6 text-white">
                <p className="text-sm font-semibold text-emerald-300">Demo result</p>
                <h2 className="mt-3 text-2xl font-bold">Panadol</h2>
                <p className="mt-1 text-sm text-slate-300">Paracetamol 500mg</p>

                <div className="mt-6 space-y-3">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-sm font-semibold">Category</p>
                    <p className="text-sm text-slate-300">Pain Relief</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-sm font-semibold">Educational warning</p>
                    <p className="text-sm text-slate-300">
                      Do not exceed the recommended dose. Ask a healthcare professional
                      if unsure.
                    </p>
                  </div>
                </div>

                <Link
                  to="/medicine/panadol"
                  className="mt-6 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-950 hover:bg-slate-100"
                >
                  View demo details
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">
                Browse categories
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Start from a medicine category
              </h2>
            </div>
            <Link to="/search" className="text-sm font-bold text-emerald-700 hover:text-emerald-800">
              View all medicines
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {medicineCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => navigate(`/search?category=${encodeURIComponent(category)}`)}
                className="rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
              >
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-xl font-bold text-emerald-700">
                  +
                </div>
                <h3 className="text-lg font-bold text-slate-950">{category}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Explore demo medicines listed under {category.toLowerCase()}.
                </p>
              </button>
            ))}
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">
                Interaction awareness
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Check selected demo medicine interactions
              </h2>
              <p className="mt-4 text-slate-600">
                This checker uses a small demo database. It can help demonstrate the concept,
                but it cannot confirm medical safety.
              </p>
            </div>

            <form
              onSubmit={handleInteractionSubmit}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  value={firstMedicine}
                  onChange={(event) => setFirstMedicine(event.target.value)}
                  placeholder="First medicine"
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
                <input
                  value={secondMedicine}
                  onChange={(event) => setSecondMedicine(event.target.value)}
                  placeholder="Second medicine"
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <button
                type="submit"
                className="mt-4 w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
              >
                Check interactions
              </button>
            </form>
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