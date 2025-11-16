"use client";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ExportButtons from "../../components/ExportButtons";
import { Feature, Quotation, useQuotations } from "../../context/QuotationContext";
import { notifySuccess } from "../../utils/toast";
import { useClient } from "../../context/ClientContext";

type FeatureDraft = Omit<Feature, "id"> & { id?: string };

export default function AdminPage() {
  const {
    quotations,
    selectedQuotationId,
    selectQuotation,
    getQuotation,
    createQuotation,
    updateQuotation,
    addFeature,
    removeFeature,
  } = useQuotations();
  const { clients } = useClient();
  const [verifyWarning, setVerifyWarning] = useState<string | null>(null);

  const selected = useMemo(() => (selectedQuotationId ? getQuotation(selectedQuotationId) : undefined), [selectedQuotationId, quotations]);

  const [projectName, setProjectName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [clientId, setClientId] = useState<string | undefined>(undefined);
  const [deploymentCost, setDeploymentCost] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState("");
  const [featureDrafts, setFeatureDrafts] = useState<FeatureDraft[]>([]);
  const [inviteEmail, setInviteEmail] = useState<string>("");
  const [sendingInvite, setSendingInvite] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/session').then(async (r) => {
      const d = await r.json();
      if (d?.user && d.user.email_verified === false) setVerifyWarning('Please verify your email to unlock all features');
      else setVerifyWarning(null);
    }).catch(() => {});
    if (selected) {
      setProjectName(selected.projectName);
      setCompanyName(selected.companyName);
      setClientId(selected.clientId);
      setDeploymentCost(selected.deploymentCost);
      setNotes(selected.notes ?? "");
      setFeatureDrafts(selected.features.map((f) => ({ title: f.title, description: f.description, price: f.price, id: f.id })));
    }
  }, [selected?.id]);

  const totalCost = useMemo(() => {
    const featuresSum = featureDrafts.reduce((sum, f) => sum + (Number(f.price) || 0), 0);
    return featuresSum + (Number(deploymentCost) || 0);
  }, [featureDrafts, deploymentCost]);

  const resetForm = () => {
    setProjectName("");
    setCompanyName("");
    setClientId(undefined);
    setDeploymentCost(undefined);
    setNotes("");
    setFeatureDrafts([]);
    selectQuotation(null);
  };

  const handleAddFeatureDraft = () => setFeatureDrafts((prev) => [...prev, { title: "", description: "", price: 0 }]);
  const handleRemoveFeatureDraft = (id?: string, index?: number) => {
    if (selected && id) {
      removeFeature(selected.id, id);
      setFeatureDrafts((prev) => prev.filter((f) => f.id !== id));
    } else if (typeof index === "number") {
      setFeatureDrafts((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleFeatureChange = (index: number, patch: Partial<FeatureDraft>) => {
    setFeatureDrafts((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  };

  const handleCreateQuotation = () => {
    const id = createQuotation({ projectName, companyName, clientId, deploymentCost, notes, features: featureDrafts as any });
    notifySuccess("Saved as new quotation");
    selectQuotation(id);
  };

  const handleUpdateQuotation = () => {
    if (!selected) return;
    const updated: Partial<Quotation> = {
      projectName,
      companyName,
      clientId,
      deploymentCost,
      notes,
      features: featureDrafts.map((f) => ({ id: f.id || "", title: f.title, description: f.description, price: Number(f.price) || 0 })),
    } as any;
    updateQuotation(selected.id, updated);
  };

  const handleSendInvite = async () => {
    if (!selected || !inviteEmail) return;
    try {
      setSendingInvite(true);
      const res = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quotationId: selected.id, email: inviteEmail })
      });
      const data = await res.json();
      if (!data?.ok) throw new Error(data?.error || 'Invite failed');
      updateQuotation(selected.id, { inviteToken: data.token, inviteEmail, invitedAt: Date.now(), status: 'sent' } as any);
      notifySuccess('Invite sent');
    } catch (e: any) {
      // Fall back toast already configured in axios; here keep silent or show error.
    } finally {
      setSendingInvite(false);
    }
  };

  const handleAddFeatureToSelected = () => {
    if (!selected) return;
    addFeature(selected.id, { title: "New Feature", description: "", price: 0 });
    setFeatureDrafts((prev) => [...prev, { title: "New Feature", description: "", price: 0 }]);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50" />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(251, 191, 36, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(249, 115, 22, 0.05) 0%, transparent 50%)' }} />
      <div className="relative mx-auto max-w-7xl px-6 py-8">
      {verifyWarning && (
        <div className="mb-4 rounded-lg border border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 px-4 py-3 text-sm font-medium text-amber-900 shadow-sm">
          {verifyWarning}
        </div>
      )}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-3 py-1 text-xs font-medium text-amber-900 shadow-sm backdrop-blur-sm mb-3">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Admin Portal
        </div>
        <h1 className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 bg-clip-text text-4xl font-bold tracking-tight text-transparent">Quotation Management</h1>
        <p className="mt-2 text-zinc-600">Create, edit and export professional quotations with powerful tools.</p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Form Column */}
        <div className="group rounded-2xl border border-amber-200 bg-white/95 p-6 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 shadow-md">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-zinc-900">{selected ? "Edit Quotation" : "Create Quotation"}</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 px-4 py-2 text-sm font-bold text-amber-900 shadow-sm">Total: ${totalCost}</span>
              <ExportButtons quotation={selected} />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-zinc-700">Project Name</label>
              <input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Enter project name" className="input-elegant w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-400 shadow-sm transition-all focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-zinc-700">Company Name</label>
              <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Enter company name" className="input-elegant w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-400 shadow-sm transition-all focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-zinc-700">Client</label>
              <select value={clientId ?? ""} onChange={(e) => setClientId(e.target.value || undefined)} className="input-elegant w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 shadow-sm transition-all focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200">
                <option value="">Select client (optional)</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-zinc-700">Deployment Cost</label>
                <input type="number" value={deploymentCost ?? ""} onChange={(e) => setDeploymentCost(e.target.value === "" ? undefined : Number(e.target.value))} placeholder="0" className="input-elegant w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-400 shadow-sm transition-all focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-zinc-700">Total Cost</label>
                <input value={totalCost} disabled className="w-full rounded-lg border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 px-4 py-2.5 font-bold text-amber-900 shadow-sm" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-zinc-700">Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Additional notes or requirements" className="input-elegant w-full resize-none rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-400 shadow-sm transition-all focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200" />
            </div>
            {selected && (
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-zinc-700">Client Email (Invite)</label>
                  <input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="client@example.com" className="input-elegant w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-400 shadow-sm transition-all focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200" />
                </div>
                <div className="flex items-end">
                  <button onClick={handleSendInvite} disabled={sendingInvite || !inviteEmail} className="flex w-full items-center justify-center gap-2 rounded-lg border border-amber-300 bg-gradient-to-br from-amber-500 to-orange-500 px-4 py-2.5 font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {sendingInvite ? 'Sending…' : 'Send Invite'}
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-800">Features</h3>
              <div className="flex gap-2">
                <button onClick={handleAddFeatureDraft} className="flex items-center gap-1.5 rounded-lg border border-amber-300 bg-gradient-to-br from-amber-100 to-orange-100 px-3 py-1.5 text-sm font-medium text-amber-900 shadow-sm transition-all hover:scale-105 hover:shadow-md">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </button>
                {selected && (
                  <button onClick={handleAddFeatureToSelected} className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-sm font-medium text-amber-900 shadow-sm transition-all hover:scale-105 hover:shadow-md">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Quick
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {featureDrafts.map((f, idx) => (
                  <motion.div key={f.id || idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8, height: 0 }} transition={{ duration: 0.2 }} className="grid grid-cols-12 gap-2 rounded-lg border border-amber-200 bg-gradient-to-br from-white to-amber-50/30 p-3 shadow-sm">
                    <input value={f.title} onChange={(e) => handleFeatureChange(idx, { title: e.target.value })} placeholder="Title" className="col-span-3 rounded-md border border-zinc-300 bg-white px-2.5 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm transition-all focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200" />
                    <input value={f.description || ""} onChange={(e) => handleFeatureChange(idx, { description: e.target.value })} placeholder="Description" className="col-span-6 rounded-md border border-zinc-300 bg-white px-2.5 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm transition-all focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200" />
                    <input type="number" value={f.price} onChange={(e) => handleFeatureChange(idx, { price: Number(e.target.value) })} placeholder="Price" className="col-span-2 rounded-md border border-zinc-300 bg-white px-2.5 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm transition-all focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200" />
                    <button onClick={() => handleRemoveFeatureDraft(f.id, idx)} className="col-span-1 flex items-center justify-center rounded-md border border-red-200 bg-white text-sm text-red-600 transition-all hover:bg-red-50 hover:scale-105">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={handleCreateQuotation} className="flex items-center gap-2 rounded-lg border border-amber-300 bg-gradient-to-br from-amber-500 to-orange-500 px-5 py-2.5 font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save New
            </button>
            {selected && (
              <button onClick={handleUpdateQuotation} className="flex items-center gap-2 rounded-lg border border-amber-300 bg-gradient-to-br from-amber-100 to-orange-100 px-5 py-2.5 font-semibold text-amber-900 shadow-md transition-all hover:scale-105 hover:shadow-lg">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Update
              </button>
            )}
            <button onClick={resetForm} className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-5 py-2.5 font-semibold text-zinc-700 shadow-md transition-all hover:scale-105 hover:bg-zinc-50 hover:shadow-lg">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reset
            </button>
          </div>
        </div>

        {/* History Column */}
        <div className="rounded-2xl border border-amber-200 bg-white/95 p-6 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 shadow-md">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-zinc-900">Quotation History</h2>
          </div>
          <div className="space-y-3">
            {quotations.map((q) => (
              <motion.div key={q.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="group relative overflow-hidden rounded-xl border border-amber-200 bg-gradient-to-br from-white to-amber-50/30 p-4 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-zinc-900">{q.projectName}</div>
                      <div className="text-sm text-zinc-600">{q.companyName}</div>
                    </div>
                    <span className="rounded-full border border-amber-200 bg-white px-2.5 py-1 text-xs font-medium text-amber-900 shadow-sm">{q.status}</span>
                  </div>
                  <div className="mb-3 text-sm font-semibold text-amber-700">Total: ${q.totalCost}</div>
                  <div className="flex gap-2">
                    <button onClick={() => selectQuotation(q.id)} className="flex items-center gap-1.5 rounded-lg border border-amber-300 bg-gradient-to-br from-amber-100 to-orange-100 px-3 py-1.5 text-sm font-medium text-amber-900 shadow-sm transition-all hover:scale-105 hover:shadow-md">
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Open
                    </button>
                    <ExportButtons quotation={q} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}