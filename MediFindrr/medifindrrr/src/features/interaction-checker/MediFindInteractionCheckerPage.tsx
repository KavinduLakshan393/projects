import { type FormEvent, useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import {
  demoInteractions,
  noInteractionFoundMessage,
  type DrugInteraction,
} from '@/data/interactions'

export default function MediFindInteractionCheckerPage() {
  const [searchParams] = useSearchParams()

  const [firstMedicine, setFirstMedicine] = useState(searchParams.get('med1') ?? '')
  const [secondMedicine, setSecondMedicine] = useState(searchParams.get('med2') ?? '')
  const [result, setResult] = useState<DrugInteraction | null | 'none' | 'empty'>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!firstMedicine.trim() || !secondMedicine.trim()) {
      setResult('empty')
      return
    }

    const normalized = [firstMedicine.toLowerCase(), secondMedicine.toLowerCase()]
    const match = demoInteractions.find((interaction) => {
      return interaction.medicines.every((med) => normalized.includes(med.toLowerCase()));
    });

    setResult(match ?? 'none')
  }

  const severityClass =
    typeof result === 'object' && result?.severity === 'High'
      ? 'border-red-200 bg-red-50 text-red-900'
      : typeof result === 'object' && result?.severity === 'Moderate'
        ? 'border-amber-200 bg-amber-50 text-amber-900'
        : 'border-slate-200 bg-white text-slate-900'

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
              <p className="text-xs text-slate-500">Interaction checker</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <Link to="/" className="hover:text-emerald-700">Home</Link>
            <Link to="/search" className="hover:text-emerald-700">Search</Link>
            <Link to="/interaction-checker" className="text-emerald-700">
              Interaction Checker
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">
            Demo interaction checker
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Check selected medicine interactions
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            This checker uses a small demo database. It can show selected known examples,
            but it cannot confirm whether a medicine combination is medically safe.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-700">First medicine</span>
                <input
                  value={firstMedicine}
                  onChange={(event) => setFirstMedicine(event.target.value)}
                  placeholder="Example: Warfarin"
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-700">Second medicine</span>
                <input
                  value={secondMedicine}
                  onChange={(event) => setSecondMedicine(event.target.value)}
                  placeholder="Example: Ibuprofen"
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>
            </div>

            <button
              type="submit"
              className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-700"
            >
              Check interaction
            </button>
          </form>
        </section>

        <section className="mt-8">
          {result === null && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-600 shadow-sm">
              Enter two medicine names to check them against the demo interaction database.
            </div>
          )}

          {result === 'empty' && (
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm leading-7 text-amber-900">
              Please enter both medicine names before checking.
            </div>
          )}

          {result === 'none' && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-950">No demo match found</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {noInteractionFoundMessage}
              </p>
            </div>
          )}

          {typeof result === 'object' && result !== null && (
            <div className={`rounded-3xl border p-6 shadow-sm ${severityClass}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide">
                    {result.severity} severity demo warning
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">{result.title}</h2>
                </div>
                <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-bold">
                  {result.medicines.join(' + ')}
                </span>
              </div>

              <p className="mt-5 text-sm leading-7">{result.description}</p>

              <div className="mt-5 rounded-2xl bg-white/70 p-4">
                <h3 className="text-sm font-bold">Recommendation</h3>
                <p className="mt-2 text-sm leading-7">{result.recommendation}</p>
              </div>
            </div>
          )}
        </section>

        <section className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-lg font-bold text-amber-900">Important limitation</h2>
          <p className="mt-3 text-sm leading-7 text-amber-900">
            This is not a clinical interaction checker. It contains only a few demo examples.
            Always consult a qualified healthcare professional before combining medicines.
          </p>
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