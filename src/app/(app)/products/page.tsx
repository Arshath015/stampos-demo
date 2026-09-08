"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { skuTable, foundationShades, lipstickShades } from "@/lib/mock-data";

const thumbs = [foundationShades[8], lipstickShades[9], lipstickShades[10], lipstickShades[11], lipstickShades[0]];

export default function ProductsPage() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-lg font-extrabold text-t1">My Products</div>
          <div className="text-[11px] text-t4">12 products</div>
        </div>
        <Link href="/generate">
          <Button variant="primary">New Product</Button>
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select className="rounded-md border border-border bg-glass px-3 py-1.5 text-[11px] text-t2 outline-none">
          <option>All categories</option>
          <option>AOF Dewy Foundation</option>
          <option>Concealer</option>
          <option>Ultrastay Lipstick</option>
          <option>Lip Liner</option>
          <option>Accessories</option>
        </select>
        <select className="rounded-md border border-border bg-glass px-3 py-1.5 text-[11px] text-t2 outline-none">
          <option>All statuses</option>
          <option>Has pending review</option>
          <option>Complete</option>
          <option>In progress</option>
        </select>
        {["Summer 2026", "Nykaa Catalog", "Website Heroes"].map((tag, i) => (
          <span
            key={tag}
            className={`rounded-full border px-3 py-1 text-[11px] font-medium ${
              i === 0 ? "border-gold bg-gold-sub text-gold" : "border-border text-t3"
            }`}
          >
            {tag}
          </span>
        ))}
        <div className="flex-1" />
        <input
          placeholder="Search products..."
          className="w-56 rounded-md border border-border bg-glass px-3 py-1.5 text-[11px] text-t1 outline-none focus:border-accent"
        />
      </div>

      <DataTable
        rowKey={(r) => r.product}
        rows={skuTable}
        columns={[
          {
            header: "Product",
            render: (r) => (
              <div className="flex items-center gap-2.5">
                <div className="relative h-10 w-8 shrink-0 overflow-hidden rounded">
                  <Image src={thumbs[skuTable.indexOf(r) % thumbs.length].src} alt="" fill className="object-cover" />
                </div>
                <div>
                  <div className="font-semibold text-t1">{r.product}</div>
                  <div className="text-[10.5px] text-t4">{r.sub}</div>
                </div>
              </div>
            ),
          },
          { header: "Category", render: (r) => r.category },
          { header: "Batches", align: "center", render: (r) => r.batches },
          { header: "Images", align: "center", render: (r) => r.images },
          {
            header: "Review",
            render: (r) =>
              r.reviewPct === null ? (
                <span className="rounded bg-warning-sub px-1.5 py-0.5 text-[10px] font-semibold text-warning">
                  {r.reviewLabel}
                </span>
              ) : (
                <div className="flex items-center gap-1.5">
                  <div className="h-[5px] w-12 overflow-hidden rounded-full bg-s2">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${r.reviewPct}%`,
                        background: r.reviewPct >= 75 ? "var(--success)" : "var(--accent)",
                      }}
                    />
                  </div>
                  <span
                    className="text-[10px] font-semibold"
                    style={{ color: r.reviewPct >= 75 ? "var(--success)" : "var(--accent-h)" }}
                  >
                    {r.reviewPct === 100 ? "Done" : `${r.reviewPct}%`}
                  </span>
                </div>
              ),
          },
          {
            header: "Tags",
            render: (r) =>
              r.tags.length ? (
                <div className="flex gap-1">
                  {r.tags.map((t) => (
                    <Badge key={t} color="gold">{t}</Badge>
                  ))}
                </div>
              ) : (
                <span className="text-t4">—</span>
              ),
          },
          { header: "Updated", align: "right", render: (r) => <span className="text-t4">{r.updated}</span> },
        ]}
      />
    </div>
  );
}
