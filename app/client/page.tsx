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
    <div className="mx-auto max-w-6xl px-6 py-8 bg-gradient-to-b from-amber-50/60 via-orange-50/40 to-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-zinc-800">Client — View Quotations</h1>
        <p className="mt-1 text-sm text-zinc-600">Browse your quotations and open details to negotiate or accept.</p>
      </div>
      <div className="mb-6 flex items-center justify-between rounded-xl border border-amber-100 bg-white/90 p-4">
        {currentClient ? (
          <div className="flex items-center gap-3">
            {currentClient.picture && <img src={currentClient.picture} alt="avatar" className="h-8 w-8 rounded-full border border-amber-100" />}
            <div>
              <div className="text-sm font-medium text-zinc-800">{currentClient.name}</div>
              {currentClient.email && <div className="text-xs text-zinc-600">{currentClient.email}</div>}
            </div>
          </div>
        ) : (
          <div className="text-sm text-zinc-700">Login to see your assigned quotations.</div>
        )}
        <div className="flex items-center gap-2">
          {currentClient ? (
            <button onClick={logout} className="rounded-md border border-amber-200 bg-white px-3 py-1.5 text-sm font-medium text-amber-900 hover:bg-amber-50">Logout</button>
          ) : (
            <>
              {googleEnabled && (
                <GoogleLogin
                  onSuccess={(cred) => {
                    try {
                      const payload: any = jwtDecode(cred.credential || "");
                      loginWithProfile({ id: payload.sub, name: payload.name || "Google User", email: payload.email, picture: payload.picture });
                    } catch (e) {
                      // Fallback mock on decode error
                      loginWithProfile({ id: "mock-client", name: "Mock Client", email: "mock@example.com", picture: "https://ui-avatars.com/api/?name=Mock+Client" });
                    }
                  }}
                  onError={() => {
                    loginWithProfile({ id: "mock-client", name: "Mock Client", email: "mock@example.com", picture: "https://ui-avatars.com/api/?name=Mock+Client" });
                  }}
                />
              )}
              {!googleEnabled && (
                <button onClick={() => loginWithProfile({ id: "client-acme", name: "Acme Corp", email: "sales@acme.com", picture: "https://ui-avatars.com/api/?name=Acme+Corp" })} className="rounded-md border border-amber-200 bg-white px-3 py-1.5 text-sm font-medium text-amber-900 hover:bg-amber-50">Mock Login</button>
              )}
            </>
          )}
        </div>
      </div>
      <div className="space-y-3">
        {visible.map((q) => (
          <motion.div key={q.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between rounded-md border border-amber-100 bg-white/90 p-3 hover:bg-amber-50">
            <div>
              <div className="text-sm font-medium text-zinc-800">{q.projectName} — {q.companyName}</div>
              <div className="text-xs text-zinc-600">Total: ${q.totalCost} · Status: {q.status}</div>
            </div>
            <Link href={`/client/${q.id}`} className="rounded-md border border-amber-200 bg-white px-3 py-1.5 text-sm font-medium text-amber-900 hover:bg-amber-50">View</Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}