"use client";

import type { UploadPhase } from "./useSimulatedUpload";

/**
 * Shared visual for the simulated upload → training sequence. Calm
 * blue/accent tones throughout — this is meant to read as "the AI is
 * working," not as an error or warning state.
 */
export function UploadTrainingPanel({
  phase,
  progress,
  fileNames,
  previews,
  skuLabel,
}: {
  phase: UploadPhase;
  progress: number;
  fileNames: string[];
  /** Real blob: object URLs for the files the presenter actually picked
   * (see useObjectUrls) — rendered as genuine thumbnails, not a preset. */
  previews?: string[];
  /** e.g. "AOF Dewy Foundation — Shade 07" — named in the training copy so
   * it's clear which SKU is being trained on. */
  skuLabel?: string;
}) {
  if (phase === "uploading") {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-h">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <div className="text-sm font-semibold text-t1">
          Uploading {fileNames.length} {fileNames.length === 1 ? "file" : "files"}...
        </div>
        {fileNames.length > 0 && (
          <div className="max-w-xs truncate text-[10.5px] text-t4">{fileNames.join(", ")}</div>
        )}
        <ThumbRow previews={previews} />
        <div className="mt-1 h-1.5 w-64 overflow-hidden rounded-full bg-s2">
          <div className="h-full rounded-full bg-accent transition-all duration-150" style={{ width: `${progress}%` }} />
        </div>
      </div>
    );
  }

  if (phase === "training") {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <div className="text-sm font-semibold text-t1">Image model is training...</div>
        <div className="text-[11px] text-t4">
          {skuLabel ? <>Learning {skuLabel}&apos;s color, texture, and finish</> : "Learning this SKU's color, texture, and finish"}
        </div>
        <ThumbRow previews={previews} />
        <div className="mt-1 h-1.5 w-64 overflow-hidden rounded-full bg-s2">
          <div className="h-full rounded-full bg-accent transition-all duration-150" style={{ width: `${progress}%` }} />
        </div>
        <div className="text-[10.5px] text-t4">STAMP AI v3.2 · Brand model fine-tuning</div>
      </div>
    );
  }

  return null;
}

/** Real thumbnails of whatever the presenter just picked, capped so a
 * 50-file batch doesn't blow out the layout. */
function ThumbRow({ previews }: { previews?: string[] }) {
  if (!previews || previews.length === 0) return null;
  const shown = previews.slice(0, 6);
  const overflow = previews.length - shown.length;
  return (
    <div className="flex flex-wrap justify-center gap-1.5">
      {shown.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element -- blob: object URLs aren't valid next/image sources
        <img key={i} src={src} alt="" className="h-12 w-12 rounded-md border border-glass-border object-cover" />
      ))}
      {overflow > 0 && (
        <div className="flex h-12 w-12 items-center justify-center rounded-md border border-glass-border bg-s2 text-[10px] font-semibold text-t3">
          +{overflow}
        </div>
      )}
    </div>
  );
}
