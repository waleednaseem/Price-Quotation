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
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Link href="/admin" className="group relative overflow-hidden rounded-2xl border border-amber-200 bg-white/90 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg transition-transform group-hover:scale-110">
                  <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900">Admin Portal</h2>
                  <p className="mt-2 text-zinc-600">Create, edit, and manage quotations with comprehensive tools. Export to PDF with professional formatting.</p>
                </div>
                <div className="flex items-center gap-2 pt-2 text-sm font-medium text-amber-600">
                  Get started
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            <Link href="/client" className="group relative overflow-hidden rounded-2xl border border-amber-200 bg-white/90 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg transition-transform group-hover:scale-110">
                  <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900">Client Portal</h2>
                  <p className="mt-2 text-zinc-600">Review quotations, negotiate terms, and manage your proposals. Seamless collaboration with your team.</p>
                </div>
                <div className="flex items-center gap-2 pt-2 text-sm font-medium text-orange-600">
                  View quotations
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-amber-100 bg-white/80 p-6 text-center shadow-sm backdrop-blur-sm">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100">
                <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-zinc-900">Lightning Fast</h3>
              <p className="mt-1 text-sm text-zinc-600">Create quotations in minutes</p>
            </div>
            <div className="rounded-xl border border-amber-100 bg-white/80 p-6 text-center shadow-sm backdrop-blur-sm">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100">
                <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-zinc-900">Secure & Reliable</h3>
              <p className="mt-1 text-sm text-zinc-600">Your data is always protected</p>
            </div>
            <div className="rounded-xl border border-amber-100 bg-white/80 p-6 text-center shadow-sm backdrop-blur-sm">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100">
                <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="font-semibold text-zinc-900">Real-time Collaboration</h3>
              <p className="mt-1 text-sm text-zinc-600">Negotiate and finalize deals</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
