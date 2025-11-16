import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Professional Quotation Management",
  description: "Learn about our mission, features, and technology",
};

export default function About() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 25%, rgba(251, 191, 36, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(249, 115, 22, 0.05) 0%, transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-20">
        <section className="space-y-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-4 py-2 text-sm font-medium text-amber-900 shadow-sm backdrop-blur-sm">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm1 9a1 1 0 100-2H8a1 1 0 100 2h4z"
                  clipRule="evenodd"
                />
              </svg>
              About Quotations
            </div>
            <h1 className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
              Elegant Quotation Management for Modern Businesses
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-zinc-600">
              We help teams create professional quotations, collaborate in real time, negotiate features, and close deals faster — all in one streamlined experience.
            </p>
          </div>
        </section>

        <section className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="group relative overflow-hidden rounded-xl border border-amber-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-md">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100">
              <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-zinc-900">Create & Manage</h3>
            <p className="mt-1 text-sm text-zinc-600">Draft quotations quickly, organize features, and keep versions tidy.</p>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-amber-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-md">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100">
              <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h3 className="font-semibold text-zinc-900">Negotiate & Collaborate</h3>
            <p className="mt-1 text-sm text-zinc-600">Discuss features, track messages, and agree on scope with clients.</p>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-amber-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-md">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100">
              <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-zinc-900">Export & Security</h3>
            <p className="mt-1 text-sm text-zinc-600">Generate polished PDFs and keep your data secure and private.</p>
          </div>
        </section>

        <section className="mt-12">
          <div className="group relative overflow-hidden rounded-2xl border border-amber-200 bg-white/95 px-6 py-6 text-center shadow-lg backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
            <div className="relative flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 shadow-md">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-zinc-900">Ready to streamline quotations?</div>
                  <div className="text-sm text-zinc-600">Start in minutes — no setup required</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/signup"
                  className="flex items-center gap-2 rounded-lg border border-amber-300 bg-gradient-to-br from-amber-500 to-orange-500 px-5 py-3 font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
                >
                  <span>Register</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/client"
                  className="flex items-center gap-2 rounded-lg border border-amber-200 bg-white px-5 py-3 font-medium text-amber-900 shadow-sm transition-all hover:scale-105 hover:shadow-md"
                >
                  <span>Client Portal</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}