"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuotations } from "../../context/QuotationContext";
import { useClient } from "../../context/ClientContext";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export default function ClientIndexPage() {
  const { quotations } = useQuotations();
  const { currentClient, loginWithProfile, logout } = useClient();
  const visible = currentClient ? quotations.filter((q) => q.clientId === currentClient.id) : quotations;
  const googleEnabled = !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50" />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(251, 191, 36, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(249, 115, 22, 0.05) 0%, transparent 50%)' }} />
      <div className="relative mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-3 py-1 text-xs font-medium text-amber-900 shadow-sm backdrop-blur-sm mb-3">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Client Portal
        </div>
        <h1 className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 bg-clip-text text-4xl font-bold tracking-tight text-transparent">View Quotations</h1>
        <p className="mt-2 text-zinc-600">Browse your quotations and open details to negotiate or accept.</p>
      </div>
      <div className="mb-6 flex items-center justify-between rounded-2xl border border-amber-200 bg-white/95 p-5 shadow-lg backdrop-blur-sm">
        {currentClient ? (
          <div className="flex items-center gap-4">
            {currentClient.picture && <img src={currentClient.picture} alt="avatar" className="h-12 w-12 rounded-full border-2 border-amber-200 shadow-md" />}
            <div>
              <div className="font-semibold text-zinc-900">{currentClient.name}</div>
              {currentClient.email && <div className="text-sm text-zinc-600">{currentClient.email}</div>}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100">
              <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="text-sm font-medium text-zinc-700">Login to see your assigned quotations.</div>
          </div>
        )}
        <div className="flex items-center gap-2">
          {currentClient ? (
            <button onClick={logout} className="flex items-center gap-2 rounded-lg border border-amber-300 bg-gradient-to-br from-amber-100 to-orange-100 px-4 py-2 font-medium text-amber-900 shadow-sm transition-all hover:scale-105 hover:shadow-md">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          ) : (
            <>
              {googleEnabled && (
                <GoogleLogin
                  onSuccess={(cred) => {
                    try {
                      const payload: any = jwtDecode(cred.credential || "");
                      loginWithProfile({ id: payload.sub, name: payload.name || "Google User", email: payload.email, picture: payload.picture });
                    } catch (e) {
                      loginWithProfile({ id: "mock-client", name: "Mock Client", email: "mock@example.com", picture: "https://ui-avatars.com/api/?name=Mock+Client" });
                    }
                  }}
                  onError={() => {
                    loginWithProfile({ id: "mock-client", name: "Mock Client", email: "mock@example.com", picture: "https://ui-avatars.com/api/?name=Mock+Client" });
                  }}
                />
              )}
              {!googleEnabled && (
                <button onClick={() => loginWithProfile({ id: "client-acme", name: "Acme Corp", email: "sales@acme.com", picture: "https://ui-avatars.com/api/?name=Acme+Corp" })} className="flex items-center gap-2 rounded-lg border border-amber-300 bg-gradient-to-br from-amber-500 to-orange-500 px-4 py-2 font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Mock Login
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <div className="space-y-4">
        {visible.map((q, idx) => (
          <motion.div key={q.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: idx * 0.05 }} className="group relative overflow-hidden rounded-2xl border border-amber-200 bg-white/95 p-6 shadow-lg backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative flex items-center justify-between">
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-md">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-zinc-900">{q.projectName}</div>
                    <div className="text-sm text-zinc-600">{q.companyName}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold text-amber-700">${q.totalCost}</span>
                  </div>
                  <span className="rounded-full border border-amber-200 bg-white px-3 py-1 text-xs font-medium text-amber-900 shadow-sm">{q.status}</span>
                </div>
              </div>
              <Link href={`/client/${q.id}`} className="flex items-center gap-2 rounded-lg border border-amber-300 bg-gradient-to-br from-amber-500 to-orange-500 px-5 py-3 font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg">
                <span>View Details</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
      </div>
    </div>
  );
}