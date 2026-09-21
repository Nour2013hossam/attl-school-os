"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(payload.error ?? "Could not create your account.");
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
        redirectTo: "/dashboard",
      });

      if (result?.error) {
        setNotice("Your account was created. Please sign in with your new account.");
        setLoading(false);
        return;
      }

      window.location.assign(result?.url ?? "/dashboard");
    } catch (error) {
      console.error("Registration request failed", error);
      setError("Could not reach ATTL right now. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#eef2f7] text-black">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[-100px] h-[450px] w-[450px] rounded-full bg-blue-400/20 blur-[130px]" />
        <div className="absolute right-[-120px] bottom-[-100px] h-[450px] w-[450px] rounded-full bg-cyan-300/15 blur-[130px]" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-5 py-10">
        <div className="w-full max-w-[480px]">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[19px] bg-black text-lg font-semibold text-white">
              A
            </div>
            <h1 className="text-2xl font-semibold tracking-[-0.04em]">
              Create your ATTL account
            </h1>
            <p className="mt-2 text-xs text-black/40">
              Start your journey inside ATTL School OS.
            </p>
          </div>

          <div className="rounded-[32px] border border-white/80 bg-white/65 p-7 shadow-[0_30px_90px_rgba(20,30,50,0.12)] backdrop-blur-[30px]">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-medium text-black/55">
                  Full name
                </label>
                <input
                  required
                  minLength={2}
                  maxLength={120}
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your full name"
                  className="h-12 w-full rounded-[16px] border border-black/5 bg-white/70 px-4 text-sm outline-none transition focus:border-blue-400/50 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-black/55">
                  School email
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@school.com"
                  className="h-12 w-full rounded-[16px] border border-black/5 bg-white/70 px-4 text-sm outline-none transition focus:border-blue-400/50 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-black/55">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  maxLength={128}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Minimum 8 characters"
                  className="h-12 w-full rounded-[16px] border border-black/5 bg-white/70 px-4 text-sm outline-none transition focus:border-blue-400/50 focus:bg-white"
                />
              </div>

              {error && (
                <div role="alert" className="rounded-[14px] bg-red-50 px-4 py-3 text-[10px] text-red-600">
                  {error}
                </div>
              )}

              {notice && (
                <div role="status" className="rounded-[14px] bg-blue-50 px-4 py-3 text-[10px] text-blue-700">
                  {notice}{" "}
                  <Link href="/login" className="font-medium underline underline-offset-2">
                    Sign in
                  </Link>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-3 h-12 w-full rounded-[16px] bg-black text-sm font-medium text-white shadow-lg transition hover:-translate-y-0.5 active:scale-[0.985] disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-black/40">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-500 hover:text-blue-600"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
