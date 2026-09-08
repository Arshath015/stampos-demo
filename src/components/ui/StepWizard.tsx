/**
 * Generic multi-step wizard shell, shared by the onboarding flow and the
 * Generate wizard. Two visual variants match the two contexts, but both are
 * driven by the same `steps`/`current` contract, and the fact that a step
 * can only be reached once every prior step has been reached (no free
 * jumping ahead) is enforced consistently here.
 */
export function StepWizard({
  steps,
  current,
  maxReached,
  onStepClick,
  variant = "stepper",
}: {
  steps: string[];
  current: number;
  maxReached?: number;
  onStepClick?: (index: number) => void;
  variant?: "stepper" | "dots";
}) {
  const reachable = maxReached ?? current;

  if (variant === "dots") {
    const pct = ((current + 1) / steps.length) * 100;
    return (
      <div className="mb-6">
        <div className="mb-5 flex items-center gap-1.5">
          {steps.map((label, i) => (
            <span
              key={label}
              className={`h-0.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-10 bg-gold"
                  : i < current
                    ? "w-5 bg-gold/50"
                    : "w-5 bg-white/15"
              }`}
            />
          ))}
        </div>
        <div className="mb-5 text-[9px] font-semibold uppercase tracking-[2px] text-white/35">
          Step {current + 1} of {steps.length}
        </div>
        <div className="fixed left-0 top-0 z-[510] h-0.5 bg-gradient-to-r from-gold via-[#e8d5b0] to-gold shadow-[0_0_20px_rgba(201,169,110,0.3)] transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    );
  }

  return (
    <div className="mb-6 flex items-center rounded-lg border border-glass-border bg-glass p-3.5 px-5 backdrop-blur-sm">
      {steps.map((label, i) => {
        const isActive = i === current;
        const isDone = i < current;
        const canJump = onStepClick && i <= reachable;
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <button
              type="button"
              disabled={!canJump}
              onClick={() => canJump && onStepClick?.(i)}
              className={`flex items-center gap-2 ${canJump ? "cursor-pointer" : "cursor-default"}`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-[11px] font-bold transition-all ${
                  isActive
                    ? "border-accent bg-accent text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                    : isDone
                      ? "border-success bg-success text-white"
                      : "border-border-s text-t3"
                }`}
              >
                {isDone ? "✓" : i + 1}
              </span>
              <span
                className={`text-xs font-semibold ${isActive ? "text-t1" : "text-t3"}`}
              >
                {label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <span
                className={`mx-3 h-0.5 flex-1 rounded-sm ${
                  isDone ? "bg-success" : "bg-s3"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
