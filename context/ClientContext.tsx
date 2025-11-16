"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export interface ClientProfile {
  id: string; // Google sub or internal id
  name: string;
  email?: string;
  picture?: string;
  role?: "admin" | "client";
}

export type ClientActionType =
  | "login"
  | "view_quotation"
  | "remove_feature"
  | "request_update"
  | "accept"
  | "decline";

export interface ClientAction {
  id: string;
  type: ClientActionType;
  timestamp: number;
  quotationId?: string;
  details?: string;
}

interface ClientContextValue {
  currentClient: ClientProfile | null;
  clients: ClientProfile[];
  history: Record<string, ClientAction[]>; // keyed by clientId
  loginWithProfile: (profile: ClientProfile) => void;
  logout: () => void;
  addOrUpdateClient: (profile: ClientProfile) => void;
  logAction: (clientId: string, action: Omit<ClientAction, "id" | "timestamp">) => void;
}

const ClientContext = createContext<ClientContextValue | null>(null);

// Sample clients to support admin selection before real Google login occurs
const sampleClients: ClientProfile[] = [
  { id: "client-acme", name: "Acme Corp", email: "sales@acme.com", picture: "https://ui-avatars.com/api/?name=Acme+Corp", role: "client" },
  { id: "client-globex", name: "Globex Inc.", email: "biz@globex.com", picture: "https://ui-avatars.com/api/?name=Globex+Inc", role: "client" },
];

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const [currentClient, setCurrentClient] = useState<ClientProfile | null>(null);
  const [clients, setClients] = useState<ClientProfile[]>(sampleClients);
  const [history, setHistory] = useState<Record<string, ClientAction[]>>({});

  useEffect(() => {
    axios.get('/api/session').then((r) => {
      const u = r.data?.user;
      if (!u) return;
      const profile: ClientProfile = { id: u.id, name: u.name, email: u.email, picture: u.picture, role: u.role };
      addOrUpdateClient(profile);
      setCurrentClient(profile);
    }).catch(() => {});
  }, []);

  const addOrUpdateClient = (profile: ClientProfile) => {
    setClients((prev) => {
      const exists = prev.some((c) => c.id === profile.id);
      return exists ? prev.map((c) => (c.id === profile.id ? { ...c, ...profile } : c)) : [profile, ...prev];
    });
  };

  const loginWithProfile = (profile: ClientProfile) => {
    addOrUpdateClient(profile);
    setCurrentClient(profile);
    setHistory((prev) => ({
      ...prev,
      [profile.id]: [
        ...(prev[profile.id] ?? []),
        { id: uuidv4(), type: "login", timestamp: Date.now() },
      ],
    }));
  };

  const logout = () => setCurrentClient(null);

  const logAction: ClientContextValue["logAction"] = (clientId, action) => {
    setHistory((prev) => ({
      ...prev,
      [clientId]: [
        ...(prev[clientId] ?? []),
        { id: uuidv4(), timestamp: Date.now(), ...action },
      ],
    }));
  };

  const value = useMemo<ClientContextValue>(() => ({
    currentClient,
    clients,
    history,
    loginWithProfile,
    logout,
    addOrUpdateClient,
    logAction,
  }), [currentClient, clients, history]);

  return <ClientContext.Provider value={value}>{children}</ClientContext.Provider>;
}

export function useClient() {
  const ctx = useContext(ClientContext);
  if (!ctx) throw new Error("useClient must be used within ClientProvider");
  return ctx;
}