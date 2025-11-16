"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { notifyInfo, notifySuccess } from "../utils/toast";
import axios from "axios";

export type Sender = "admin" | "client";

export interface Feature {
  id: string;
  title: string;
  description?: string;
  price: number;
  clientProposedPrice?: number;
}

export interface NegotiationMessage {
  id: string;
  sender: Sender;
  text: string;
  timestamp: number;
}

export type QuotationStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "declined"
  | "updated";

export interface Quotation {
  id: string;
  projectName: string;
  companyName: string;
  clientId?: string;
  features: Feature[];
  deploymentCost?: number;
  notes?: string;
  totalCost: number;
  status: QuotationStatus;
  negotiationThread: NegotiationMessage[];
  inviteToken?: string;
  inviteEmail?: string;
  invitedAt?: number;
}

export interface CreateQuotationInput {
  projectName: string;
  companyName: string;
  clientId?: string;
  features?: Feature[];
  deploymentCost?: number;
  notes?: string;
}

interface QuotationContextValue {
  quotations: Quotation[];
  selectedQuotationId: string | null;
  getQuotation: (id: string) => Quotation | undefined;
  selectQuotation: (id: string | null) => void;
  createQuotation: (input: CreateQuotationInput) => string; // returns id
  updateQuotation: (id: string, updates: Partial<Quotation>) => void;
  addFeature: (id: string, feature: Omit<Feature, "id">) => void;
  removeFeature: (id: string, featureId: string) => void;
  clientRemoveFeature: (id: string, featureId: string) => void;
  clientProposePrice: (id: string, featureId: string, price: number) => void;
  addNegotiationMessage: (id: string, sender: Sender, text: string) => void;
  setStatus: (id: string, status: QuotationStatus) => void;
}

const QuotationContext = createContext<QuotationContextValue | null>(null);

const recalcTotal = (q: Quotation): number => {
  const featureSum = q.features.reduce((sum, f) => sum + (f.price ?? 0), 0);
  return featureSum + (q.deploymentCost ?? 0);
};

const sampleQuotations: Quotation[] = [];

export function QuotationProvider({ children }: { children: React.ReactNode }) {
  const [quotations, setQuotations] = useState<Quotation[]>(sampleQuotations);
  const [selectedQuotationId, setSelectedQuotationId] = useState<string | null>(
    quotations[0]?.id ?? null
  );
  useEffect(() => {
    (async () => {
      try {
        const r = await axios.get("/api/quotations");
        const data = (r.data?.quotations || []).map((row: any): Quotation => ({
          id: row.id,
          projectName: row.project_name,
          companyName: row.company_name,
          clientId: row.client_id || undefined,
          features: (row.features || []).map((f: any) => ({
            id: f.id,
            title: f.title,
            description: f.description || undefined,
            price: Number(f.price),
            clientProposedPrice: f.client_proposed_price != null ? Number(f.client_proposed_price) : undefined,
          })),
          deploymentCost: row.deployment_cost != null ? Number(row.deployment_cost) : undefined,
          notes: row.notes || undefined,
          totalCost: Number(row.total_cost || 0),
          status: row.status,
          negotiationThread: [],
          inviteToken: row.invite_token || undefined,
          inviteEmail: row.invite_email || undefined,
          invitedAt: row.invited_at ? new Date(row.invited_at).getTime() : undefined,
        }));
        setQuotations(data);
        setSelectedQuotationId(data[0]?.id ?? null);
      } catch {}
    })();
  }, []);

  const getQuotation = (id: string) => quotations.find((q) => q.id === id);
  const selectQuotation = (id: string | null) => setSelectedQuotationId(id);

  const createQuotation = (input: CreateQuotationInput) => {
    const id = uuidv4();
    const features = (input.features ?? []).map((f) => ({ ...f, id: uuidv4() }));
    const payload = { id, projectName: input.projectName, companyName: input.companyName, clientId: input.clientId, deploymentCost: input.deploymentCost, notes: input.notes, features };
    axios.post("/api/quotations", payload).then((r) => {
      const row = r.data?.quotation;
      const q: Quotation = {
        id: row.id,
        projectName: row.project_name,
        companyName: row.company_name,
        clientId: row.client_id || undefined,
        features: (row.features || []).map((f: any) => ({ id: f.id, title: f.title, description: f.description || undefined, price: Number(f.price), clientProposedPrice: f.client_proposed_price != null ? Number(f.client_proposed_price) : undefined })),
        deploymentCost: row.deployment_cost != null ? Number(row.deployment_cost) : undefined,
        notes: row.notes || undefined,
        totalCost: Number(row.total_cost || 0),
        status: row.status,
        negotiationThread: [],
      };
      setQuotations((prev) => [q, ...prev]);
      setSelectedQuotationId(id);
      notifySuccess("Quotation created");
    });
    return id;
  };

  const updateQuotation = (id: string, updates: Partial<Quotation>) => {
    const payload: any = {};
    if (updates.projectName !== undefined) payload.projectName = updates.projectName;
    if (updates.companyName !== undefined) payload.companyName = updates.companyName;
    if (updates.clientId !== undefined) payload.clientId = updates.clientId;
    if (updates.deploymentCost !== undefined) payload.deploymentCost = updates.deploymentCost;
    if (updates.notes !== undefined) payload.notes = updates.notes;
    if (updates.status !== undefined) payload.status = updates.status;
    axios.patch(`/api/quotations/${id}`, payload).then((r) => {
      const row = r.data?.quotation;
      const q: Quotation = {
        id: row.id,
        projectName: row.project_name,
        companyName: row.company_name,
        clientId: row.client_id || undefined,
        features: (row.features || []).map((f: any) => ({ id: f.id, title: f.title, description: f.description || undefined, price: Number(f.price), clientProposedPrice: f.client_proposed_price != null ? Number(f.client_proposed_price) : undefined })),
        deploymentCost: row.deployment_cost != null ? Number(row.deployment_cost) : undefined,
        notes: row.notes || undefined,
        totalCost: Number(row.total_cost || 0),
        status: row.status,
        negotiationThread: [],
      };
      setQuotations((prev) => prev.map((x) => (x.id === id ? q : x)));
      notifyInfo("Quotation updated");
    });
  };

  const addFeature = (id: string, feature: Omit<Feature, "id">) => {
    const f: Feature = { ...feature, id: uuidv4() };
    axios.post(`/api/quotations/${id}/features`, { feature: { ...f, clientProposedPrice: f.clientProposedPrice } }).then(() => {
      setQuotations((prev) => prev.map((q) => (q.id === id ? { ...q, features: [...q.features, f], totalCost: recalcTotal({ ...q, features: [...q.features, f] }) } : q)));
      notifySuccess("Feature added");
    });
  };

  const removeFeature = (id: string, featureId: string) => {
    axios.delete(`/api/quotations/${id}/features/${featureId}`).then(() => {
      setQuotations((prev) => prev.map((q) => (q.id === id ? { ...q, features: q.features.filter((f) => f.id !== featureId), totalCost: recalcTotal({ ...q, features: q.features.filter((f) => f.id !== featureId) }) } : q)));
      notifyInfo("Feature removed");
    });
  };

  const clientRemoveFeature = removeFeature;

  const clientProposePrice = (id: string, featureId: string, price: number) => {
    axios.patch(`/api/quotations/${id}/features/${featureId}`, { clientProposedPrice: price }).then(() => {
      setQuotations((prev) => prev.map((q) => (q.id === id ? { ...q, features: q.features.map((f) => (f.id === featureId ? { ...f, clientProposedPrice: price } : f)) } : q)));
      notifyInfo("Client proposed new price");
    });
  };

  const addNegotiationMessage = (id: string, sender: Sender, text: string) => {
    axios.post(`/api/quotations/${id}/messages`, { senderRole: sender, text }).then((r) => {
      const msg: NegotiationMessage = { id: r.data?.id || uuidv4(), sender, text, timestamp: Date.now() };
      setQuotations((prev) => prev.map((q) => (q.id === id ? { ...q, negotiationThread: [...q.negotiationThread, msg] } : q)));
    });
  };

  const setStatus = (id: string, status: QuotationStatus) => {
    axios.patch(`/api/quotations/${id}`, { status }).then(() => {
      setQuotations((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
      notifyInfo("Status updated: " + status);
    });
  };

  const value = useMemo<QuotationContextValue>(
    () => ({
      quotations,
      selectedQuotationId,
      getQuotation,
      selectQuotation,
      createQuotation,
      updateQuotation,
      addFeature,
      removeFeature,
      clientRemoveFeature,
      clientProposePrice,
      addNegotiationMessage,
      setStatus,
    }),
    [quotations, selectedQuotationId]
  );

  return <QuotationContext.Provider value={value}>{children}</QuotationContext.Provider>;
}

export function useQuotations() {
  const ctx = useContext(QuotationContext);
  if (!ctx) throw new Error("useQuotations must be used within QuotationProvider");
  return ctx;
}