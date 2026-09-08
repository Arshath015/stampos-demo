"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

function useCountUp(target: number, decimals = 0, durationMs = 900) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const start = performance.now();
    let raf = 0;
    function tick(now: number) {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return value.toFixed(decimals);
}

export function StatCard({
  label,
  icon,
  iconBg = "var(--glass-active)",
  iconColor = "var(--t2)",
  value,
  decimals = 0,
  suffix = "",
  sub,
  delta,
  deltaDirection = "up",
}: {
  label: string;
  icon?: ReactNode;
  iconBg?: string;
  iconColor?: string;
  value: number;
  decimals?: number;
  suffix?: string;
  sub?: string;
  delta?: string;
  deltaDirection?: "up" | "down";
}) {
  const display = useCountUp(value, decimals);
  return (
    <div className="rounded-lg border border-glass-border bg-glass p-4 backdrop-blur-sm transition-colors hover:border-border-h">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] font-medium text-t3">{label}</span>
        {icon && (
          <span
            className="flex h-8 w-8 items-center justify-center rounded-md"
            style={{ background: iconBg, color: iconColor }}
          >
            {icon}
          </span>
        )}
      </div>
      <div className="mb-1 text-[28px] font-black leading-none tracking-tight text-t1">
        {Number(display).toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}
        {suffix}
      </div>
      {(sub || delta) && (
        <div className="text-[11px] text-t4">
          {delta && (
            <span
              className={`font-semibold ${
                deltaDirection === "up" ? "text-success" : "text-danger"
              }`}
            >
              {delta}{" "}
            </span>
          )}
          {sub}
        </div>
      )}
    </div>
  );
}
