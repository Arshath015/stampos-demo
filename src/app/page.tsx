"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AbstractBackground } from "@/components/ui/AbstractBackground";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const valid = /\S+@\S+\.\S+/.test(email);

  function handleContinue() {
    if (!valid) return;
    router.push("/onboarding");
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg">
      <div className="relative hidden flex-1 overflow-hidden lg:block">
        <AbstractBackground variant="auth" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,10,9,0.2) 0%, rgba(10,10,9,0.85) 100%)",
          }}
        />
        <div className="relative z-[2] flex h-full flex-col items-center justify-center px-16 text-center">
          <h1 className="max-w-[460px] text-[40px] font-light leading-[1.2] tracking-[-1px] text-t1">
            Your brand.
            <br />
            <em
              className="not-italic font-extrabold bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg,#60A5FA,#3B82F6,#818CF8)",
              }}
            >
              AI-generated.
            </em>
            <br />
            Indistinguishable.
          </h1>
          <p className="mt-5 max-w-[380px] text-sm leading-[1.7] text-t3">
            Catalog-ready imagery for every SKU, every marketplace, every
            season — in minutes, not weeks.
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-8 z-[2] flex justify-center gap-8">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-t4">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z" />
              <circle cx="12" cy="13" r="4" />
              <path d="M19 2l1 1.5 1.5 1-1.5 1L19 7l-1-1.5L16.5 4.5 18 3.5z" strokeWidth="1" />
            </svg>
            12,847 images this month
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-t4">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 12 2 2 4-4" />
              <circle cx="12" cy="12" r="9" />
            </svg>
            84% first-pass
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-t4">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l1.5-5h15L21 9" />
              <path d="M3 9c0 1.5 1.2 3 3 3s3-1.5 3-3" />
              <path d="M9 9c0 1.5 1.2 3 3 3s3-1.5 3-3" />
              <path d="M15 9c0 1.5 1.2 3 3 3s3-1.5 3-3" />
              <rect x="3" y="12" width="18" height="9" />
            </svg>
            8 brands
          </div>
        </div>
      </div>

      <div className="flex w-full shrink-0 items-center justify-center border-l border-border bg-s0 p-12 lg:w-[400px]">
        <div className="w-full max-w-[300px]">
          <div className="mb-9 flex items-center gap-2.5">
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-gradient-to-br from-accent to-[#1D4ED8] shadow-[0_0_16px_rgba(59,130,246,0.2)]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" fill="#fff" opacity="0.9" />
              </svg>
            </div>
            <span className="text-sm font-extrabold tracking-[0.5px] text-t1">
              STAMP OS
            </span>
          </div>

          <h2 className="mb-1.5 text-[26px] font-extrabold tracking-[-0.5px] text-t1">
            Welcome back
          </h2>
          <p className="mb-7 text-[13px] text-t3">
            Sign in to your catalog workspace
          </p>

          <button
            type="button"
            onClick={() => router.push("/onboarding")}
            className="mb-2.5 flex w-full items-center justify-center gap-2.5 rounded-md border border-border bg-glass py-2.5 text-[12.5px] font-medium text-t2 transition-colors hover:border-border-h hover:bg-glass-hover"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62Z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <div className="relative my-5 text-center text-[10.5px] text-t4">
            <span className="relative z-10 bg-s0 px-3">or</span>
            <span className="absolute left-0 top-1/2 h-px w-2/5 bg-border" />
            <span className="absolute right-0 top-1/2 h-px w-2/5 bg-border" />
          </div>

          <div className="mb-4">
            <label className="mb-1.5 block text-[11px] font-medium text-t3">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="you@company.com"
              className="w-full rounded-md border border-border bg-glass px-3 py-2.5 text-[13px] text-t1 outline-none transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]"
            />
            {touched && email.length > 0 && !valid && (
              <div className="mt-1 text-[10px] text-danger">
                Please enter a valid email address
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleContinue}
            style={!valid ? { opacity: 0.5, pointerEvents: "none" } : undefined}
            className="w-full rounded-md bg-gradient-to-br from-accent to-[#2563EB] py-2.5 text-[13px] font-bold text-white shadow-[0_2px_8px_rgba(59,130,246,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] transition-all hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(59,130,246,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]"
          >
            Continue with email
          </button>

          <p className="mt-5 text-center text-[11.5px] text-t4">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/onboarding")}
              className="font-medium text-accent-h"
            >
              Start free trial
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
