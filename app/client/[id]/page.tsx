"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import ExportButtons from "../../../components/ExportButtons";
import { Feature, NegotiationMessage, Quotation, useQuotations } from "../../../context/QuotationContext";
import { notifyInfo, notifySuccess } from "../../../utils/toast";
import { useClient } from "../../../context/ClientContext";

export default function ClientViewPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string;
  const { getQuotation, clientRemoveFeature, addNegotiationMessage, setStatus } = useQuotations();
  const { currentClient, logAction, history } = useClient();
  const quotation = useMemo(() => (id ? getQuotation(id) : undefined), [id, getQuotation]);
  const [localFeatures, setLocalFeatures] = useState<Feature[]>(quotation?.features ?? []);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (quotation) setLocalFeatures(quotation.features);
    if (quotation && currentClient) {
      logAction(currentClient.id, { type: "view_quotation", quotationId: quotation.id });
    }
  }, [quotation?.id, quotation?.features.length]);

  if (!quotation) {
    return <div className="mx-auto max-w-3xl px-4 py-6"><p>Quotation not found.</p></div>;
  }

  const handleRemove = (fid: string) => {
    clientRemoveFeature(quotation.id, fid);
    setLocalFeatures((prev) => prev.filter((f) => f.id !== fid));
    notifyInfo("Feature removed");
    if (currentClient) logAction(currentClient.id, { type: "remove_feature", quotationId: quotation.id, details: fid });
  };

  // Propose new price removed from client UI per request

  const handleRequestUpdate = () => {
    if (message.trim()) {
      addNegotiationMessage(quotation.id, "client", message.trim());
      setMessage("");
      notifySuccess("Update requested");
      if (currentClient) logAction(currentClient.id, { type: "request_update", quotationId: quotation.id, details: message.trim() });
    }
  };

  const handleAccept = () => {
    setStatus(quotation.id, "accepted");
    if (currentClient) logAction(currentClient.id, { type: "accept", quotationId: quotation.id });
  };
  const handleDecline = () => {
    setStatus(quotation.id, "declined");
    if (currentClient) logAction(currentClient.id, { type: "decline", quotationId: quotation.id });
  };

  const featureSum = localFeatures.reduce((s, f) => s + f.price, 0);
  const total = featureSum + (quotation.deploymentCost ?? 0);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50" />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(251, 191, 36, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(249, 115, 22, 0.05) 0%, transparent 50%)' }} />
      <div className="relative mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-3 py-1 text-xs font-medium text-amber-900 shadow-sm backdrop-blur-sm mb-3">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Quotation Details
          </div>
          <h1 className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 bg-clip-text text-3xl font-bold tracking-tight text-transparent">{quotation.projectName}</h1>
          <p className="mt-1 text-zinc-600">{quotation.companyName} • Review, negotiate, or accept</p>
        </div>
        <ExportButtons quotation={quotation} />
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Details */}
        <div className="md:col-span-2 rounded-2xl border border-amber-200 bg-white/95 p-6 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 shadow-md">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-zinc-900">Quotation Details</h2>
          </div>
          <div className="mb-5 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 shadow-sm">
              <div className="text-xs font-medium text-amber-700">Deployment Cost</div>
              <div className="mt-1 text-2xl font-bold text-amber-900">${quotation.deploymentCost ?? 0}</div>
            </div>
            <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-orange-50 to-amber-50 p-4 shadow-sm">
              <div className="text-xs font-medium text-amber-700">Total Cost</div>
              <div className="mt-1 text-2xl font-bold text-amber-900">${total}</div>
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-bold text-zinc-800">Features</h3>
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {localFeatures.map((f) => (
                  <motion.div key={f.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8, height: 0 }} transition={{ duration: 0.2 }} className="rounded-xl border border-amber-200 bg-gradient-to-br from-white to-amber-50/30 p-4 shadow-sm">
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-zinc-900">{f.title}</div>
                        <div className="mt-1 text-sm text-zinc-600">{f.description}</div>
                      </div>
                      <button onClick={() => handleRemove(f.id)} className="ml-3 flex items-center justify-center rounded-lg border border-red-200 bg-white p-2 text-red-600 transition-all hover:bg-red-50 hover:scale-105">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-zinc-700">Price</label>
                      <input type="number" value={f.price} onChange={(e) => setLocalFeatures((prev) => prev.map((x) => (x.id === f.id ? { ...x, price: Number(e.target.value) || 0 } : x)))} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm transition-all focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={handleRequestUpdate} className="flex items-center gap-2 rounded-lg border border-amber-300 bg-gradient-to-br from-amber-100 to-orange-100 px-5 py-2.5 font-semibold text-amber-900 shadow-md transition-all hover:scale-105 hover:shadow-lg">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Request Update
            </button>
            <button onClick={handleAccept} className="flex items-center gap-2 rounded-lg border border-green-300 bg-gradient-to-br from-green-500 to-emerald-500 px-5 py-2.5 font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Accept
            </button>
            <button onClick={handleDecline} className="flex items-center gap-2 rounded-lg border border-red-300 bg-gradient-to-br from-red-500 to-rose-500 px-5 py-2.5 font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Decline
            </button>
          </div>
        </div>

        {/* Negotiation Thread */}
        <div className="rounded-2xl border border-amber-200 bg-white/95 p-6 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 shadow-md">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-zinc-900">Negotiation</h2>
          </div>
          <div className="mb-4 max-h-80 space-y-3 overflow-y-auto rounded-lg bg-zinc-50 p-4">
            {(quotation.negotiationThread as NegotiationMessage[]).map((m) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.sender === "client" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[80%] rounded-xl px-4 py-3 shadow-sm ${m.sender === "client" ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white" : "border border-amber-200 bg-white text-zinc-900"}`}>
                  <div className={`mb-1 text-xs font-semibold ${m.sender === "client" ? "text-amber-100" : "text-amber-700"}`}>{m.sender}</div>
                  <div className="text-sm">{m.text}</div>
                </div>
              </motion.div>
            ))}
          </div>
          <div>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="Type your message..." className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 shadow-sm transition-all focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200" />
          </div>
        </div>
        {currentClient && (
          <div className="rounded-2xl border border-amber-200 bg-white/95 p-6 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 shadow-md">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-zinc-900">Activity History</h2>
            </div>
            <div className="space-y-2">
              {(history[currentClient.id] || []).filter((h) => h.quotationId === quotation.id).slice().reverse().map((h, idx) => (
                <motion.div key={h.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="flex items-center justify-between rounded-lg border border-amber-100 bg-gradient-to-br from-white to-amber-50/30 p-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
                      <svg className="h-3.5 w-3.5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-sm font-medium text-zinc-800 capitalize">{h.type.replace("_", " ")}</div>
                  </div>
                  <div className="text-xs text-zinc-500">{new Date(h.timestamp).toLocaleString()}</div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}