export default function MediFindLandingPage() {
  const categories = [
    {
      title: 'Pain Relief',
      description: 'Common pain and fever medicines',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
          <path d="M10 14 6.5 17.5a5 5 0 1 1-7-7L3 7m7 7 7-7m0 0a5 5 0 1 1 7 7L17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: 'Cold & Flu',
      description: 'Relief for cough, cold, and congestion',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
          <path d="M12 3v18M3 12h18M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: 'Vitamins',
      description: 'Daily wellness and nutritional support',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
          <path d="M12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 4.03-9 9 4.03 9 9 9Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M9 12h6M12 9v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: 'Heart Health',
      description: 'Support for cardiovascular care',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
          <path d="M20.42 4.58a5.4 5.4 0 0 0-7.64 0L12 5.36l-.78-.78a5.4 5.4 0 1 0-7.64 7.64l.78.78L12 20.64l7.64-7.64.78-.78a5.4 5.4 0 0 0 0-7.64Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: 'Allergy Care',
      description: 'Help with seasonal and daily allergies',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
          <path d="M12 3c3.5 4 6 7.26 6 10a6 6 0 1 1-12 0c0-2.74 2.5-6 6-10Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: 'Family Care',
      description: 'Medicines for everyday household needs',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
          <path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  const trustPoints = [
    'Search by brand or generic name',
    'Designed for safe, readable medicine lookup',
    'Built to support interaction awareness',
  ];

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

      <main>
        <section className="px-4 pb-12 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pb-16">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
            <div className="rounded-[28px] bg-gradient-to-br from-blue-100 via-sky-50 to-white p-6 shadow-sm sm:p-8 lg:p-12">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-semibold text-[#0D9488] shadow-sm">
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                    <path d="M12 3 4 7v5c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10V7l-8-4Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9.5 12.2 11.3 14l3.4-3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Verified Medical Data
                </div>

                <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-[#1E293B] sm:text-5xl lg:text-6xl">
                  Find Your Medicine &amp; Understand Your Health
                </h1>

                <p className="mt-5 max-w-xl text-base leading-7 text-[#64748B] sm:text-lg">
                  Search medicines by brand or generic name, explore trusted medication information, and check important interaction risks in a clean, accessible experience.
                </p>

                <form className="mt-8" role="search" aria-label="Medicine search">
                  <label htmlFor="medicine-search" className="sr-only">
                    Search for a medicine by brand or generic name
                  </label>
                  <div className="flex flex-col gap-3 rounded-2xl border border-white/80 bg-white p-3 shadow-sm sm:flex-row sm:items-center">
                    <div className="flex flex-1 items-center gap-3 rounded-xl px-3 py-2">
                      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0 text-[#64748B]" aria-hidden="true">
                        <path d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                      <input
                        id="medicine-search"
                        type="text"
                        placeholder="Search by brand (e.g., Panadol) or generic name..."
                        className="w-full border-0 bg-transparent text-base text-[#1E293B] outline-none placeholder:text-[#64748B]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
                    >
                      Search Medicine
                    </button>
                  </div>
                </form>

                <div className="mt-8 flex flex-wrap gap-3">
                  {trustPoints.map((point) => (
                    <span
                      key={point}
                      className="inline-flex items-center rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-[#1E293B] shadow-sm ring-1 ring-slate-200"
                    >
                      {point}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2563EB]">
                      Safe Discovery
                    </p>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#1E293B]">
                      Search smarter with clearer medicine information
                    </h2>
                  </div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB]">
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                      <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl bg-[#F8FAFC] p-4 ring-1 ring-slate-200">
                    <p className="text-sm font-semibold text-[#1E293B]">Brand &amp; Generic Search</p>
                    <p className="mt-1 text-sm leading-6 text-[#64748B]">
                      Quickly find medicines using familiar brand names or their active ingredients.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#F8FAFC] p-4 ring-1 ring-slate-200">
                    <p className="text-sm font-semibold text-[#1E293B]">Accessible by Design</p>
                    <p className="mt-1 text-sm leading-6 text-[#64748B]">
                      Spacious layouts, strong contrast, and readable text make everyday use easier.
                    </p>
                  </div>
                </div>
              </div>

              <div id="interaction-checker" className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 ring-1 ring-red-200">
                  Safety Tool
                </div>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#1E293B]">
                  Interaction Checker
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#64748B]">
                  Compare medicines and review possible interaction concerns before you proceed.
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Enter first medicine"
                    className="rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 text-base text-[#1E293B] outline-none transition placeholder:text-[#64748B] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                  />
                  <input
                    type="text"
                    placeholder="Enter second medicine"
                    className="rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 text-base text-[#1E293B] outline-none transition placeholder:text-[#64748B] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <button
                  type="button"
                  className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
                >
                  Check Interactions
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0D9488]">
                  Quick Categories
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#1E293B] sm:text-3xl">
                  Start with common health needs
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-7 text-[#64748B]">
                Browse popular medicine categories through a simple, clutter-free layout designed to feel approachable and reliable.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {categories.map((category) => (
                <button
                  key={category.title}
                  type="button"
                  className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB] transition group-hover:bg-blue-100">
                    {category.icon}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-[#1E293B]">{category.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#64748B]">{category.description}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-14 pt-4 sm:px-6 lg:px-8 lg:pb-20">
          <div className="mx-auto max-w-7xl rounded-[28px] border border-teal-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#0D9488] shadow-sm">
                  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
                    <path d="M12 3 4 7v5c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10V7l-8-4Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9.5 12.2 11.3 14l3.4-3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0D9488]">
                    Trust Banner
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#1E293B]">
                    Verified Medical Data
                  </h2>
                  <p className="mt-2 max-w-2xl text-base leading-7 text-[#64748B]">
                    The platform is designed to present medicine information in a clear and responsible way, helping users navigate essential details more confidently.
                  </p>
                </div>
              </div>

              <a
                href="#"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-[#F8FAFC] px-5 py-3 text-sm font-semibold text-[#1E293B] transition hover:border-blue-200 hover:text-[#2563EB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>
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
//