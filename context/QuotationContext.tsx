"use client";
import React, { createContext, useContext, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { notifyInfo, notifySuccess } from "../utils/toast";

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

const sampleQuotations: Quotation[] = [
  {
    id: "q-acme-website",
    projectName: "Website Revamp",
    companyName: "Acme Corp",
    clientId: "client-acme",
    features: [
      { id: "f-landing", title: "Landing Page", description: "Hero + CTA", price: 800 },
      { id: "f-blog", title: "Blog", description: "CMS setup", price: 1200 },
      { id: "f-auth", title: "Auth", description: "Login/Signup", price: 1000 },
    ],
    deploymentCost: 300,
    notes: "Includes initial content migration.",
    totalCost: 0, // computed below
    status: "draft",
    negotiationThread: [
      { id: "m1", sender: "client", text: "Can we reduce auth cost?", timestamp: 1700000000000 },
      { id: "m2", sender: "admin", text: "Possible with reduced scope.", timestamp: 1700003600000 },
    ],
  },
  {
    id: "q-globex-mvp",
    projectName: "Mobile App MVP",
    companyName: "Globex",
    clientId: "client-globex",
    features: [
      { id: "f-onboarding", title: "Onboarding", description: "Walkthrough screens", price: 600 },
      { id: "f-push", title: "Push Notifications", description: "FCM integration", price: 700 },
    ],
    deploymentCost: 250,
    notes: "iOS and Android basic support.",
    totalCost: 0,
    status: "sent",
    negotiationThread: [],
  },
];

// Initialize totals
for (const q of sampleQuotations) q.totalCost = recalcTotal(q);

export function QuotationProvider({ children }: { children: React.ReactNode }) {
  const [quotations, setQuotations] = useState<Quotation[]>(sampleQuotations);
  const [selectedQuotationId, setSelectedQuotationId] = useState<string | null>(
    quotations[0]?.id ?? null
  );

  const getQuotation = (id: string) => quotations.find((q) => q.id === id);
  const selectQuotation = (id: string | null) => setSelectedQuotationId(id);

  const createQuotation = (input: CreateQuotationInput) => {
    const id = uuidv4();
    const features = (input.features ?? []).map((f) => ({ ...f, id: uuidv4() }));
    const newQ: Quotation = {
      id,
      projectName: input.projectName,
      companyName: input.companyName,
      clientId: input.clientId,
      features,
      deploymentCost: input.deploymentCost,
      notes: input.notes,
      totalCost: 0,
      status: "draft",
      negotiationThread: [],
    };
    newQ.totalCost = recalcTotal(newQ);
    setQuotations((prev) => [newQ, ...prev]);
    setSelectedQuotationId(id);
    notifySuccess("Quotation created");
    return id;
  };

  const updateQuotation = (id: string, updates: Partial<Quotation>) => {
    setQuotations((prev) => {
      const next = prev.map((q) => (q.id === id ? { ...q, ...updates } : q));
      const q = next.find((x) => x.id === id);
      if (q) q.totalCost = recalcTotal(q);
      return next;
    });
    notifyInfo("Quotation updated");
  };

  const addFeature = (id: string, feature: Omit<Feature, "id">) => {
    const f: Feature = { ...feature, id: uuidv4() };
    setQuotations((prev) => {
      const next = prev.map((q) =>
        q.id === id ? { ...q, features: [...q.features, f] } : q
      );
      const q = next.find((x) => x.id === id);
      if (q) q.totalCost = recalcTotal(q);
      return next;
    });
    notifySuccess("Feature added");
  };

  const removeFeature = (id: string, featureId: string) => {
    setQuotations((prev) => {
      const next = prev.map((q) =>
        q.id === id ? { ...q, features: q.features.filter((f) => f.id !== featureId) } : q
      );
      const q = next.find((x) => x.id === id);
      if (q) q.totalCost = recalcTotal(q);
      return next;
    });
    notifyInfo("Feature removed");
  };

  const clientRemoveFeature = removeFeature;

  const clientProposePrice = (id: string, featureId: string, price: number) => {
    setQuotations((prev) => {
      const next = prev.map((q) => {
        if (q.id !== id) return q;
        return {
          ...q,
          features: q.features.map((f) =>
            f.id === featureId ? { ...f, clientProposedPrice: price } : f
          ),
        };
      });
      return next;
    });
    notifyInfo("Client proposed new price");
  };

  const addNegotiationMessage = (id: string, sender: Sender, text: string) => {
    const msg: NegotiationMessage = {
      id: uuidv4(),
      sender,
      text,
      timestamp: Date.now(),
    };
    setQuotations((prev) =>
      prev.map((q) => (q.id === id ? { ...q, negotiationThread: [...q.negotiationThread, msg] } : q))
    );
  };

  const setStatus = (id: string, status: QuotationStatus) => {
    setQuotations((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
    notifyInfo("Status updated: " + status);
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