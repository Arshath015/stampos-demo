import { ReactNode } from "react";

export const ONBOARDING_STEPS = [
  "Welcome",
  "Role",
  "Categories",
  "Brand",
  "References",
  "Output",
  "Done",
];

/** Fixed chrome only — logo/back header + top progress bar. Verbatim port of
 * .onb-hd / .onb-progress. Layout of the screen itself (split vs full-width
 * immersive) is decided per-step by the page, since the prototype mixes both
 * patterns across the 7 steps. */
export function OnboardingShell({
  step,
  onBack,
  children,
}: {
  step: number;
  onBack?: () => void;
  children: ReactNode;
}) {
  const pct = ((step + 1) / ONBOARDING_STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#f8f8f2]">
      <div
        className="fixed left-0 top-0 z-[510] h-0.5 bg-gradient-to-r from-gold via-[#e8d5b0] to-gold shadow-[0_0_20px_rgba(201,169,110,0.3)] transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
      <div className="fixed left-0 right-0 top-0 z-[505] flex items-center justify-between px-10 py-6">
        <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[2px] text-white/90">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-gold to-gold-dim">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#0a0a0b">
              <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          STAMP OS
        </div>
        {onBack && step > 0 ? (
          <button
            type="button"
            onClick={onBack}
            className="rounded-md border border-white/10 px-3.5 py-1.5 text-[11px] tracking-wide text-white/50 transition-colors hover:border-white/30 hover:text-white"
          >
            ← Back
          </button>
        ) : (
          <span style={{ visibility: "hidden" }} />
        )}
      </div>
      {children}
    </div>
  );
}

/** Verbatim port of .onb-step-indicator / .onb-step-dot / .onb-step-label. */
export function StepIndicator({
  total,
  current,
  center,
}: {
  total: number;
  current: number;
  center?: boolean;
}) {
  return (
    <>
      <div className={`mb-1.5 flex items-center gap-1.5 ${center ? "justify-center" : ""}`}>
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`h-0.5 rounded-full transition-all duration-300 ${
              i === current ? "w-10 bg-gold" : i < current ? "w-5 bg-gold/50" : "w-5 bg-white/15"
            }`}
          />
        ))}
      </div>
      <div className={`mb-5 text-[9px] font-semibold uppercase tracking-[2px] text-white/35 ${center ? "text-center" : ""}`}>
        Step {current + 1} of {total}
      </div>
    </>
  );
}

/** Verbatim port of .onb-split / .onb-vis / .onb-vis-overlay / .onb-vis-content
 * / .onb-form / .onb-form-inner — the two-column layout used by S1, S2, S4,
 * S5, S6. */
export function OnboardingSplit({
  vis,
  visClassName = "",
  overlay = "linear-gradient(135deg,rgba(10,10,11,0.4),rgba(10,10,11,0.7))",
  children,
}: {
  vis: ReactNode;
  visClassName?: string;
  overlay?: string | null;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
      <div className={`relative hidden items-center justify-center overflow-hidden lg:flex ${visClassName}`}>
        {vis}
        {overlay && <div className="absolute inset-0" style={{ background: overlay }} />}
      </div>
      <div className="flex items-center justify-center bg-[#0a0a0b] px-6 py-24 lg:px-14 lg:py-20">
        <div className="w-full max-w-[420px]">{children}</div>
      </div>
    </div>
  );
}
