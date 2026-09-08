"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";

const TABS = ["Overview", "Quality", "Speed", "Cost", "Brands"];
const RANGES = ["30d", "90d", "12m"];

const CATEGORY_BREAKDOWN = [
  { name: "Lip Color", pct: 38, color: "var(--accent)" },
  { name: "Face Makeup", pct: 24, color: "var(--info)" },
  { name: "Eye Makeup", pct: 18, color: "var(--success)" },
  { name: "Skin Care", pct: 12, color: "var(--warning)" },
  { name: "Accessories", pct: 8, color: "var(--danger)" },
];

const TOP_PERFORMERS = [
  { rank: 1, name: "SUGAR Cosmetics", value: "89%", delta: "+4%", rankColor: "var(--success)", badge: "green" as const },
  { rank: 2, name: "GlowCo", value: "91%", delta: "+2%", rankColor: "var(--accent-h)", badge: "green" as const },
  { rank: 3, name: "FabIndia", value: "88%", delta: "+1%", rankColor: "var(--warning)", badge: "blue" as const },
  { rank: 4, name: "SUGAR Cosmetics", value: "76%", delta: "-2%", rankColor: "var(--t4)", badge: "yellow" as const, warn: true },
];

export default function AnalyticsPage() {
  const [tab, setTab] = useState(0);
  const [range, setRange] = useState(0);

  return (
    <div>
      <div className="mb-3 text-[11px] text-t3">
        <Link href="/dashboard" className="text-accent">Home</Link> / Analytics
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-0.5 rounded-md border border-glass-border bg-glass p-1">
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
        <div className="flex gap-1.5">
          {RANGES.map((r, i) => (
            <button
              key={r}
              onClick={() => setRange(i)}
              className={`rounded-full border px-3 py-1 text-[11px] font-medium ${
                range === i ? "border-gold bg-gold-sub text-gold" : "border-border text-t3"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <StatCard label="Generated" value={42180} delta="+24%" />
        <StatCard label="Avg quality" value={83.4} decimals={1} delta="+2.1" />
        <StatCard label="Avg time" value={18} suffix="s" delta="-3s" />
        <div className="rounded-lg border border-glass-border bg-glass p-4">
          <div className="mb-2 text-[11px] font-medium text-t3">Savings</div>
          <div className="mb-1 text-[22px] font-black leading-none text-success">95%</div>
          <div className="text-[11px] text-t4">vs traditional</div>
        </div>
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Quality trend" />
          <QualityTrendChart />
          <div className="mt-1.5 flex justify-center gap-4 text-[10px] text-t4">
            <span className="flex items-center gap-1">
              <span className="h-0.5 w-3 rounded-sm bg-success" /> Quality
            </span>
            <span className="flex items-center gap-1">
              <span className="h-0.5 w-3 rounded-sm border-t border-dashed border-accent bg-accent" /> Brand
            </span>
          </div>
        </Card>
        <Card>
          <CardHeader title="By category" />
          <div className="flex flex-col gap-2.5 text-[11.5px]">
            {CATEGORY_BREAKDOWN.map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between">
                  <span className="text-t2">{c.name}</span>
                  <span className="font-bold text-t1">{c.pct}%</span>
                </div>
                <div className="mt-1 h-[5px] overflow-hidden rounded-full bg-s2">
                  <div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: c.color }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Generation volume" />
          <VolumeBarChart />
        </Card>
        <Card>
          <CardHeader title="Top performers" />
          <div className="flex flex-col text-xs">
            {TOP_PERFORMERS.map((p, i) => (
              <div
                key={`${p.name}-${p.rank}`}
                className={`flex items-center justify-between py-2 ${i < TOP_PERFORMERS.length - 1 ? "border-b border-border" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 font-black" style={{ color: p.rankColor }}>{p.rank}</span>
                  <span className="font-bold text-t1">{p.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`font-bold ${p.warn ? "text-warning" : "text-success"}`}>{p.value}</span>
                  <Badge color={p.badge}>{p.delta}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function QualityTrendChart() {
  return (
    <svg viewBox="0 0 500 110" className="w-full">
      <line x1="30" y1="10" x2="480" y2="10" stroke="var(--s2)" />
      <line x1="30" y1="40" x2="480" y2="40" stroke="var(--s2)" />
      <line x1="30" y1="70" x2="480" y2="70" stroke="var(--s2)" />
      <line x1="30" y1="100" x2="480" y2="100" stroke="var(--s2)" />
      <path
        d="M40,80 80,72 120,62 160,55 200,48 240,44 280,38 320,34 360,28 400,22 440,18 460,15"
        fill="none"
        stroke="var(--success)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M40,62 80,55 120,48 160,42 200,38 240,32 280,35 320,28 360,22 400,18 440,14 460,10"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="4 3"
      />
    </svg>
  );
}

function VolumeBarChart() {
  const bars = [
    { x: 45, y: 50, h: 50, o: 0.7 },
    { x: 90, y: 35, h: 65, o: 0.7 },
    { x: 135, y: 40, h: 60, o: 0.7 },
    { x: 180, y: 22, h: 78, o: 0.7 },
    { x: 225, y: 28, h: 72, o: 0.7 },
    { x: 270, y: 15, h: 85, o: 0.7 },
    { x: 315, y: 20, h: 80, o: 0.8 },
    { x: 360, y: 8, h: 92, o: 0.9 },
  ];
  return (
    <svg viewBox="0 0 500 120" className="w-full">
      <line x1="30" y1="10" x2="480" y2="10" stroke="var(--s2)" />
      <line x1="30" y1="40" x2="480" y2="40" stroke="var(--s2)" />
      <line x1="30" y1="70" x2="480" y2="70" stroke="var(--s2)" />
      <line x1="30" y1="100" x2="480" y2="100" stroke="var(--s2)" />
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width="30" height={b.h} rx="3" fill="var(--accent)" opacity={b.o} />
      ))}
      {["W1", "W2", "W3", "W4"].map((w, i) => (
        <text key={w} x={55 + i * 45} y="115" fill="var(--t4)" fontSize="8" textAnchor="middle">
          {w}
        </text>
      ))}
    </svg>
  );
}
