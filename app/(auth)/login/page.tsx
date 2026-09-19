"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      redirectTo: "/dashboard",
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    window.location.assign(result?.url ?? "/dashboard");
  };

  return (
    <main className="min-h-screen bg-[#eef2f7] text-black">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-[130px]" />
        <div className="absolute right-[-100px] bottom-[-100px] h-[500px] w-[500px] rounded-full bg-cyan-300/15 blur-[130px]" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-5 py-10">
        <div className="w-full max-w-[430px]">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[22px] bg-black text-xl font-semibold text-white shadow-2xl">
              A
            </div>
            <h1 className="text-3xl font-semibold tracking-[-0.04em]">
              Welcome to ATTL
            </h1>
            <p className="mt-2 text-sm text-black/40">
              Al Thagr Technical Lab
            </p>
          </div>

          <div className="rounded-[32px] border border-white/80 bg-white/65 p-7 shadow-[0_30px_90px_rgba(20,30,50,0.12)] backdrop-blur-[30px]">
            <div className="mb-7">
              <h2 className="text-xl font-semibold">Sign in</h2>
              <p className="mt-1 text-xs text-black/40">
                Use your ATTL School OS account.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-medium text-black/55">
                  Email
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@school.com"
                  className="h-12 w-full rounded-[16px] border border-black/5 bg-white/70 px-4 text-sm outline-none transition focus:border-blue-400/50 focus:bg-white focus:shadow-[0_0_0_4px_rgba(59,130,246,0.08)]"
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
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Your password"
                  className="h-12 w-full rounded-[16px] border border-black/5 bg-white/70 px-4 text-sm outline-none transition focus:border-blue-400/50 focus:bg-white focus:shadow-[0_0_0_4px_rgba(59,130,246,0.08)]"
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-[14px] bg-red-50 px-4 py-3 text-[10px] text-red-600"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-3 h-12 w-full rounded-[16px] bg-black text-sm font-medium text-white shadow-[0_12px_30px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(0,0,0,0.2)] active:scale-[0.985] disabled:cursor-wait disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Continue"}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-black/5" />
              <span className="text-[10px] text-black/25">OR</span>
              <div className="h-px flex-1 bg-black/5" />
            </div>

            <Link
              href="/register"
              className="flex h-12 items-center justify-center rounded-[16px] border border-black/5 bg-white/50 text-sm font-medium transition hover:bg-white"
            >
              Create an account
            </Link>
          </div>

          <p className="mt-6 text-center text-[10px] text-black/25">
            ATTL School OS • Secure Student Platform
          </p>
        </div>
      </div>
    </main>
  );
}
