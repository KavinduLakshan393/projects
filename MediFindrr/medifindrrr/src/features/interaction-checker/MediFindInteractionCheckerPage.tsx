import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { interactions } from '@/data/interactions';

type ResultState = 'empty' | 'safe' | 'danger';

function LogoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M12 3 4 7v5c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10V7l-8-4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 12h5M12 9.5v5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M20 7 10 17l-5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M12 9v4m0 4h.01M10.29 3.86l-7.5 13A2 2 0 0 0 4.5 20h15a2 2 0 0 0 1.71-3.14l-7.5-13a2 2 0 0 0-3.42 0Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MedicalIllustration() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center text-center">
      <div className="relative mb-6 flex h-52 w-52 items-center justify-center rounded-full bg-blue-50">
        <div className="absolute bottom-7 h-24 w-28 rounded-t-[40px] rounded-b-2xl bg-white shadow-sm ring-1 ring-slate-200" />
        <div className="absolute bottom-24 h-20 w-20 rounded-full bg-white shadow-sm ring-1 ring-slate-200" />
        <div className="absolute bottom-[7.3rem] h-8 w-10 rounded-b-full rounded-t-2xl bg-slate-100" />
        <div className="absolute bottom-[6.7rem] h-2 w-8 rounded-full bg-slate-300" />
        <div className="absolute bottom-[3.1rem] left-[4.4rem] h-12 w-3 rounded-full bg-[#2563EB]" />
        <div className="absolute bottom-[3.1rem] right-[4.4rem] h-12 w-3 rounded-full bg-[#2563EB]" />
        <div className="absolute bottom-[5.1rem] h-10 w-12 rounded-b-xl rounded-t-sm bg-white" />
        <div className="absolute bottom-[4.3rem] h-6 w-6 rounded-md bg-[#0D9488]/15" />
      </div>

      <h3 className="text-xl font-bold text-[#1E293B]">
        Start by adding your medicines
      </h3>
      <p className="mt-3 text-base leading-7 text-[#64748B]">
        Enter at least two medications to check for possible interaction risks in a
        simple, safe, and organized format.
      </p>
    </div>
  );
}

function InputRow({
  value,
  onChange,
  placeholder,
  onRemove,
  removable,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  removable?: boolean;
  onRemove?: () => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-1">
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm transition focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-blue-100">
          <SearchIcon />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full border-0 bg-transparent text-base text-[#1E293B] outline-none placeholder:text-[#64748B]"
          />
        </div>
      </div>

      {removable ? (
        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg border border-slate-200 bg-white px-3 py-4 text-sm font-semibold text-[#64748B] shadow-sm transition hover:border-red-200 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
        >
          Remove
        </button>
      ) : null}
    </div>
  );
}

export default function MediFindInteractionCheckerPage() {
  const [searchParams] = useSearchParams();
  const med1 = searchParams.get('med1') || '';
  const med2 = searchParams.get('med2') || '';

  const [medicines, setMedicines] = useState<string[]>(() => {
    if (med1 || med2) {
      const items = [];
      if (med1) items.push(med1);
      if (med2) items.push(med2);
      while (items.length < 2) items.push('');
      return items;
    }
    return ['', ''];
  });
  const [hasChecked, setHasChecked] = useState(() => {
    return !!(med1 && med2);
  });

  const filledMedicines = medicines
    .map((item) => item.trim())
    .filter(Boolean);

  const normalized = filledMedicines.map((m) => m.toLowerCase());

  const dangerMatch = useMemo(() => {
    const match = interactions.find((interaction) => {
      return interaction.medicines.every((med) => normalized.includes(med.toLowerCase()));
    });

    if (match) {
      return {
        medicines: match.medicines.map((m) => m.charAt(0).toUpperCase() + m.slice(1)),
        summary: match.summary,
        details: match.details,
        recommendation: match.recommendation,
      };
    }

    return null;
  }, [normalized]);

  const resultState: ResultState = !hasChecked || filledMedicines.length < 2
    ? 'empty'
    : dangerMatch
    ? 'danger'
    : 'safe';

  const updateMedicine = (index: number, value: string) => {
    setMedicines((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const addMedicine = () => {
    setMedicines((prev) => [...prev, '']);
  };

  const removeMedicine = (index: number) => {
    setMedicines((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCheck = () => {
    setHasChecked(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[16px] text-[#1E293B] antialiased">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <a
            href="#"
            className="flex items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
            aria-label="MediFind Home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563EB] text-white shadow-sm">
              <LogoIcon />
            </span>
            <div>
              <p className="text-lg font-bold tracking-tight text-[#1E293B]">MediFind</p>
              <p className="text-sm text-[#64748B]">Medicine Discovery Platform</p>
            </div>
          </a>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-[#64748B] transition hover:bg-blue-50 hover:text-[#2563EB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
            aria-label="Search medicines"
          >
            <SearchIcon />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Page Intro */}
        <section className="rounded-3xl bg-gradient-to-br from-blue-50 via-sky-50 to-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2563EB]">
              Safety Tool
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#1E293B] sm:text-5xl">
              Check Drug Interactions
            </h1>
            <p className="mt-4 text-base leading-7 text-[#64748B] sm:text-lg">
              Add two or more medications to review possible interaction concerns in a
              clear, accessible, and safety-focused experience.
            </p>
          </div>
        </section>

        {/* Inputs + Results */}
        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-start">
          {/* Input Panel */}
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
            <h2 className="text-xl font-bold text-[#1E293B]">Enter Medicines</h2>
            <p className="mt-2 text-base leading-7 text-[#64748B]">
              Use the fields below to add medications you want to compare.
            </p>

            <div className="mt-6 space-y-4">
              {medicines.map((medicine, index) => (
                <InputRow
                  key={index}
                  value={medicine}
                  onChange={(value) => updateMedicine(index, value)}
                  placeholder={`Search medicine ${index + 1}`}
                  removable={medicines.length > 2}
                  onRemove={() => removeMedicine(index)}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={addMedicine}
              className="mt-4 rounded-lg border border-dashed border-[#2563EB] px-4 py-3 text-sm font-semibold text-[#2563EB] transition hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
            >
              + Add another medicine
            </button>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleCheck}
                className="inline-flex w-full items-center justify-center rounded-lg bg-[#2563EB] px-5 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
              >
                Check Interactions
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#1E293B]">Results</h2>
                <p className="mt-1 text-sm text-[#64748B]">
                  Review the current interaction status below.
                </p>
              </div>
            </div>

            {resultState === 'empty' ? (
              <div className="rounded-2xl bg-[#F8FAFC] px-6 py-10 ring-1 ring-slate-200">
                <MedicalIllustration />
              </div>
            ) : null}

            {resultState === 'safe' ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-4 shadow-sm">
                  <div className="flex items-start gap-3 text-[#0D9488]">
                    <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                      <CheckIcon />
                    </span>
                    <div>
                      <p className="text-base font-bold">No interaction was found in this demo database.</p>
                      <p className="mt-1 text-sm leading-6">
                        This does not confirm medical safety. Please consult a qualified healthcare professional.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-[#F8FAFC] p-5 ring-1 ring-slate-200">
                  <h3 className="text-lg font-semibold text-[#1E293B]">
                    Checked Medicines
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {filledMedicines.map((medicine) => (
                      <span
                        key={medicine}
                        className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-[#1E293B] shadow-sm ring-1 ring-slate-200"
                      >
                        {medicine}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-base leading-7 text-[#64748B]">
                    Continue to monitor symptoms and always confirm medication safety
                    with a healthcare professional when needed.
                  </p>
                </div>
              </div>
            ) : null}

            {resultState === 'danger' && dangerMatch ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 shadow-sm">
                  <div className="flex items-start gap-3 text-[#EF4444]">
                    <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                      <WarningIcon />
                    </span>
                    <div>
                      <p className="text-base font-bold">Major Interaction Detected</p>
                      <p className="mt-1 text-sm leading-6">{dangerMatch.summary}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                  <h3 className="text-lg font-bold text-[#1E293B]">
                    Interaction Details
                  </h3>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {dangerMatch.medicines.map((medicine, index) => (
                      <React.Fragment key={medicine}>
                        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-[#1E293B] ring-1 ring-slate-200">
                          {medicine}
                        </span>
                        {index < dangerMatch.medicines.length - 1 ? (
                          <span className="text-slate-400">+</span>
                        ) : null}
                      </React.Fragment>
                    ))}
                  </div>

                  <div className="mt-5 rounded-xl bg-[#F8FAFC] p-4 ring-1 ring-slate-200">
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#64748B]">
                      Specific Risk
                    </p>
                    <p className="mt-2 text-base leading-7 text-[#1E293B]">
                      {dangerMatch.details}
                    </p>
                  </div>

                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#EF4444]">
                      Recommendation
                    </p>
                    <p className="mt-2 text-base font-bold leading-7 text-[#1E293B]">
                      {dangerMatch.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-[#2563EB] bg-[#1E293B]">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-white">
            Information provided is for educational purposes only. Always consult a doctor
          </p>
        </div>
      </footer>
    </div>
  );
}