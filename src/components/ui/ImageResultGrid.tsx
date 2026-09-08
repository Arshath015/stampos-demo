"use client";

import Image from "next/image";
import { useState } from "react";
import { Badge, BadgeColor } from "./Badge";
import type { ReviewStatus } from "@/lib/types";
import { confidenceTier } from "@/lib/types";

export interface GridImage {
  id: string;
  src: string;
  confidence?: number;
  status?: ReviewStatus;
  /** Overrides the default status label text (e.g. .ib-ai reads "Ready" on
   * the Generate upload step but "AI Enhanced" on the dashboard — same
   * color, different copy per context). */
  statusLabel?: string;
  title?: string;
  meta?: string;
}

const STATUS_BADGE: Record<ReviewStatus, { label: string; color: BadgeColor }> = {
  approved: { label: "Approved", color: "green" },
  pending: { label: "Pending", color: "yellow" },
  rejected: { label: "Rejected", color: "red" },
  "ai-enhanced": { label: "AI Enhanced", color: "blue" },
};

const CONFIDENCE_STYLE = {
  hi: "bg-success/85 text-white",
  md: "bg-warning/85 text-black",
  lo: "bg-danger/85 text-white",
};

/** Solid (non-tinted) tier colors — used when the badge itself IS the raw
 * confidence number, e.g. Generate step 4 results (.ib-ok / .ib-pen / .ib-no
 * in the prototype use fully opaque success/warning/danger, not the
 * translucent hover-only ai-conf style used on the dashboard). */
const CONFIDENCE_BADGE_STYLE = {
  hi: "bg-success text-white",
  md: "bg-warning text-black",
  lo: "bg-danger text-white",
};

const COLS: Record<number, string> = {
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
};

export function ImageResultGrid({
  images,
  columns = 5,
  selectable = false,
  onSelectionChange,
  aspect = "aspect-[3/4]",
  badgeMode = "status",
  overlayAlwaysVisible = false,
}: {
  images: GridImage[];
  columns?: 3 | 4 | 5 | 6;
  selectable?: boolean;
  onSelectionChange?: (selected: string[]) => void;
  /** Keep the title/meta overlay permanently visible instead of hover-only
   * (e.g. the Categories grid, which has opacity:1 in the prototype). */
  overlayAlwaysVisible?: boolean;
  aspect?: string;
  /** "status" (default): status word top-right + confidence-tier hover
   * overlay top-left (dashboard, brand gallery, products, etc).
   * "confidence": the raw confidence % itself is the permanent top-right
   * badge, colored by tier — no separate hover overlay (Generate step 4). */
  badgeMode?: "status" | "confidence";
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    if (!selectable) return;
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
    onSelectionChange?.(Array.from(next));
  }

  return (
    <div className={`grid gap-2.5 ${COLS[columns]}`}>
      {images.map((img) => {
        const isSelected = selected.has(img.id);
        return (
          <div
            key={img.id}
            onClick={() => toggle(img.id)}
            className={`group relative overflow-hidden rounded-lg border transition-all duration-200 ${aspect} ${
              selectable ? "cursor-pointer" : "cursor-pointer"
            } ${
              isSelected
                ? "border-accent outline outline-2 outline-accent"
                : "border-glass-border hover:-translate-y-0.5 hover:border-border-h hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
            }`}
          >
            <Image
              src={img.src}
              alt={img.title ?? "Generated product image"}
              fill
              sizes="(max-width: 640px) 50vw, 20vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {badgeMode === "confidence" && img.confidence !== undefined && (
              <span
                className={`absolute right-2 top-2 z-10 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                  CONFIDENCE_BADGE_STYLE[confidenceTier(img.confidence)]
                }`}
              >
                {img.confidence}%
              </span>
            )}

            {badgeMode === "status" && img.status && (
              <div className="absolute right-2 top-2 z-10">
                <Badge color={STATUS_BADGE[img.status].color}>
                  {img.statusLabel ?? STATUS_BADGE[img.status].label}
                </Badge>
              </div>
            )}

            {badgeMode === "status" && img.confidence !== undefined && (
              <div
                className={`absolute left-2 top-2 z-10 flex items-center gap-1 rounded-full px-2 py-0.5 text-[8.5px] font-bold opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100 ${
                  CONFIDENCE_STYLE[confidenceTier(img.confidence)]
                }`}
              >
                {img.confidence}%
              </div>
            )}

            {(img.title || img.meta) && (
              <div
                className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2.5 pb-2.5 transition-opacity ${
                  overlayAlwaysVisible ? "pt-8 opacity-100" : "pt-7 opacity-0 group-hover:opacity-100"
                }`}
              >
                {img.title && (
                  <div className="text-[11px] font-semibold text-white">
                    {img.title}
                  </div>
                )}
                {img.meta && (
                  <div className="text-[9.5px] text-white/50">{img.meta}</div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
