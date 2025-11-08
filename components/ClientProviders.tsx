"use client";
import React from "react";
import { QuotationProvider } from "../context/QuotationContext";
import { ClientProvider } from "../context/ClientContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  // Only enable GoogleOAuthProvider when a real clientId is configured.
  if (clientId) {
    return (
      <GoogleOAuthProvider clientId={clientId}>
        <ClientProvider>
          <QuotationProvider>
            <ToastContainer />
            {children}
          </QuotationProvider>
        </ClientProvider>
      </GoogleOAuthProvider>
    );
  }

  // Fallback without Google OAuth if clientId is missing.
  return (
    <ClientProvider>
      <QuotationProvider>
        <ToastContainer />
        {children}
      </QuotationProvider>
    </ClientProvider>
  );
}