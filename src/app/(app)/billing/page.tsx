"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const TABS = ["Overview", "Invoices", "Payment method", "Plans"];

const INVOICES: { date: string; desc: string; amount: string; status: string; color: "yellow" | "green" }[] = [];

const PLANS = [
  {
    name: "Solo",
    price: "Free",
    desc: "For individuals getting started",
    current: true,
    features: [
      { text: "500 images/month", ok: true },
      { text: "1 brand", ok: true },
      { text: "Basic backgrounds", ok: true },
      { text: "1 user", ok: true },
      { text: "No API access", ok: false },
      { text: "No review workflow", ok: false },
      { text: "No priority GPU", ok: false },
    ],
  },
  {
    name: "Team",
    price: "₹49,000",
    suffix: "/mo",
    desc: "For growing teams",
    features: [
      { text: "10,000 images/month", ok: true },
      { text: "5 brands", ok: true },
      { text: "All backgrounds + styles", ok: true },
      { text: "Up to 5 users", ok: true },
      { text: "Review workflow", ok: true },
      { text: "Basic API (10K calls)", ok: true },
      { text: "No priority GPU", ok: false },
    ],
  },
  {
    name: "Enterprise",
    price: "₹2,50,000",
    suffix: "/mo",
    desc: "For scaling organizations",
    features: [
      { text: "Unlimited images", ok: true },
      { text: "Unlimited brands", ok: true },
      { text: "Custom styles + training", ok: true },
      { text: "Up to 50 users", ok: true },
      { text: "Multi-level approval", ok: true },
      { text: "Full API (100K calls)", ok: true },
      { text: "Priority GPU + SLA", ok: true },
    ],
  },
];

export default function BillingPage() {
  const [tab, setTab] = useState(0);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-base font-bold text-t1">Billing</div>
        <div className="flex gap-2">
          <Button>Download invoice</Button>
          <Button variant="primary">Upgrade plan</Button>
        </div>
      </div>

      <div className="mb-4 flex w-fit gap-0.5 rounded-md border border-glass-border bg-glass p-1">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`rounded-sm px-3.5 py-1 text-[11.5px] font-medium transition-colors ${
              tab === i ? "bg-s2 font-semibold text-t1" : "text-t3"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 0 && (
        <>
          <Card
            className="mb-4"
            style={{ borderColor: "rgba(59,130,246,0.12)", background: "linear-gradient(135deg,rgba(59,130,246,0.06),transparent)" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-wide text-t4">Current plan</div>
                <div className="mt-1 text-2xl font-black text-t1">Solo</div>
                <div className="mt-0.5 text-xs text-t3">Free · Up to 500 images/month · 1 brand · 1 user</div>
              </div>
              <Button variant="primary">Manage plan</Button>
            </div>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader title="Usage this period" action={<Badge color="blue">Apr 1–30</Badge>} />
              <div className="flex flex-col gap-3 text-xs">
                <UsageRow label="Images generated" value="312 / 500" pct={62} color="var(--accent)" />
                <UsageRow label="Brands" value="1 / 1" pct={100} color="var(--accent)" />
                <UsageRow label="Storage" value="2.1 GB / 5 GB" pct={42} color="var(--accent)" />
                <UsageRow label="Users" value="1 / 1" pct={100} color="var(--accent)" />
              </div>
            </Card>
            <Card>
              <CardHeader
                title="Cost savings"
                action={
                  <Button size="sm">📈 ROI Calculator</Button>
                }
              />
              <div className="py-2 text-center">
                <div className="text-[36px] font-black tracking-[-1px] text-success">₹36.6L</div>
                <div className="mt-1 text-[11px] text-t4">saved vs traditional photography</div>
                <div className="mt-3.5 flex justify-center gap-5 text-[11px]">
                  <div>
                    <span className="text-t4">Traditional</span>
                    <div className="mt-0.5 text-[15px] font-extrabold text-danger line-through">₹38.5L</div>
                  </div>
                  <div>
                    <span className="text-t4">STAMP OS</span>
                    <div className="mt-0.5 text-[15px] font-extrabold text-success">₹1.9L</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}

      {tab === 1 && (
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] text-t3">
              Format:
              <span className="rounded-full border border-gold bg-gold-sub px-2 py-0.5 text-gold">Standard</span>
              <span className="rounded-full border border-border px-2 py-0.5 text-t3">GST (India)</span>
            </div>
            <Button size="sm">Export all</Button>
          </div>
          <div className="grid grid-cols-[100px_1fr_100px_80px_50px] gap-3 border-b border-border pb-2 text-[10px] font-bold uppercase tracking-wide text-t4">
            <div>Date</div>
            <div>Description</div>
            <div>Amount</div>
            <div>Status</div>
            <div>Action</div>
          </div>
          {INVOICES.length === 0 ? (
            <div className="py-8 text-center text-xs text-t4">
              No invoices yet — you&apos;re on the free Solo plan.
            </div>
          ) : (
            INVOICES.map((inv) => (
              <div key={inv.desc} className="grid grid-cols-[100px_1fr_100px_80px_50px] items-center gap-3 border-b border-border py-2.5 text-xs last:border-none">
                <div className="text-t2">{inv.date}</div>
                <div>{inv.desc}</div>
                <div className="font-bold text-t1">{inv.amount}</div>
                <Badge color={inv.color}>{inv.status}</Badge>
                <Button size="sm">↓</Button>
              </div>
            ))
          )}
        </Card>
      )}

      {tab === 2 && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader title="Payment method on file" />
            <div className="flex items-center gap-3.5 rounded-lg border border-border bg-glass p-3.5">
              <div className="flex h-8 w-12 items-center justify-center rounded-md bg-gradient-to-br from-[#1a1f71] to-[#2f54eb] text-[10px] font-black text-white">
                VISA
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-t1">•••• •••• •••• 6411</div>
                <div className="text-[10.5px] text-t4">Expires 09/2028 · SUGAR Cosmetics</div>
              </div>
              <Button size="sm">Update</Button>
            </div>
            <p className="mt-3 text-[11px] text-t4">No upcoming charge — you&apos;re on the free Solo plan.</p>
          </Card>
          <Card>
            <CardHeader title="Billing address" />
            <div className="text-xs leading-relaxed text-t2">
              <div className="font-bold">SUGAR Cosmetics</div>
              <div>Reliance Retail, Jio World Centre</div>
              <div>Bandra Kurla Complex, Mumbai 400051</div>
              <div>Maharashtra, India</div>
              <div className="mt-2 text-t4">GSTIN: 27AABCR1718Q1ZK</div>
            </div>
            <Button size="sm" className="mt-3">Edit address</Button>
          </Card>
        </div>
      )}

      {tab === 3 && (
        <div className="grid gap-4 lg:grid-cols-3">
          {PLANS.map((p) => (
            <Card key={p.name} className={`relative text-center ${p.current ? "border-accent" : ""}`}>
              {p.current && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-[9px] font-extrabold uppercase text-white">
                  Current plan
                </span>
              )}
              <div className="text-[10px] uppercase tracking-wide text-t4">{p.name}</div>
              <div className="my-2 text-[28px] font-black text-t1">
                {p.price}
                {p.suffix && <span className="text-xs font-normal text-t4">{p.suffix}</span>}
              </div>
              <div className="mb-4 text-[11px] text-t4">{p.desc}</div>
              <div className="flex flex-col gap-2 text-left text-[11px] text-t3">
                {p.features.map((f) => (
                  <div key={f.text} className={f.ok ? "" : "text-t4"}>
                    {f.ok ? "✓" : "✕"} {f.text}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function UsageRow({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between">
        <span className="text-t2">{label}</span>
        <span className="font-semibold text-t1">{value}</span>
      </div>
      <div className="mt-2 h-[5px] overflow-hidden rounded-full bg-s2">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
