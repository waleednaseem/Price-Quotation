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

  const selected = useMemo(() => (selectedQuotationId ? getQuotation(selectedQuotationId) : undefined), [selectedQuotationId, quotations]);

  const [projectName, setProjectName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [clientId, setClientId] = useState<string | undefined>(undefined);
  const [deploymentCost, setDeploymentCost] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState("");
  const [featureDrafts, setFeatureDrafts] = useState<FeatureDraft[]>([]);

  useEffect(() => {
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

  const handleAddFeatureToSelected = () => {
    if (!selected) return;
    addFeature(selected.id, { title: "New Feature", description: "", price: 0 });
    setFeatureDrafts((prev) => [...prev, { title: "New Feature", description: "", price: 0 }]);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 bg-gradient-to-b from-amber-50/60 via-orange-50/40 to-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-zinc-800">Admin — Quotation Management</h1>
        <p className="mt-1 text-sm text-zinc-600">Create, edit and export professional quotations with a clean, light UI.</p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Form Column */}
        <div className="rounded-xl border border-amber-100 bg-white/90 p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-800">{selected ? "Edit Quotation" : "Create Quotation"}</h2>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">Total: ${totalCost}</span>
              <ExportButtons quotation={selected} />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-zinc-700">Project Name</label>
              <input value={projectName} onChange={(e) => setProjectName(e.target.value)} className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-800 placeholder-zinc-400 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700">Company Name</label>
              <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-800 placeholder-zinc-400 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700">Client</label>
              <select value={clientId ?? ""} onChange={(e) => setClientId(e.target.value || undefined)} className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-800 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200">
                <option value="">Select client (optional)</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-zinc-700">Deployment Cost (optional)</label>
                <input type="number" value={deploymentCost ?? ""} onChange={(e) => setDeploymentCost(e.target.value === "" ? undefined : Number(e.target.value))} className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-800 placeholder-zinc-400 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700">Total Cost</label>
                <input value={totalCost} disabled className="mt-1 w-full rounded-md border border-zinc-200 bg-amber-50 px-3 py-2 text-zinc-800" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700">Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1 w-full resize-none rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-800 placeholder-zinc-400 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200" />
            </div>
          </div>
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-700">Features</h3>
              <div className="flex gap-2">
                <button onClick={handleAddFeatureDraft} className="rounded-md border border-amber-200 bg-white px-3 py-1.5 text-sm text-amber-800 hover:bg-amber-50">Add</button>
                {selected && (
                  <button onClick={handleAddFeatureToSelected} className="rounded-md border border-amber-200 bg-white px-3 py-1.5 text-sm text-amber-800 hover:bg-amber-50">Quick Add</button>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {featureDrafts.map((f, idx) => (
                  <motion.div key={f.id || idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="grid grid-cols-12 gap-2 rounded-md border border-amber-100 bg-white/80 p-2">
                    <input value={f.title} onChange={(e) => handleFeatureChange(idx, { title: e.target.value })} placeholder="Title" className="col-span-3 rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-zinc-800 placeholder-zinc-400 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200" />
                    <input value={f.description || ""} onChange={(e) => handleFeatureChange(idx, { description: e.target.value })} placeholder="Description" className="col-span-6 rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-zinc-800 placeholder-zinc-400 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200" />
                    <input type="number" value={f.price} onChange={(e) => handleFeatureChange(idx, { price: Number(e.target.value) })} placeholder="Price" className="col-span-2 rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-zinc-800 placeholder-zinc-400 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200" />
                    <button onClick={() => handleRemoveFeatureDraft(f.id, idx)} className="col-span-1 rounded-md border border-amber-200 bg-white text-sm text-amber-800 hover:bg-amber-50">Del</button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={handleCreateQuotation} className="rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-100">Save New</button>
            {selected && (
              <button onClick={handleUpdateQuotation} className="rounded-md border border-amber-200 bg-white px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-50">Update</button>
            )}
            <button onClick={resetForm} className="rounded-md border border-amber-200 bg-white px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-50">Reset</button>
          </div>
        </div>

        {/* History Column */}
        <div className="rounded-xl border border-amber-100 bg-white/90 p-5 shadow-sm transition-shadow hover:shadow-md">
          <h2 className="mb-3 text-lg font-semibold text-zinc-800">Quotation History</h2>
          <div className="space-y-3">
            {quotations.map((q) => (
              <motion.div key={q.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between rounded-md border border-amber-100 bg-white/80 p-3 hover:bg-amber-50">
                <div>
                  <div className="text-sm font-medium text-zinc-800">{q.projectName} — {q.companyName}</div>
                  <div className="text-xs text-zinc-600">Total: ${q.totalCost} · Status: {q.status}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => selectQuotation(q.id)} className="rounded-md border border-amber-200 bg-white px-3 py-1.5 text-sm font-medium text-amber-900 hover:bg-amber-50">Open</button>
                  <ExportButtons quotation={q} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}