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
    <div className="mx-auto max-w-6xl px-6 py-8 bg-gradient-to-b from-amber-50/60 via-orange-50/40 to-white min-h-screen">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-800">{quotation.projectName} — {quotation.companyName}</h1>
          <p className="mt-1 text-sm text-zinc-600">Review details, propose changes, or accept the quotation.</p>
        </div>
        <ExportButtons quotation={quotation} />
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Details */}
        <div className="md:col-span-2 rounded-xl border border-amber-100 bg-white/90 p-5 shadow-sm transition-shadow hover:shadow-md">
          <h2 className="mb-3 text-lg font-semibold text-zinc-800">Quotation Details</h2>
          <div className="mb-3 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-md border border-amber-100 bg-amber-50 p-3 text-zinc-800">Deployment Cost: ${quotation.deploymentCost ?? 0}</div>
            <div className="rounded-md border border-amber-100 bg-amber-50 p-3 text-zinc-800">Total: ${total}</div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-zinc-700">Features</h3>
            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {localFeatures.map((f) => (
                  <motion.div key={f.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="grid grid-cols-8 gap-2 rounded-md border border-amber-100 bg-white/80 p-2">
                    <div className="col-span-3">
                      <div className="text-sm font-medium text-zinc-800">{f.title}</div>
                      <div className="text-xs text-zinc-600">{f.description}</div>
                    </div>
                    <div className="col-span-3">
                      <label className="block text-xs text-zinc-600">Price</label>
                      <input type="number" value={f.price} onChange={(e) => setLocalFeatures((prev) => prev.map((x) => (x.id === f.id ? { ...x, price: Number(e.target.value) || 0 } : x)))} className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-zinc-800 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200" />
                    </div>
                    <button onClick={() => handleRemove(f.id)} className="col-span-2 rounded-md border border-amber-200 bg-white text-sm font-medium text-amber-900 hover:bg-amber-50">Remove</button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={handleRequestUpdate} className="rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-100">Request Update</button>
            <button onClick={handleAccept} className="rounded-md border border-amber-200 bg-white px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-50">Accept</button>
            <button onClick={handleDecline} className="rounded-md border border-amber-200 bg-white px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-50">Decline</button>
          </div>
        </div>

        {/* Negotiation Thread */}
        <div className="rounded-xl border border-amber-100 bg-white/90 p-5 shadow-sm transition-shadow hover:shadow-md">
          <h2 className="mb-3 text-lg font-semibold text-zinc-800">Negotiation</h2>
          <div className="space-y-2">
            {(quotation.negotiationThread as NegotiationMessage[]).map((m) => (
              <div key={m.id} className={`flex ${m.sender === "client" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[75%] rounded-md px-3 py-2 text-sm shadow-sm ${m.sender === "client" ? "bg-amber-50 text-zinc-800" : "bg-white border border-amber-200 text-zinc-800"}`}>
                  <div className="text-xs opacity-70">{m.sender}</div>
                  <div>{m.text}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="Type your message" className="w-full resize-none rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-800 placeholder-zinc-400 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200" />
          </div>
        </div>
        {currentClient && (
          <div className="rounded-xl border border-amber-100 bg-white/90 p-5 shadow-sm transition-shadow hover:shadow-md">
            <h2 className="mb-3 text-lg font-semibold text-zinc-800">Your History (this quotation)</h2>
            <div className="space-y-2">
              {(history[currentClient.id] || []).filter((h) => h.quotationId === quotation.id).slice().reverse().map((h) => (
                <div key={h.id} className="flex items-center justify-between rounded-md border border-amber-100 bg-white/80 p-2">
                  <div className="text-sm text-zinc-800">{h.type.replace("_", " ")}</div>
                  <div className="text-xs text-zinc-600">{new Date(h.timestamp).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}