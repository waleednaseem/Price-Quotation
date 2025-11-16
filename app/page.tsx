import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50" />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(251, 191, 36, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(249, 115, 22, 0.05) 0%, transparent 50%)' }} />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-20">
        <main className="w-full space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-4 py-2 text-sm font-medium text-amber-900 shadow-sm backdrop-blur-sm">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              Professional Quotation System
            </div>
            <h1 className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl">
              Quotation Management
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-zinc-600">
              Streamline your proposal process with our elegant quotation management system. Create, negotiate, and finalize deals with ease.
            </p>
            <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-3">
              <Link
                href="/signup"
                className="group relative overflow-hidden rounded-lg border border-amber-300 bg-gradient-to-br from-amber-500 to-orange-500 px-6 py-3 font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
                aria-label="Register and get started"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-orange-600 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
              </Link>
              <Link
                href="/client"
                className="group relative overflow-hidden rounded-lg border border-amber-200 bg-white px-6 py-3 font-medium text-amber-900 shadow-sm transition-all hover:scale-105 hover:shadow-md"
                aria-label="Open client portal"
              >
                <span className="relative z-10">Client Portal</span>
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
              </Link>
            </div>
            <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-6 text-zinc-500">
              <span className="text-xs font-medium uppercase tracking-wider">Trusted by teams</span>
              <div className="flex items-center gap-6" aria-hidden="true">
                <div className="h-6 w-20 rounded bg-gradient-to-br from-amber-100 to-orange-100" />
                <div className="h-6 w-20 rounded bg-gradient-to-br from-amber-100 to-orange-100" />
                <div className="h-6 w-20 rounded bg-gradient-to-br from-amber-100 to-orange-100" />
              </div>
            </div>
          </div>


          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="group relative overflow-hidden rounded-xl border border-amber-100 bg-white/80 p-6 text-center shadow-sm backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-md">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100">
                <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-zinc-900">Lightning Fast</h3>
              <p className="mt-1 text-sm text-zinc-600">Create quotations in minutes</p>
            </div>
            <div className="group relative overflow-hidden rounded-xl border border-amber-100 bg-white/80 p-6 text-center shadow-sm backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-md">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100">
                <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-zinc-900">Secure & Reliable</h3>
              <p className="mt-1 text-sm text-zinc-600">Your data is always protected</p>
            </div>
            <div className="group relative overflow-hidden rounded-xl border border-amber-100 bg-white/80 p-6 text-center shadow-sm backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-md">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100">
                <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="font-semibold text-zinc-900">Real-time Collaboration</h3>
              <p className="mt-1 text-sm text-zinc-600">Negotiate and finalize deals</p>
            </div>
          </div>
          <div className="mt-8 flex items-center justify-center">
            <div className="group relative overflow-hidden rounded-2xl border border-amber-200 bg-white/95 px-6 py-5 text-center shadow-lg backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
              <div className="relative flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 shadow-md">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-zinc-900">Start creating quotations today</div>
                  <div className="text-sm text-zinc-600">It takes less than 2 minutes to get going</div>
                </div>
                <Link href="/signup" className="ml-2 flex items-center gap-2 rounded-lg border border-amber-300 bg-gradient-to-br from-amber-500 to-orange-500 px-5 py-3 font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg">
                  <span>Get Started</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
