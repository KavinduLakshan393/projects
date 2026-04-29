import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { findMedicineBySlug } from '@/data/medicines'

export default function MediFindMedicineDetailPage() {
  const { slug } = useParams()
  const medicine = findMedicineBySlug(slug)
  const [saved, setSaved] = useState(false)

  async function handleShare() {
    if (!medicine) return

    const shareData = {
      title: `${medicine.name} - MediFindrr`,
      text: `View educational information about ${medicine.name}.`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        window.alert('Page link copied to clipboard.')
      }
    } catch {
      window.alert('Sharing was cancelled or unavailable.')
    }
  }

  if (!medicine) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Header />

        <main className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm">
            <h1 className="text-3xl font-bold text-slate-950">Medicine not found</h1>
            <p className="mt-4 text-slate-600">
              The medicine you are looking for is not available in this demo database.
            </p>
            <Link
              to="/search"
              className="mt-6 inline-flex rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700"
            >
              Back to search
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link to="/search" className="text-sm font-bold text-emerald-700 hover:text-emerald-800">
          ← Back to search
        </Link>

        <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  {medicine.category}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  {medicine.prescriptionRequired ? 'Prescription required' : 'OTC / Non-prescription'}
                </span>
              </div>

              <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950">
                {medicine.name}
              </h1>
              <p className="mt-2 text-lg font-semibold text-slate-500">
                {medicine.genericName}
              </p>
              <p className="mt-5 max-w-3xl leading-7 text-slate-600">
                {medicine.description}
              </p>
            </div>

            <div className="rounded-3xl bg-slate-50 p-5 lg:min-w-64">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Demo price
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-950">
                Rs. {medicine.price.toLocaleString()}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Manufacturer: {medicine.manufacturer}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setSaved(true)}
              className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
            >
              {saved ? 'Saved for demo' : 'Save to profile'}
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:border-emerald-200 hover:text-emerald-700"
            >
              Share
            </button>

            <button
              type="button"
              onClick={() => window.alert('Find Pharmacy is coming soon.')}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:border-emerald-200 hover:text-emerald-700"
            >
              Find Pharmacy
            </button>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <InfoCard title="Common uses">
            <ul className="space-y-3">
              {medicine.uses.map((use) => (
                <li key={use} className="flex gap-3 text-sm leading-6 text-slate-600">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                  {use}
                </li>
              ))}
            </ul>
          </InfoCard>

          <InfoCard title="Dosage information">
            <p className="text-sm leading-7 text-slate-600">{medicine.dosage}</p>
          </InfoCard>

          <InfoCard title="Common side effects">
            <ul className="space-y-3">
              {medicine.sideEffects.common.map((effect) => (
                <li key={effect} className="flex gap-3 text-sm leading-6 text-slate-600">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                  {effect}
                </li>
              ))}
            </ul>
          </InfoCard>

          <InfoCard title="Serious side effects">
            <ul className="space-y-3">
              {medicine.sideEffects.severe.map((effect) => (
                <li key={effect} className="flex gap-3 text-sm leading-6 text-slate-600">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                  {effect}
                </li>
              ))}
            </ul>
          </InfoCard>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <InfoCard title="Warnings">
            <ul className="space-y-3">
              {medicine.warnings.map((warning) => (
                <li key={warning} className="flex gap-3 text-sm leading-6 text-slate-600">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                  {warning}
                </li>
              ))}
            </ul>
          </InfoCard>

          <InfoCard title="Known interaction keywords">
            <div className="flex flex-wrap gap-2">
              {medicine.interactions.map((interaction) => (
                <Link
                  key={interaction}
                  to={`/interaction-checker?med1=${encodeURIComponent(medicine.name)}&med2=${encodeURIComponent(interaction)}`}
                  className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  {interaction}
                </Link>
              ))}
            </div>
          </InfoCard>
        </section>

        <section className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-lg font-bold text-amber-900">Important educational disclaimer</h2>
          <p className="mt-3 text-sm leading-7 text-amber-900">
            This page provides educational information only. It should not be used as a
            substitute for professional medical advice, diagnosis, or treatment. Always ask
            a qualified healthcare professional before starting, stopping, or combining medicines.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-600 font-bold text-white">
            M
          </div>
          <div>
            <p className="text-lg font-bold">MediFindrr</p>
            <p className="text-xs text-slate-500">Medicine details</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link to="/" className="hover:text-emerald-700">Home</Link>
          <Link to="/search" className="hover:text-emerald-700">Search</Link>
          <Link to="/interaction-checker" className="hover:text-emerald-700">
            Interaction Checker
          </Link>
        </nav>
      </div>
    </header>
  )
}

function InfoCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 px-4 py-8 text-center text-sm text-slate-300">
      <p>
        This website provides educational information only and should not be used as a
        substitute for professional medical advice, diagnosis, or treatment.
      </p>
    </footer>
  )
}