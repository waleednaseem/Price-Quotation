"use client";
import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useClient } from "../context/ClientContext";
import { notifyError, notifySuccess } from "../utils/toast";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

type View = "login" | "signup";

export default function Auth({ initialView = "login" }: { initialView?: View }) {
  const router = useRouter();
  const { clients, loginWithProfile, addOrUpdateClient } = useClient();

  const [view, setView] = useState<View>(initialView);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});

  // Signup form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [terms, setTerms] = useState(false);
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});
  const [role, setRole] = useState<"admin" | "client">("client");
  const searchParams = useSearchParams();

  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);

  const validateLogin = () => {
    const errs: Record<string, string> = {};
    if (!emailRegex.test(loginEmail)) errs.email = "Enter a valid email";
    if (!loginPassword || loginPassword.length < 6) errs.password = "Password must be at least 6 characters";
    setLoginErrors(errs);
    if (Object.keys(errs).length) notifyError("Fix errors to continue");
    return Object.keys(errs).length === 0;
  };

  const validateSignup = () => {
    const errs: Record<string, string> = {};
    if (!name || name.trim().length < 2) errs.name = "Name must be at least 2 characters";
    if (!emailRegex.test(email)) errs.email = "Enter a valid email";
    const strongRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}\[\]:;"'<>,.?/]).{8,}$/;
    if (!strongRe.test(password)) errs.password = "Password must be 8+ chars with upper, lower, number, symbol";
    if (password !== confirm) errs.confirm = "Passwords do not match";
    if (!terms) errs.terms = "You must accept the terms";
    setSignupErrors(errs);
    if (Object.keys(errs).length) notifyError("Fix errors to continue");
    return Object.keys(errs).length === 0;
  };

  const toAvatar = (displayName: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}`;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;
    axios.post("/api/auth/login", { email: loginEmail.toLowerCase(), password: loginPassword }).then((r) => {
      const { id, email, name, role } = r.data;
      const profile = { id, name, email, picture: toAvatar(name), role };
      addOrUpdateClient(profile);
      loginWithProfile(profile);
      notifySuccess("Logged in successfully");
      if (remember) { try { localStorage.setItem("rememberEmail", loginEmail); } catch {} }
      router.push(role === "admin" ? "/admin" : "/client");
    }).catch((err) => {
      const msg = err?.response?.data?.error || err?.message || "Login failed";
      if (msg === "email not verified") {
        notifyError("Please verify your email before login");
      } else {
        notifyError(msg);
      }
    });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignup()) return;
    axios.post('/api/auth/signup', { name: name.trim(), email: email.toLowerCase(), role, password }).then(() => {
      notifySuccess("Verification email sent. Please verify via link in email");
      router.push("/login");
    }).catch((err) => {
      const msg = err?.response?.data?.error || err?.message || "Signup failed";
      notifyError(msg);
    });
  };

  useEffect(() => {
    const approveToken = searchParams?.get("approveToken");
    if (!approveToken) return;
    axios.post('/api/auth/approve', { approveToken }).then((r) => {
      const { id, email, name, role } = r.data;
      const profile = { id, name, email, picture: toAvatar(name), role };
      addOrUpdateClient(profile);
      loginWithProfile(profile);
      notifySuccess("Account approved and signed in");
      router.push(role === "admin" ? "/admin" : "/client");
    }).catch(() => {});
  }, [searchParams]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50" />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(251, 191, 36, 0.06) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(249, 115, 22, 0.06) 0%, transparent 50%)' }} />
      <div className="relative mx-auto max-w-lg px-6 py-10">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-3 py-1 text-xs font-medium text-amber-900 shadow-sm backdrop-blur-sm mb-3">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A4 4 0 018 16h8a4 4 0 012.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0" />
            </svg>
            Welcome
          </div>
          <h1 className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 bg-clip-text text-3xl font-bold tracking-tight text-transparent">Access Your Quotations</h1>
          <p className="mt-2 text-zinc-600">Sign in or create an account to continue.</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          {/* Tabs */}
          <div className="mb-6 flex rounded-lg border border-amber-200 bg-white p-1 text-sm font-medium text-amber-900">
            <button
              onClick={() => setView("login")}
              className={`flex-1 rounded-md px-4 py-2 transition-all ${view === "login" ? "bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm" : "hover:bg-amber-50"}`}
              aria-pressed={view === "login"}
            >
              Login
            </button>
            <button
              onClick={() => setView("signup")}
              className={`flex-1 rounded-md px-4 py-2 transition-all ${view === "signup" ? "bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm" : "hover:bg-amber-50"}`}
              aria-pressed={view === "signup"}
            >
              Signup
            </button>
          </div>

          <AnimatePresence mode="wait">
            {view === "login" ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleLogin}
                noValidate
                aria-labelledby="login-title"
              >
                <h2 id="login-title" className="mb-4 flex items-center gap-2 text-lg font-bold text-zinc-900">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 shadow-md">
                    <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m8-10a4 4 0 100-8 4 4 0 000 8z" />
                    </svg>
                  </span>
                  Login
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-zinc-700">Role</label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className={`flex items-center gap-2 rounded-lg border ${role === "client" ? "border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50" : "border-zinc-300 bg-white"} px-3 py-2 text-sm text-zinc-800 shadow-sm transition-all`}>
                        <input type="radio" name="role" value="client" checked={role === "client"} onChange={() => setRole("client")} />
                        Client / Customer
                      </label>
                      <label className={`flex items-center gap-2 rounded-lg border ${role === "admin" ? "border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50" : "border-zinc-300 bg-white"} px-3 py-2 text-sm text-zinc-800 shadow-sm transition-all`}>
                        <input type="radio" name="role" value="admin" checked={role === "admin"} onChange={() => setRole("admin")} />
                        Admin / Businessman
                      </label>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="login-email" className="mb-1.5 block text-sm font-semibold text-zinc-700">Email</label>
                    <input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="input-elegant w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-400 shadow-sm transition-all focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                      placeholder="you@company.com"
                      aria-invalid={!!loginErrors.email}
                      aria-describedby={loginErrors.email ? "login-email-error" : undefined}
                    />
                    {loginErrors.email && (
                      <p id="login-email-error" className="mt-1 text-xs text-red-600">{loginErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="login-password" className="mb-1.5 block text-sm font-semibold text-zinc-700">Password</label>
                    <input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="input-elegant w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-400 shadow-sm transition-all focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                      placeholder="••••••"
                      aria-invalid={!!loginErrors.password}
                      aria-describedby={loginErrors.password ? "login-password-error" : undefined}
                    />
                    {loginErrors.password && (
                      <p id="login-password-error" className="mt-1 text-xs text-red-600">{loginErrors.password}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-zinc-700">
                      <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded border-zinc-300 text-amber-600 focus:ring-amber-300" />
                      Remember me
                    </label>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => notifyError("Password reset coming soon")} className="text-sm font-medium text-amber-700 hover:underline">Forgot password?</button>
                      <button type="button" onClick={() => {
                        const e = loginEmail.toLowerCase();
                        if (!emailRegex.test(e)) return notifyError("Enter a valid email first");
                        fetch('/api/auth/resend-verification', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: e }) })
                          .then(async (r) => {
                            const d = await r.json();
                            if (!d.ok) return notifyError(d.error || 'Failed');
                            if (d.already_verified) return notifySuccess('Email already verified');
                            notifySuccess('Verification email resent');
                          })
                          .catch(() => notifyError('Network error'));
                      }} className="text-sm font-medium text-amber-700 hover:underline">Resend verification</button>
                    </div>
                  </div>
                  <button type="submit" className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-amber-300 bg-gradient-to-br from-amber-500 to-orange-500 px-5 py-2.5 font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Sign In
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSignup}
                noValidate
                aria-labelledby="signup-title"
              >
                <h2 id="signup-title" className="mb-4 flex items-center gap-2 text-lg font-bold text-zinc-900">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 shadow-md">
                    <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                  Create Account
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="signup-name" className="mb-1.5 block text-sm font-semibold text-zinc-700">Name</label>
                    <input
                      id="signup-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-elegant w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-400 shadow-sm transition-all focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                      placeholder="Jane Doe"
                      aria-invalid={!!signupErrors.name}
                      aria-describedby={signupErrors.name ? "signup-name-error" : undefined}
                    />
                    {signupErrors.name && (
                      <p id="signup-name-error" className="mt-1 text-xs text-red-600">{signupErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="signup-email" className="mb-1.5 block text-sm font-semibold text-zinc-700">Email</label>
                    <input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-elegant w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-400 shadow-sm transition-all focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                      placeholder="you@company.com"
                      aria-invalid={!!signupErrors.email}
                      aria-describedby={signupErrors.email ? "signup-email-error" : undefined}
                    />
                    {signupErrors.email && (
                      <p id="signup-email-error" className="mt-1 text-xs text-red-600">{signupErrors.email}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="signup-password" className="mb-1.5 block text-sm font-semibold text-zinc-700">Password</label>
                      <input
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-elegant w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-400 shadow-sm transition-all focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        placeholder="••••••"
                        aria-invalid={!!signupErrors.password}
                        aria-describedby={signupErrors.password ? "signup-password-error" : undefined}
                      />
                      {signupErrors.password && (
                        <p id="signup-password-error" className="mt-1 text-xs text-red-600">{signupErrors.password}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="signup-confirm" className="mb-1.5 block text-sm font-semibold text-zinc-700">Confirm Password</label>
                      <input
                        id="signup-confirm"
                        type="password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        className="input-elegant w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-400 shadow-sm transition-all focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        placeholder="••••••"
                        aria-invalid={!!signupErrors.confirm}
                        aria-describedby={signupErrors.confirm ? "signup-confirm-error" : undefined}
                      />
                      {signupErrors.confirm && (
                        <p id="signup-confirm-error" className="mt-1 text-xs text-red-600">{signupErrors.confirm}</p>
                      )}
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-zinc-700">
                    <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="h-4 w-4 rounded border-zinc-300 text-amber-600 focus:ring-amber-300" />
                    I agree to the terms and privacy policy
                  </label>
                  {signupErrors.terms && (
                    <p className="mt-1 text-xs text-red-600">{signupErrors.terms}</p>
                  )}
                  <button type="submit" className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-amber-300 bg-gradient-to-br from-amber-500 to-orange-500 px-5 py-2.5 font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Account
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-6 text-center text-sm text-zinc-600">
          {view === "login" ? (
            <button onClick={() => setView("signup")} className="font-semibold text-amber-700 hover:underline">Don’t have an account? Sign up</button>
          ) : (
            <button onClick={() => setView("login")} className="font-semibold text-amber-700 hover:underline">Already have an account? Login</button>
          )}
        </div>
      </div>
    </div>
  );
}