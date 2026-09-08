"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { reviewQueue, batches, parseBatchShade } from "@/lib/mock-data";
import type { ResultImage } from "@/lib/results";

type Screen = "queue" | "batch" | "individual";
type Decision = "approved" | "rejected" | "flagged" | null;

/**
 * Resolves the real result pool for a given batch/SKU product name — scoped
 * to the correct product line AND shade (via parseBatchShade) so every batch
 * shows its own color/texture instead of always defaulting to foundation.
 * Falls back to the unscoped line pool, then the combined pool, for product
 * names outside the two hero SKU lines (e.g. "Matte Setting Powder").
 */
function resolveBatchImages(
  productName: string,
  resultsFoundation: ResultImage[],
  resultsLipstick: ResultImage[]
): ResultImage[] {
  const parsed = parseBatchShade(productName);
  if (!parsed) return [...resultsFoundation, ...resultsLipstick];
  const linePool = parsed.line === "foundation" ? resultsFoundation : resultsLipstick;
  const shadeMatches = linePool.filter((r) => r.shade === parsed.shade);
  if (shadeMatches.length > 0) return shadeMatches;
  return linePool.length > 0 ? linePool : [...resultsFoundation, ...resultsLipstick];
}

/**
 * Picks a queue-card thumbnail from the real results pool — never the raw
 * product reference photo — scoped to the batch's actual product+shade.
 */
function pickQueueThumb(
  product: string,
  resultsFoundation: ResultImage[],
  resultsLipstick: ResultImage[],
  seed: number
): string | null {
  const pool = resolveBatchImages(product, resultsFoundation, resultsLipstick);
  if (pool.length === 0) return null;
  return pool[seed % pool.length].src;
}

interface ToastState {
  id: number;
  message: string;
  undo?: () => void;
  countdown: number;
}

export function ReviewClient({
  resultsFoundation,
  resultsLipstick,
}: {
  resultsFoundation: ResultImage[];
  resultsLipstick: ResultImage[];
}) {
  const [screen, setScreen] = useState<Screen>("queue");
  const [activeBatch, setActiveBatch] = useState<string>("#008");

  const activeBatchRecord = batches.find((b) => b.id === activeBatch);
  const activeProductName = activeBatchRecord?.productName ?? "Product";
  const activeCategory = activeBatchRecord?.category ?? "";
  const batchImages = useMemo(
    () => resolveBatchImages(activeProductName, resultsFoundation, resultsLipstick),
    [activeProductName, resultsFoundation, resultsLipstick]
  );

  if (screen === "batch") {
    return (
      <BatchReviewScreen
        batchId={activeBatch}
        productName={activeProductName}
        images={batchImages}
        onBack={() => setScreen("queue")}
        onSendToIndividual={() => setScreen("individual")}
      />
    );
  }

  if (screen === "individual") {
    return (
      <IndividualReviewScreen
        batchId={activeBatch}
        productName={activeProductName}
        category={activeCategory}
        images={batchImages}
        onBack={() => setScreen("queue")}
      />
    );
  }

  return (
    <div>
      <div className="mb-5 text-lg font-extrabold text-t1">Review Queue</div>

      <QueueSection
        title="Pending Batch Review"
        color="text-warning"
        icon={<ClockIcon />}
      >
        {reviewQueue.pendingBatchReview.map((item, i) => (
          <Card
            key={item.batchId}
            className="cursor-pointer hover:!border-accent"
            onClick={() => {
              setActiveBatch(item.batchId);
              setScreen("batch");
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <QueueThumb src={pickQueueThumb(item.product, resultsFoundation, resultsLipstick, i)} />
                <div>
                  <div className="text-xs font-bold text-t1">
                    Batch {item.batchId} — {item.product}
                  </div>
                  <div className="text-[10.5px] text-t4">{item.meta}</div>
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveBatch(item.batchId);
                  setScreen("batch");
                }}
              >
                Start Batch Review
              </Button>
            </div>
          </Card>
        ))}
      </QueueSection>

      <QueueSection title="In Individual Review" color="text-accent-h" icon={<PencilIcon />}>
        {reviewQueue.inIndividualReview.map((item, i) => (
          <Card key={item.batchId} className="hover:!border-accent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <QueueThumb src={pickQueueThumb(item.product, resultsFoundation, resultsLipstick, i)} />
                <div>
                  <div className="text-xs font-bold text-t1">
                    Batch {item.batchId} — {item.product}
                  </div>
                  <div className="text-[10.5px] text-t4">{item.meta}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-s2">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${item.pct}%`, background: item.pct >= 75 ? "var(--success)" : "var(--accent)" }}
                  />
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    setActiveBatch(item.batchId);
                    setScreen("individual");
                  }}
                >
                  Continue
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </QueueSection>

      <QueueSection title="Complete" color="text-success" icon={<CheckIcon />}>
        {reviewQueue.complete.map((item, i) => (
          <Card key={item.batchId} className="opacity-70">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <QueueThumb src={pickQueueThumb(item.product, resultsFoundation, resultsLipstick, i)} />
                <div>
                  <div className="text-xs font-bold text-t1">
                    Batch {item.batchId} — {item.product}
                  </div>
                  <div className="text-[10.5px] text-t4">{item.meta}</div>
                </div>
              </div>
              <Link href="/export">
                <Button size="sm">Export</Button>
              </Link>
            </div>
          </Card>
        ))}
      </QueueSection>
    </div>
  );
}

function QueueThumb({ src }: { src: string | null }) {
  return (
    <div className="relative h-[54px] w-10 shrink-0 overflow-hidden rounded-md bg-s2">
      {src && <Image src={src} alt="" fill className="object-cover" />}
    </div>
  );
}

function QueueSection({
  title,
  color,
  icon,
  children,
}: {
  title: string;
  color: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <div className={`mb-2.5 flex items-center gap-1.5 text-xs font-bold ${color}`}>
        {icon}
        {title}
      </div>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

function BatchReviewScreen({
  batchId,
  productName,
  images,
  onBack,
  onSendToIndividual,
}: {
  batchId: string;
  productName: string;
  images: ResultImage[];
  onBack: () => void;
  onSendToIndividual: () => void;
}) {
  const pool = images;
  const grid = Array.from({ length: 8 }, (_, i) => pool[i % Math.max(1, pool.length)] ?? null);

  return (
    <div>
      <Breadcrumb items={[["Review", onBack], [`Batch ${batchId}`, undefined], ["Batch Review", undefined]]} />
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-t1">Batch {batchId} — {productName}</span>
          <Badge color="yellow">Stage A: Batch Review</Badge>
        </div>
        <Button variant="primary" size="sm" onClick={onSendToIndividual}>
          Send to Individual Review
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="grid grid-cols-4 gap-2.5">
            {grid.map((img, i) =>
              img ? (
                <div key={i} className="relative aspect-[3/4] overflow-hidden rounded-lg border border-glass-border">
                  <Image src={img.src} alt="" fill className="object-cover" />
                </div>
              ) : (
                <div key={i} className="skel aspect-[3/4] rounded-lg" />
              )
            )}
          </div>
          <p className="mt-3 text-center text-[10.5px] text-t4">
            Showing 8 of 16 images · Scroll for more
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader title="Batch Config" />
            <ConfigSelect label="Image Type" options={["On-model (Male)", "Ghost Mannequin", "Flat Lay"]} />
            <ConfigSelect label="Background" options={["White Studio", "Gradient", "Transparent"]} />
            <ConfigSelect label="Lighting" options={["Soft Diffused", "Dramatic Side", "Natural Window"]} />
            <Button className="mt-2 w-full justify-center">Regenerate Batch</Button>
          </Card>
          <Card>
            <CardHeader title="Color Variants" />
            <p className="mb-2 text-[10.5px] text-t4">
              Select colors to generate variant batches under the same product.
            </p>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {["#1E293B", "#1E3A5F", "#5B7553", "#8B2252", "#F5F5DC"].map((c, i) => (
                <button
                  key={c}
                  style={{ background: c }}
                  className={`flex h-8 w-8 items-center justify-center rounded-md border-2 text-white ${i === 0 ? "border-accent" : "border-border"}`}
                >
                  {i === 0 && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))}
              <button className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-dashed border-border text-sm text-t4">+</button>
            </div>
            <Button variant="primary" className="w-full justify-center">Generate 3 Color Variants</Button>
          </Card>
        </div>
      </div>

      <div
        className="mt-5 flex items-center justify-between rounded-lg px-4 py-3"
        style={{
          background: "linear-gradient(135deg,rgba(59,130,246,0.06),rgba(59,130,246,0.02))",
          border: "1px solid rgba(59,130,246,0.15)",
        }}
      >
        <div>
          <div className="text-xs font-bold text-t1">Ready for individual review?</div>
          <div className="text-[10.5px] text-t4">
            Batch config looks good — proceed to approve/reject each image
          </div>
        </div>
        <Button variant="primary" size="sm" onClick={onSendToIndividual}>
          Start Individual Review
        </Button>
      </div>
    </div>
  );
}

function IndividualReviewScreen({
  batchId,
  productName,
  category,
  images,
  onBack,
}: {
  batchId: string;
  productName: string;
  category: string;
  images: ResultImage[];
  onBack: () => void;
}) {
  const pool = images;
  const filmstrip = Array.from({ length: 8 }, (_, i) => pool[i % Math.max(1, pool.length)] ?? null);
  const [activeIdx, setActiveIdx] = useState(3);
  const [decisions, setDecisions] = useState<Decision[]>(["approved", "approved", "rejected", null, null, null, null, null]);
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [zoom, setZoom] = useState(1);

  function decide(decision: Decision) {
    const previous = decisions[activeIdx];
    const next = [...decisions];
    next[activeIdx] = decision;
    setDecisions(next);

    const id = Date.now();
    const label = decision === "approved" ? "Approved" : decision === "rejected" ? "Rejected" : "Flagged";
    const toast: ToastState = {
      id,
      message: `${label} image ${activeIdx + 1}`,
      countdown: 5,
      undo: () => {
        setDecisions((cur) => {
          const reverted = [...cur];
          reverted[activeIdx] = previous;
          return reverted;
        });
        setToasts((cur) => cur.filter((t) => t.id !== id));
      },
    };
    setToasts((cur) => [...cur, toast]);
    setTimeout(() => setToasts((cur) => cur.filter((t) => t.id !== id)), 5000);

    if (activeIdx < filmstrip.length - 1) setActiveIdx(activeIdx + 1);
  }

  const approvedCount = decisions.filter((d) => d === "approved").length;
  const rejectedCount = decisions.filter((d) => d === "rejected").length;
  const flaggedCount = decisions.filter((d) => d === "flagged").length;
  const reviewedCount = decisions.filter((d) => d !== null).length;

  return (
    <div className="relative">
      <Breadcrumb items={[["Review", onBack], [`Batch ${batchId}`, undefined], ["Individual Review", undefined]]} />
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-t1">Batch {batchId} — {productName}</span>
          <Badge color="blue">Stage B: Individual Review</Badge>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-t3">
          <span>{reviewedCount} of {filmstrip.length} reviewed</span>
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-s2">
            <div className="h-full rounded-full bg-success" style={{ width: `${(reviewedCount / filmstrip.length) * 100}%` }} />
          </div>
          <span className="font-bold text-success">{Math.round((reviewedCount / filmstrip.length) * 100)}%</span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))} className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-t3">−</button>
            <span className="w-10 text-center text-[11px] text-t3">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom((z) => Math.min(4, z + 0.25))} className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-t3">+</button>
            <button onClick={() => setZoom(1)} className="rounded-md border border-border px-2 py-1 text-[11px] text-t3">Fit</button>
          </div>

          <div className="relative flex aspect-[3/4] max-w-[520px] items-center justify-center overflow-hidden rounded-lg bg-bg">
            {filmstrip[activeIdx] ? (
              <Image
                src={filmstrip[activeIdx]!.src}
                alt=""
                fill
                style={{ transform: `scale(${zoom})` }}
                className="object-contain shadow-[0_16px_64px_rgba(0,0,0,0.6)] transition-transform"
              />
            ) : (
              <div className="skel h-full w-full" />
            )}
            <div className="absolute left-3 top-3">
              <Badge color="blue">Image {activeIdx + 1} of {filmstrip.length}</Badge>
            </div>
          </div>

          <div className="mt-4 flex justify-center gap-2.5">
            <DecisionButton color="danger" onClick={() => decide("rejected")}>Reject</DecisionButton>
            <DecisionButton color="warning" onClick={() => decide("flagged")}>Flag</DecisionButton>
            <DecisionButton color="success" onClick={() => decide("approved")}>Approve</DecisionButton>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto">
            {filmstrip.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`relative h-16 w-12 shrink-0 overflow-hidden rounded-md border-2 ${
                  i === activeIdx
                    ? "border-accent"
                    : decisions[i] === "approved"
                      ? "border-success"
                      : decisions[i] === "rejected"
                        ? "border-danger"
                        : "border-transparent opacity-50"
                }`}
              >
                {img && <Image src={img.src} alt="" fill className="object-cover" />}
                {decisions[i] === "approved" && (
                  <div className="absolute inset-x-0 bottom-0 flex h-4 items-center justify-center bg-success">
                    <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
                {decisions[i] === "rejected" && (
                  <div className="absolute inset-x-0 bottom-0 flex h-4 items-center justify-center bg-danger">
                    <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader title="HSB Correction" />
            <SliderRow label="Hue" value="0°" />
            <SliderRow label="Saturation" value="100%" />
            <SliderRow label="Brightness" value="100%" />
            <Button size="sm">Reset to original</Button>
          </Card>
          <Card>
            <CardHeader title="Image Details" />
            <DetailRow label="Product" value={productName} />
            <DetailRow label="Category" value={category || productName} />
            <DetailRow label="Config" value="On-model · White BG" />
            <DetailRow
              label="AI Confidence"
              value={filmstrip[activeIdx] ? `${filmstrip[activeIdx]!.confidence}%` : "—"}
              strong
            />
          </Card>
          <Card>
            <CardHeader title="Rejection Note" />
            <textarea
              rows={3}
              placeholder="Optional: Why was this rejected?"
              className="w-full resize-none rounded-md border border-border bg-s2 px-3 py-2 text-xs text-t1 outline-none focus:border-accent"
            />
          </Card>
          <div className="rounded-lg border border-glass-border bg-glass px-3 py-2 text-[10px] text-t4">
            Shortcuts: <kbd className="rounded bg-s2 px-1">A</kbd> Approve ·{" "}
            <kbd className="rounded bg-s2 px-1">R</kbd> Reject ·{" "}
            <kbd className="rounded bg-s2 px-1">F</kbd> Flag ·{" "}
            <kbd className="rounded bg-s2 px-1">←→</kbd> Navigate ·{" "}
            <kbd className="rounded bg-s2 px-1">Z</kbd> Undo
          </div>
        </div>
      </div>

      <div
        className="mt-5 flex items-center justify-between rounded-lg px-4 py-3"
        style={{
          background: "linear-gradient(135deg,rgba(34,197,94,0.06),rgba(34,197,94,0.02))",
          border: "1px solid rgba(34,197,94,0.15)",
        }}
      >
        <div>
          <div className="text-xs font-bold text-t1">Review complete?</div>
          <div className="text-[10.5px] text-t4">
            {approvedCount} approved, {rejectedCount} rejected, {flaggedCount} flagged from this batch
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/export">
            <Button size="sm">Export approved</Button>
          </Link>
          <Button size="sm" onClick={onBack}>Back to queue</Button>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="rounded-lg border border-border-h bg-s1 px-4 py-3 shadow-[0_16px_64px_rgba(0,0,0,0.3)]">
            <div className="text-xs font-semibold text-t1">{t.message}</div>
            {t.undo && (
              <button onClick={t.undo} className="mt-1.5 rounded bg-accent px-2.5 py-1 text-[10px] font-bold text-white">
                Undo
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Breadcrumb({ items }: { items: [string, (() => void) | undefined][] }) {
  return (
    <div className="mb-3 text-[11px] text-t3">
      {items.map(([label, onClick], i) => {
        const isLast = i === items.length - 1;
        return (
        <span key={label}>
          {isLast ? (
            <strong className="font-bold text-t1">{label}</strong>
          ) : onClick ? (
            <button onClick={onClick} className="cursor-pointer text-accent">
              {label}
            </button>
          ) : (
            <span className="cursor-pointer text-accent">{label}</span>
          )}
          {!isLast && <span className="mx-1.5">/</span>}
        </span>
        );
      })}
    </div>
  );
}

function ConfigSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <div className="mb-3 flex flex-col gap-1">
      <label className="text-[10.5px] font-semibold text-t3">{label}</label>
      <select className="rounded-md border border-border bg-s2 px-2 py-1.5 text-[11px] text-t1 outline-none focus:border-accent">
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function SliderRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-2.5">
      <div className="mb-1 flex justify-between text-[10.5px] text-t3">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <input type="range" className="w-full accent-accent" />
    </div>
  );
}

function DetailRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="mb-1.5 flex justify-between text-[11px]">
      <span className="text-t4">{label}</span>
      <span className={strong ? "font-bold text-success" : "text-t2"}>{value}</span>
    </div>
  );
}

function DecisionButton({
  color,
  onClick,
  children,
}: {
  color: "danger" | "warning" | "success";
  onClick: () => void;
  children: React.ReactNode;
}) {
  const bg = {
    danger: "var(--danger)",
    warning: "var(--warning)",
    success: "var(--success)",
  }[color];
  const padX = color === "success" ? "px-8" : "px-7";
  return (
    <button
      onClick={onClick}
      style={{ background: bg }}
      className={`flex items-center gap-1.5 rounded-lg ${padX} py-3 text-[13px] font-bold text-white transition-transform hover:scale-[1.03]`}
    >
      {children}
    </button>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}
function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m17 3 4 4L7 21H3v-4L17 3Z" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 5-5" />
    </svg>
  );
}
