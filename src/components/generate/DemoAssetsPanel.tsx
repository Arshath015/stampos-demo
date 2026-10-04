"use client";

import { useState, type DragEvent } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { foundationSkus, lipstickSkus, type SkuOption } from "@/lib/mock-data";

export type DemoAssetLine = "foundation" | "lipstick";

/** Custom drag payload MIME type used to identify a demo-asset tile being
 * dragged, distinct from a real OS file drag (which populates
 * `dataTransfer.files` instead and is left completely alone). */
export const DEMO_ASSET_MIME = "application/x-stampos-demo-asset";

export interface DemoAssetPayload {
  line: DemoAssetLine;
  shade: string;
}

/**
 * Presenter-only helper for the Generate → Upload step: lets someone demoing
 * the product drag a real product reference photo straight from the page
 * into the dropzone instead of having actual files on hand. Collapsed by
 * default so it never gets in the way of the real upload flow — this is a
 * demo convenience, not a feature a real user of the product would see.
 */
export function DemoAssetsPanel({
  selectedLine,
  selectedShade,
  onUse,
}: {
  selectedLine: DemoAssetLine | null;
  selectedShade: string;
  onUse: (sku: SkuOption, line: DemoAssetLine) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-4 rounded-lg border border-glass-border bg-glass">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3.5 py-2.5 text-left"
      >
        <span className="flex items-center gap-2">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-t4 transition-transform ${open ? "rotate-90" : ""}`}
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
          <span className="text-[12.5px] font-bold text-t1">Demo assets</span>
          <Badge color="gold">FOR DEMO PURPOSES ONLY</Badge>
        </span>
        <span className="text-[10px] text-t4">{open ? "Click to collapse" : "Click to expand"}</span>
      </button>
      {open && (
        <div className="border-t border-glass-border px-3.5 pb-3.5 pt-3">
          <p className="mb-3 text-[10.5px] text-t4">
            Sample product photos for presentations — drag one into the dropzone above, or use the
            button on a tile.
          </p>
          <DemoGroup
            title="Foundation"
            line="foundation"
            skus={foundationSkus}
            selectedLine={selectedLine}
            selectedShade={selectedShade}
            onUse={onUse}
          />
          <DemoGroup
            title="Lipstick"
            line="lipstick"
            skus={lipstickSkus}
            selectedLine={selectedLine}
            selectedShade={selectedShade}
            onUse={onUse}
          />
        </div>
      )}
    </div>
  );
}

function DemoGroup({
  title,
  line,
  skus,
  selectedLine,
  selectedShade,
  onUse,
}: {
  title: string;
  line: DemoAssetLine;
  skus: SkuOption[];
  selectedLine: DemoAssetLine | null;
  selectedShade: string;
  onUse: (sku: SkuOption, line: DemoAssetLine) => void;
}) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="mb-1.5 text-[10.5px] font-semibold text-t3">{title}</div>
      <div className="flex flex-wrap gap-2">
        {skus.map((sku) => (
          <DemoTile
            key={sku.shade}
            sku={sku}
            line={line}
            selected={selectedLine === line && selectedShade === sku.shade}
            onUse={onUse}
          />
        ))}
      </div>
    </div>
  );
}

function DemoTile({
  sku,
  line,
  selected,
  onUse,
}: {
  sku: SkuOption;
  line: DemoAssetLine;
  selected: boolean;
  onUse: (sku: SkuOption, line: DemoAssetLine) => void;
}) {
  function handleDragStart(e: DragEvent<HTMLDivElement>) {
    const payload: DemoAssetPayload = { line, shade: sku.shade };
    e.dataTransfer.setData(DEMO_ASSET_MIME, JSON.stringify(payload));
    e.dataTransfer.effectAllowed = "copy";
  }

  return (
    <div
      className={`flex w-[72px] flex-col items-center gap-1 rounded-md border p-1.5 transition-opacity ${
        selected ? "border-accent opacity-100" : "border-transparent opacity-50 hover:opacity-90"
      }`}
    >
      <div
        draggable
        onDragStart={handleDragStart}
        title="Drag into the dropzone"
        className="relative h-14 w-14 cursor-grab overflow-hidden rounded-md border border-glass-border active:cursor-grabbing"
      >
        <Image src={sku.swatchSrc} alt="" fill sizes="56px" className="object-cover" />
      </div>
      <span className="text-[10px] font-semibold text-t2">Shade {sku.shade}</span>
      <span className="rounded-full bg-gold-sub px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wide text-gold">
        Demo
      </span>
      <button
        type="button"
        onClick={() => onUse(sku, line)}
        className="text-[9px] font-semibold text-accent-h hover:underline"
      >
        Use this photo
      </button>
    </div>
  );
}
