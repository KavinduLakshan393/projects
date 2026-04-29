import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { medicines } from '@/data/medicines';

type TabKey = 'overview' | 'side-effects' | 'warnings';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'side-effects', label: 'Side Effects' },
  { key: 'warnings', label: 'Warnings' },
];

const alternatives = [
  {
    name: 'Generic Alternative 1',
    manufacturer: 'Generic Pharma Labs',
    price: 'Lower Cost',
    savings: 'Save up to 40%',
  },
  {
    name: 'Generic Alternative 2',
    manufacturer: 'MediCore Generics',
    price: 'Lower Cost',
    savings: 'Save up to 50%',
  },
];

function ShieldLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M12 3 4 7v5c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10V7l-8-4Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 12.2 11.3 14l3.4-3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M20 21a8 8 0 0 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PillPackageVisual({ name, genericName, prescriptionRequired }: { name: string; genericName: string; prescriptionRequired: boolean }) {
  return (
    <div className="relative mx-auto flex h-56 w-full max-w-[320px] items-center justify-center">
      <div className="absolute inset-x-8 top-8 h-40 rounded-[28px] bg-gradient-to-br from-slate-100 to-white shadow-md ring-1 ring-slate-200" />
      <div className="relative z-10 flex h-44 w-72 flex-col overflow-hidden rounded-[28px] bg-white shadow-md ring-1 ring-slate-200">
        <div className={`flex items-center justify-between px-5 py-4 text-white ${prescriptionRequired ? 'bg-red-600' : 'bg-[#2563EB]'}`}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/80">
              {prescriptionRequired ? 'Prescription Medicine' : 'Over the Counter'}
            </p>
            <p className="mt-1 text-lg font-bold">{name}</p>
          </div>
        </div>
        <div className="grid flex-1 grid-cols-[1fr_110px] gap-4 p-5">
          <div>
            <p className="text-sm font-semibold text-[#1E293B]">{genericName}</p>
            <p className="mt-2 text-sm leading-6 text-[#64748B]">Clinical-grade packaging preview.</p>
          </div>
          <div className="flex items-center justify-center rounded-2xl bg-[#F8FAFC] ring-1 ring-slate-200">
            <div className="grid grid-cols-2 gap-2">
              <span className="h-7 w-7 rounded-full bg-[#2563EB]" />
              <span className="h-7 w-7 rounded-full bg-[#0D9488]" />
              <span className="h-7 w-7 rounded-full bg-slate-300" />
              <span className="h-7 w-7 rounded-full bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  label,
  primary = false,
  icon,
}: {
  label: string;
  primary?: boolean;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 ${
        primary
          ? 'bg-[#2563EB] text-white hover:bg-blue-700'
          : 'border border-slate-200 bg-white text-[#1E293B] hover:border-blue-200 hover:text-[#2563EB]'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200 sm:p-7">
      <h2 className="text-2xl font-bold tracking-tight text-[#1E293B]">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function MediFindMedicineDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const medicine = useMemo(() => medicines.find((m) => m.slug === slug), [slug]);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const tabContent = useMemo(() => {
    if (!medicine) return null;

    if (activeTab === 'overview') {
      return (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl bg-[#F8FAFC] p-5 ring-1 ring-slate-200">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#2563EB]">What it is for</p>
            <p className="mt-3 text-base leading-7 text-[#1E293B]">
              {medicine.uses}
            </p>
          </div>
          <div className="rounded-2xl bg-[#F8FAFC] p-5 ring-1 ring-slate-200">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#2563EB]">How to take it</p>
            <p className="mt-3 text-base leading-7 text-[#1E293B]">
              {medicine.dosage}
            </p>
          </div>
        </div>
      );
    }

    if (activeTab === 'side-effects') {
      return (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl bg-amber-50 p-5 ring-1 ring-amber-200">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#F59E0B] shadow-sm">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                  <path d="M12 9v4m0 4h.01M10.29 3.86l-7.5 13A2 2 0 0 0 4.5 20h15a2 2 0 0 0 1.71-3.14l-7.5-13a2 2 0 0 0-3.42 0Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <h3 className="text-lg font-bold text-[#1E293B]">Common Effects</h3>
            </div>
            <ul className="mt-4 space-y-3 text-base text-[#1E293B]">
              {medicine.sideEffects.common.map((item) => (
                <li key={item} className="flex gap-3 leading-7">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#F59E0B]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-red-50 p-5 ring-1 ring-red-200">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#EF4444] shadow-sm">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                  <path d="M12 9v4m0 4h.01M10.29 3.86l-7.5 13A2 2 0 0 0 4.5 20h15a2 2 0 0 0 1.71-3.14l-7.5-13a2 2 0 0 0-3.42 0Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <h3 className="text-lg font-bold text-[#1E293B]">Severe Effects</h3>
            </div>
            <ul className="mt-4 space-y-3 text-base text-[#1E293B]">
              {medicine.sideEffects.severe.map((item) => (
                <li key={item} className="flex gap-3 leading-7">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#EF4444]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-2xl bg-[#F8FAFC] p-5 ring-1 ring-slate-200">
        <ul className="space-y-4 text-base text-[#1E293B]">
          {medicine.warnings.map((item) => (
            <li key={item} className="flex gap-3 leading-7">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-[#EF4444]">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                  <path d="M12 8v4m0 4h.01M10.29 3.86l-7.5 13A2 2 0 0 0 4.5 20h15a2 2 0 0 0 1.71-3.14l-7.5-13a2 2 0 0 0-3.42 0Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }, [activeTab, medicine]);

  if (!medicine) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-[16px] text-[#1E293B] antialiased flex flex-col justify-center items-center p-10">
        <h1 className="text-3xl font-bold">Medicine not found</h1>
        <p className="mt-2 text-[#64748B]">We couldn't find the medicine you're looking for.</p>
        <Link to="/search" className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
          Back to Search
        </Link>
      </div>
    );
  }

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
              <ShieldLogo />
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
              <SearchIcon />
            </button>

            <a
              href="#"
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
            <UserIcon />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_360px] lg:items-start">
          <div className="space-y-6">
            <section className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-slate-200 sm:p-8">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                      medicine.prescriptionRequired
                        ? 'bg-red-50 text-red-600 ring-red-200'
                        : 'bg-teal-50 text-[#0D9488] ring-teal-200'
                    }`}>
                      {medicine.prescriptionRequired ? 'Rx Required' : 'OTC Available'}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-[#0D9488] ring-1 ring-teal-200">
                      {medicine.category}
                    </span>
                  </div>

                  <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-[#1E293B] sm:text-5xl">
                    {medicine.name}
                  </h1>
                  <p className="mt-2 text-lg text-[#64748B] sm:text-xl">
                    {medicine.genericName}
                  </p>

                  <p className="mt-6 max-w-2xl text-base leading-7 text-[#1E293B]">
                    {medicine.description}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[#64748B]">
                    <div className="rounded-xl bg-[#F8FAFC] px-4 py-3 ring-1 ring-slate-200">
                      <p className="font-medium text-[#64748B]">Category</p>
                      <p className="mt-1 font-semibold text-[#1E293B]">{medicine.category}</p>
                    </div>
                    {medicine.manufacturer && (
                      <div className="rounded-xl bg-[#F8FAFC] px-4 py-3 ring-1 ring-slate-200">
                        <p className="font-medium text-[#64748B]">Manufacturer</p>
                        <p className="mt-1 font-semibold text-[#1E293B]">{medicine.manufacturer}</p>
                      </div>
                    )}
                    <div className="rounded-xl bg-[#F8FAFC] px-4 py-3 ring-1 ring-slate-200">
                      <p className="font-medium text-[#64748B]">Estimated price</p>
                      <p className="mt-1 font-semibold text-[#1E293B]">Rs. {medicine.price.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <PillPackageVisual 
                  name={medicine.name} 
                  genericName={medicine.genericName} 
                  prescriptionRequired={!!medicine.prescriptionRequired} 
                />
              </div>
            </section>

            <div className="flex flex-wrap gap-3">
              <ActionButton
                label="Save to Profile"
                primary
                icon={
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
              />
              <ActionButton
                label="Share"
                icon={
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                    <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
              />
              <ActionButton
                label="Find Pharmacy"
                icon={
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                    <path d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11Z" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                }
              />
            </div>

            <SectionCard title="Medicine Information">
              <div className="flex flex-wrap gap-2 rounded-2xl bg-[#F8FAFC] p-2 ring-1 ring-slate-200">
                {tabs.map((tab) => {
                  const active = tab.key === activeTab;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 ${
                        active
                          ? 'bg-[#2563EB] text-white shadow-sm'
                          : 'text-[#64748B] hover:bg-white hover:text-[#1E293B]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5">{tabContent}</div>
            </SectionCard>
          </div>

          <aside className="space-y-6">
            <SectionCard title="Cheaper Alternatives">
              <p className="text-base leading-7 text-[#64748B]">
                Alternatives with the same active ingredients may help reduce cost while keeping the treatment category consistent.
              </p>

              <div className="mt-5 space-y-4">
                {alternatives.map((item) => (
                  <article
                    key={item.name}
                    className="rounded-2xl bg-[#F8FAFC] p-4 ring-1 ring-slate-200"
                  >
                    <p className="text-lg font-bold text-[#1E293B]">{item.name}</p>
                    <p className="mt-1 text-sm text-[#64748B]">{item.manufacturer}</p>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-[#64748B]">Estimated price</p>
                        <p className="mt-1 text-lg font-bold text-[#1E293B]">{item.price}</p>
                      </div>
                      <span className="rounded-full bg-teal-50 px-3 py-1.5 text-sm font-semibold text-[#0D9488] ring-1 ring-teal-200">
                        {item.savings}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </SectionCard>

            <section className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-[#0D9488] shadow-sm">
                  <ShieldLogo />
                </span>
                <div>
                  <p className="text-lg font-bold text-[#1E293B]">Clinical Clarity</p>
                  <p className="mt-2 text-base leading-7 text-[#64748B]">
                    This layout separates overview, side effects, and warnings into focused sections to keep important medication details easy to scan.
                  </p>
                </div>
              </div>
            </section>
          </aside>
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
