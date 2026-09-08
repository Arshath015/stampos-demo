"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const TABS = ["API Keys", "Endpoints", "Webhooks", "Usage & Limits", "SDKs"];

const API_KEYS = [
  { name: "Production", code: "sk_prod_••••••••••Kn", meta: "Created Jan 15, 2026 · Last used 2 min ago", badge: "Active", color: "green" as const },
  { name: "Staging", code: "sk_stg_••••••••••2r", meta: "Created Feb 3, 2026 · Last used 5h ago", badge: "Test", color: "yellow" as const },
  { name: "Development", code: "sk_dev_••••••••••9n", meta: "Created Mar 20, 2026 · Last used yesterday", badge: "Dev", color: "blue" as const },
];

const ENDPOINTS = [
  { method: "POST", path: "/v1/images/generate", desc: "Generate catalog images", detail: "Accepts SKU data + brand model ID. Returns image URLs. Rate limit: 100/min." },
  { method: "POST", path: "/v1/images/batch", desc: "Batch generation", detail: "Submit up to 500 SKUs per batch. Async processing with webhook callback." },
  { method: "GET", path: "/v1/brands", desc: "List brands", detail: "Returns all brand models with training status and approval rates." },
  { method: "POST", path: "/v1/brands/train", desc: "Train brand model", detail: "Upload reference images and style guidelines. Training takes 15-30 min." },
  { method: "GET", path: "/v1/review/queue", desc: "Review queue", detail: "Get pending images for review. Supports pagination and priority filtering." },
  { method: "DEL", path: "/v1/images/{id}", desc: "Delete image", detail: "Permanently remove a generated image and associated metadata." },
];

const WEBHOOKS = [
  { name: "Generation complete", url: "https://api.ajio.com/hooks/stamp-gen", meta: "Last triggered 12 min ago · 342 deliveries · 99.7% success" },
  { name: "Review completed", url: "https://api.ajio.com/hooks/stamp-review", meta: "Last triggered 2h ago · 89 deliveries · 100% success" },
  { name: "Batch failed", url: "https://api.ajio.com/hooks/stamp-error", meta: "Last triggered 3d ago · 4 deliveries · 100% success" },
];

const DELIVERIES = [
  { status: 200, event: "generation.complete", time: "12 min ago" },
  { status: 200, event: "generation.complete", time: "28 min ago" },
  { status: 200, event: "review.approved", time: "2h ago" },
  { status: 500, event: "generation.complete", time: "3d ago · Retried OK" },
];

const RATE_LIMITS = [
  { label: "Image generation", limit: "100 req/min", pct: 34, current: "Currently: 34 req/min" },
  { label: "Batch processing", limit: "10 req/min", pct: 20, current: "Currently: 2 req/min" },
  { label: "Read operations", limit: "1,000 req/min", pct: 12, current: "Currently: 120 req/min" },
];

const QUOTAS = [
  { label: "API calls", value: "24,180 / 100,000", pct: 24 },
  { label: "Image generations", value: "12,847 / Unlimited", pct: 100, unlimited: true },
  { label: "Storage", value: "48 GB / 200 GB", pct: 24 },
  { label: "Bandwidth", value: "2.4 TB / 10 TB", pct: 24 },
];

const SDKS = [
  { icon: "JS", color: "#F59E0B", name: "JavaScript / Node.js", install: "npm install @stampos/sdk" },
  { icon: "Py", color: "#3B82F6", name: "Python", install: "pip install stampos" },
  { icon: "Rb", color: "#EF4444", name: "Ruby", install: "gem install stampos" },
];

export default function ApiDocsPage() {
  const [tab, setTab] = useState(0);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-base font-bold text-t1">API &amp; Developer Hub</div>
        <div className="flex gap-2">
          <Button>Docs</Button>
          <Button variant="primary">New key</Button>
        </div>
      </div>

      <div className="mb-4 flex w-fit flex-wrap gap-0.5 rounded-md border border-glass-border bg-glass p-1">
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
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader title="API keys" />
            <div className="flex flex-col">
              {API_KEYS.map((k, i) => (
                <div key={k.name} className={`flex items-center justify-between py-2.5 ${i < API_KEYS.length - 1 ? "border-b border-border" : ""}`}>
                  <div>
                    <div className="text-xs font-bold text-t1">{k.name}</div>
                    <code className="mt-0.5 inline-block rounded bg-s2 px-1.5 py-0.5 text-[10px] text-t3">{k.code}</code>
                    <div className="mt-0.5 text-[10px] text-t4">{k.meta}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button size="sm">Rotate</Button>
                    <Badge color={k.color}>{k.badge}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardHeader title="Quick stats" />
            <div className="grid grid-cols-2 gap-3.5 text-xs">
              <div>
                <span className="text-t4">API calls today</span>
                <div className="mt-0.5 text-lg font-extrabold text-t1">24,180</div>
              </div>
              <div>
                <span className="text-t4">Avg latency</span>
                <div className="mt-0.5 text-lg font-extrabold text-t1">142ms</div>
              </div>
              <div>
                <span className="text-t4">Error rate</span>
                <div className="mt-0.5 text-lg font-extrabold text-success">0.02%</div>
              </div>
              <div>
                <span className="text-t4">Bandwidth</span>
                <div className="mt-0.5 text-lg font-extrabold text-t1">2.4 TB</div>
              </div>
            </div>
            <div className="mt-3.5 rounded-md bg-[rgba(34,197,94,0.08)] py-2.5 text-center text-[11px] font-semibold text-success">
              99.98% uptime this month
            </div>
          </Card>
        </div>
      )}

      {tab === 1 && (
        <Card>
          <CardHeader title="REST API Endpoints" />
          <div className="flex flex-col">
            {ENDPOINTS.map((e, i) => (
              <div key={e.path} className={`py-2.5 ${i < ENDPOINTS.length - 1 ? "border-b border-border" : ""}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`min-w-[48px] rounded-full px-2 py-0.5 text-center font-mono text-[10px] font-bold ${
                        e.method === "GET" ? "bg-success-sub text-success" : e.method === "DEL" ? "bg-danger-sub text-danger" : "bg-accent-sub text-accent-h"
                      }`}
                    >
                      {e.method}
                    </span>
                    <code className="text-xs font-semibold text-t1">{e.path}</code>
                  </div>
                  <span className="text-[11px] text-t4">{e.desc}</span>
                </div>
                <div className="mt-1 text-[10.5px] text-t4">{e.detail}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 2 && (
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader title="Configured webhooks" action={<Button size="sm">+ Add webhook</Button>} />
            <div className="flex flex-col">
              {WEBHOOKS.map((w, i) => (
                <div key={w.name} className={`flex items-center justify-between py-2.5 ${i < WEBHOOKS.length - 1 ? "border-b border-border" : ""}`}>
                  <div>
                    <div className="text-xs font-bold text-t1">{w.name}</div>
                    <code className="mt-0.5 inline-block rounded bg-s2 px-1.5 py-0.5 text-[10px] text-t3">{w.url}</code>
                    <div className="mt-0.5 text-[10px] text-t4">{w.meta}</div>
                  </div>
                  <Badge color="green">Active</Badge>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardHeader title="Recent webhook deliveries" />
            <div className="flex flex-col text-[11px] text-t3">
              {DELIVERIES.map((d, i) => (
                <div key={i} className={`flex items-center justify-between py-1.5 ${i < DELIVERIES.length - 1 ? "border-b border-border" : ""}`}>
                  <div className="flex items-center gap-1.5">
                    <span className={`font-extrabold ${d.status === 200 ? "text-success" : "text-danger"}`}>{d.status}</span>
                    <span>{d.event}</span>
                  </div>
                  <span className="text-t4">{d.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === 3 && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader title="Rate limits" />
            <div className="flex flex-col gap-3">
              {RATE_LIMITS.map((r) => (
                <div key={r.label} className="text-xs">
                  <div className="flex justify-between">
                    <span className="text-t2">{r.label}</span>
                    <span className="font-semibold text-t1">{r.limit}</span>
                  </div>
                  <div className="mt-2 h-[5px] overflow-hidden rounded-full bg-s2">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${r.pct}%` }} />
                  </div>
                  <div className="mt-0.5 text-[10px] text-t4">{r.current}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardHeader title="Monthly quotas" />
            <div className="flex flex-col gap-3">
              {QUOTAS.map((q) => (
                <div key={q.label} className="text-xs">
                  <div className="flex justify-between">
                    <span className="text-t2">{q.label}</span>
                    <span className="font-semibold text-t1">{q.value}</span>
                  </div>
                  <div className="mt-2 h-[5px] overflow-hidden rounded-full bg-s2">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${q.pct}%`, background: q.unlimited ? "var(--success)" : "var(--accent)" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === 4 && (
        <div>
          <div className="mb-4 grid gap-3 lg:grid-cols-3">
            {SDKS.map((s) => (
              <Card key={s.name} className="flex items-center gap-3.5">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-xs font-extrabold"
                  style={{ background: `${s.color}1f`, color: s.color }}
                >
                  {s.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-bold text-t1">{s.name}</div>
                  <div className="font-mono text-[10.5px] text-t4">{s.install}</div>
                </div>
                <Button size="sm">Install</Button>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader title="Quick start" />
            <pre className="overflow-x-auto rounded-md bg-s2 p-3.5 font-mono text-[11px] leading-[1.8] text-t2">
{`// Initialize STAMP OS SDK
import { StampOS } from '@stampos/sdk';

const stamp = new StampOS({ apiKey: 'sk_prod_...' });

// Generate catalog images
const result = await stamp.images.generate({
  sku: 'SKU-4821',
  brand: 'ajio-private-labels',
  style: 'editorial',
  count: 4
});`}
            </pre>
          </Card>
        </div>
      )}
    </div>
  );
}
