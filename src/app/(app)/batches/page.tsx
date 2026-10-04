"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { batches } from "@/lib/mock-data";
import type { Batch } from "@/lib/types";

export default function BatchesPage() {
  const router = useRouter();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-lg font-extrabold text-t1">Batches</div>
          <div className="text-[11px] text-t4">Active work queue</div>
        </div>
        <Link href="/generate">
          <Button variant="primary">New generation</Button>
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {["All", "Pending review", "In progress", "Complete"].map((f, i) => (
          <span
            key={f}
            className={`rounded-full border px-3 py-1 text-[11px] font-medium ${
              i === 0 ? "border-gold bg-gold-sub text-gold" : "border-border text-t3"
            }`}
          >
            {f}
          </span>
        ))}
        <div className="flex-1" />
        <select className="rounded-md border border-border bg-glass px-3 py-1.5 text-[11px] text-t2 outline-none">
          <option>All categories</option>
          <option>AOF Dewy Foundation</option>
          <option>Ultrastay Lipstick</option>
        </select>
        <input
          placeholder="Search batches..."
          className="w-56 rounded-md border border-border bg-glass px-3 py-1.5 text-[11px] text-t1 outline-none focus:border-accent"
        />
      </div>

      <DataTable
        rowKey={(b) => b.id}
        rows={batches}
        columns={[
          { header: "Batch", render: (b) => <span className="font-bold text-accent-h">{b.id}</span> },
          { header: "Product", render: (b) => b.productName },
          { header: "Category", render: (b) => b.category },
          { header: "Images", align: "center", render: (b) => b.images },
          { header: "Review Status", render: (b) => <ReviewStatusCell batch={b} /> },
          {
            header: "Approved",
            align: "center",
            render: (b) =>
              b.approved !== undefined ? (
                <span>
                  <b className="font-bold text-success">{b.approved}</b>{" "}
                  <span className="text-[10px] text-t4">/ {b.rejected} rej</span>
                </span>
              ) : (
                <span className="text-t4">—</span>
              ),
          },
          {
            header: "Action",
            align: "right",
            render: (b) => <ActionCell batch={b} onNav={(href) => router.push(href)} />,
          },
        ]}
      />
    </div>
  );
}

function ReviewStatusCell({ batch }: { batch: Batch }) {
  if (batch.reviewState === "pending-batch-review") return <Badge color="yellow">Pending batch review</Badge>;
  if (batch.reviewState === "generating") return <Badge color="blue">Generating...</Badge>;
  const pct = batch.reviewState === "complete" ? 100 : Math.round(((batch.reviewedCount ?? 0) / batch.images) * 100);
  const tone = pct >= 75 ? "var(--success)" : "var(--accent-h)";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-12 max-w-[80px] overflow-hidden rounded-full bg-s2">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct >= 75 ? "var(--success)" : "var(--accent)" }} />
      </div>
      <span className="text-[10px] font-semibold" style={{ color: tone }}>
        {pct === 100 ? "Complete" : `${batch.reviewedCount}/${batch.images}`}
      </span>
    </div>
  );
}

function ActionCell({ batch, onNav }: { batch: Batch; onNav: (href: string) => void }) {
  if (batch.action === "generating") return <span className="text-t4">{batch.updated}</span>;
  const href = batch.action === "export" ? "/export" : "/review";
  const label = batch.action === "export" ? "Export" : batch.reviewState === "pending-batch-review" ? "Start review" : "Resume review";
  return (
    <Button size="sm" onClick={() => onNav(href)}>
      {label}
    </Button>
  );
}
