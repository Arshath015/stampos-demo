"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { confidenceTier } from "@/lib/types";

export interface ResultTile {
  id: string;
  src: string;
  confidence: number;
  shotType?: string;
}

interface RetryState {
  attempt: number;
  total: number;
  reason: string;
  settled: boolean;
}

/** Plausible QA callouts a brand-quality model might catch on its own output,
 * grouped by shot type so a texture macro never claims a "model pose" issue
 * and so on. */
const REASON_POOL: Record<string, string[]> = {
  studio: ["lighting doesn't match brand palette", "color accuracy below brand threshold", "background inconsistency"],
  texture: ["color accuracy below brand threshold", "texture detail below threshold", "product edges look soft"],
  closeup: ["product edges look soft", "color accuracy below brand threshold", "texture detail below threshold"],
  flatlay: ["product distortion", "background inconsistency", "color accuracy below brand threshold"],
  hand: ["hand placement looks unnatural", "product edges look soft", "color accuracy below brand threshold"],
  environment: ["background inconsistency", "lighting doesn't match brand palette", "color accuracy below brand threshold"],
  model: ["model pose issue", "lighting doesn't match brand palette", "background inconsistency"],
  default: ["lighting doesn't match brand palette", "color accuracy below brand threshold", "background inconsistency"],
};

function pickReasons(shotType: string | undefined, count: number): string[] {
  const pool = REASON_POOL[shotType ?? "default"] ?? REASON_POOL.default;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return Array.from({ length: count }, (_, i) => shuffled[i % shuffled.length]);
}

const CONFIDENCE_BADGE_STYLE = {
  hi: "bg-success text-white",
  md: "bg-warning text-black",
  lo: "bg-danger text-white",
};

/**
 * Results grid for Generate step 4 only. A fraction of tiles simulate the
 * AI catching and re-running its own low-quality output before settling on
 * the final (already-existing) result image — a pure UX/timing layer, no
 * new image assets involved. Re-rolls which tiles retry each time
 * `revealToken` changes (i.e. once per completed generation), not on every
 * re-render from toggling the product tab or config toolbox.
 */
export function ResultsRevealGrid({
  foundationImages,
  lipstickImages,
  activeProduct,
  revealToken,
  revealed,
}: {
  foundationImages: ResultTile[];
  lipstickImages: ResultTile[];
  activeProduct: "foundation" | "lipstick";
  revealToken: number;
  revealed: boolean;
}) {
  const [retryStates, setRetryStates] = useState<Record<string, RetryState>>({});

  useEffect(() => {
    const all = [...foundationImages, ...lipstickImages];
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const initial: Record<string, RetryState> = {};
    const plans: { id: string; total: number; reasons: string[] }[] = [];

    all.forEach((img) => {
      // ~1 in 4 to 1 in 3 of results go through a visible retry.
      if (Math.random() >= 0.28) return;
      const total = 1 + Math.floor(Math.random() * 3);
      const reasons = pickReasons(img.shotType, total);
      initial[img.id] = { attempt: 1, total, reason: reasons[0], settled: false };
      plans.push({ id: img.id, total, reasons });
    });

    // Deliberate: rolling which tiles retry is randomized (Math.random) and
    // must happen once per revealToken change, not during render — this is
    // effect-appropriate randomness/timer setup, not a derivable render value.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRetryStates(initial);

    plans.forEach(({ id, total, reasons }) => {
      const step = (attempt: number) => {
        const delay = 800 + Math.random() * 700;
        const t = setTimeout(() => {
          if (attempt < total) {
            setRetryStates((prev) => ({ ...prev, [id]: { attempt: attempt + 1, total, reason: reasons[attempt], settled: false } }));
            step(attempt + 1);
          } else {
            setRetryStates((prev) => ({ ...prev, [id]: { ...prev[id], settled: true } }));
          }
        }, delay);
        timeouts.push(t);
      };
      step(1);
    });

    return () => timeouts.forEach(clearTimeout);
    // Only re-roll when a new generation actually completes, not on every
    // parent re-render (product-tab toggles, toolbox open/close, etc.).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealToken]);

  const activeImages = activeProduct === "foundation" ? foundationImages : lipstickImages;

  return (
    <div className={`grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5 transition-all duration-700 ${revealed ? "opacity-100 blur-0" : "opacity-30 blur-md"}`}>
      {activeImages.map((img) => {
        const r = retryStates[img.id];
        const retrying = r && !r.settled;
        return (
          <div key={img.id} className="relative aspect-[3/4] overflow-hidden rounded-lg border border-glass-border">
            <Image
              src={img.src}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, 20vw"
              className={`object-cover transition-all duration-500 ${retrying ? "scale-105 blur-[2px] brightness-75" : ""}`}
            />
            {retrying ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/35 px-2 text-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                <span className="rounded-full bg-warning px-2 py-0.5 text-[9px] font-bold text-black">
                  Retrying ({r.attempt}/{r.total})
                </span>
                <span className="text-[9px] leading-tight text-white/90">{r.reason}</span>
              </div>
            ) : (
              <span
                className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                  CONFIDENCE_BADGE_STYLE[confidenceTier(img.confidence)]
                }`}
              >
                {img.confidence}%
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
