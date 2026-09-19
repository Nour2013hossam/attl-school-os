"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    document.cookie = "attl_session=active; path=/; max-age=86400; SameSite=Lax";

    await new Promise((resolve) => setTimeout(resolve, 500));

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-[#eef2f7] text-black">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
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
                  placeholder="Minimum 8 characters"
                  className="h-12 w-full rounded-[16px] border border-black/5 bg-white/70 px-4 text-sm outline-none transition focus:border-blue-400/50 focus:bg-white"
                />
              </div>

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
