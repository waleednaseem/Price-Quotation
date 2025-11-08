import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import ClientProviders from "../components/ClientProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Professional Quotation Management",
  description: "Elegant quotation system for modern businesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProviders>
          <header className="sticky top-0 z-50 border-b border-amber-100 bg-white/90 backdrop-blur-xl shadow-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
              <Link href="/" className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent transition-all hover:scale-105">
                <svg className="h-7 w-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Quotations
              </Link>
              <nav className="flex gap-2">
                <Link href="/admin" className="group relative overflow-hidden rounded-lg border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 px-5 py-2.5 font-medium text-amber-900 shadow-sm transition-all hover:scale-105 hover:shadow-md">
                  <span className="relative z-10">Admin</span>
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-100 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
                <Link href="/client" className="group relative overflow-hidden rounded-lg border border-amber-200 bg-white px-5 py-2.5 font-medium text-amber-900 shadow-sm transition-all hover:scale-105 hover:shadow-md">
                  <span className="relative z-10">Client</span>
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </nav>
            </div>
          </header>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
