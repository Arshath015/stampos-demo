"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ToggleChip } from "@/components/ui/ToggleChip";
import { ImageResultGrid } from "@/components/ui/ImageResultGrid";
import { brand, brandUnderstanding, categoryTraining, trainingTier } from "@/lib/mock-data";
import type { ResultImage } from "@/lib/results";

const GALLERY_STATUSES = ["approved", "approved", "pending", "approved", "approved", "rejected"] as const;

export function BrandClient({
  resultsFoundation,
  resultsLipstick,
}: {
  resultsFoundation: ResultImage[];
  resultsLipstick: ResultImage[];
}) {
  const [tab, setTab] = useState<"identity" | "training">("identity");

  const pool = [...resultsFoundation, ...resultsLipstick];
  const gallery = GALLERY_STATUSES.map((status, i) => ({
    id: `gallery-${i}`,
    src: pool.length > 0 ? pool[i % pool.length].src : "",
    status,
  })).filter((img) => img.src);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-lg text-lg font-black text-white"
            style={{ background: "linear-gradient(135deg,#3B82F6,#1D4ED8)" }}
          >
            SC
          </div>
          <div>
            <div className="text-lg font-extrabold text-t1">{brand.name}</div>
            <div className="text-[10.5px] text-t4">
              {brand.plan} · Created {brand.created}
            </div>
          </div>
        </div>
        <Link href="/generate">
          <Button variant="primary">Generate images</Button>
        </Link>
      </div>

      <Card className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[12.5px] font-bold text-t1">Brand Understanding</span>
          <span className="text-[22px] font-black text-accent-h">{brandUnderstanding.overall}%</span>
        </div>
        <div className="mb-2 h-2 overflow-hidden rounded-full bg-s2">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-info"
            style={{ width: `${brandUnderstanding.overall}%` }}
          />
        </div>
        <div className="flex justify-between text-[10.5px] text-t4">
          <span>
            Identity: {brandUnderstanding.identity}% ({brandUnderstanding.identityWeight}% weight)
          </span>
          <span>
            Category Training: {brandUnderstanding.categoryTrainingScore}% ({brandUnderstanding.categoryTrainingWeight}% weight)
          </span>
        </div>
      </Card>

      <div className="mb-4 flex w-fit gap-0.5 rounded-md border border-glass-border bg-glass p-1">
        {(["identity", "training"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-sm px-3.5 py-1 text-[11.5px] font-medium transition-colors ${
              tab === t ? "bg-s2 font-semibold text-t1" : "text-t3"
            }`}
          >
            {t === "identity" ? "Brand Identity" : "Category Training"}
          </button>
        ))}
      </div>

      {tab === "identity" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader title="Brand Profile" />
            <Field label="Brand Name" defaultValue={brand.name} />
            <Field label="Tagline" defaultValue={brand.tagline} />
            <div className="mb-3.5 flex flex-col gap-1">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-t3">
                Brand Personality
              </label>
              <textarea
                defaultValue={brand.personality}
                rows={4}
                className="w-full resize-none rounded-md border border-border bg-s2 px-3 py-2 text-xs text-t1 outline-none focus:border-accent"
              />
            </div>
          </Card>
          <Card>
            <CardHeader title="Target Audience" />
            <div className="mb-3.5 grid grid-cols-2 gap-3">
              <Select label="Age Range" defaultValue={brand.ageRange} options={["22 – 35", "18 – 25", "25 – 40", "35 – 50"]} />
              <Select label="Gender" defaultValue={brand.gender} options={["Unisex", "Men", "Women"]} />
            </div>
            <ChipField label="Market Positioning" options={brand.positioning} selected={brand.positioningSelected} />
            <ChipField label="Aesthetic Keywords" options={brand.aesthetic} selected={brand.aestheticSelected} />
          </Card>
          <div className="lg:col-span-2 lg:flex lg:justify-end">
            <Button variant="primary">Save Brand Identity</Button>
          </div>
        </div>
      ) : (
        <>
          <Card className="mb-4">
            <CardHeader title="Category training scores" action={<Button size="sm">Manage training</Button>} />
            <div className="flex flex-col gap-3">
              {categoryTraining.map((row) => {
                const tier = trainingTier(row.score);
                const tone =
                  row.score >= 80
                    ? "var(--success)"
                    : row.score >= 60
                      ? "var(--info)"
                      : row.score >= 40
                        ? "var(--warning)"
                        : "var(--danger)";
                return (
                  <div key={row.name} className="flex items-center gap-3 rounded-md bg-glass px-3 py-2.5">
                    <div className="flex flex-1 items-center gap-2.5">
                      <span className="w-40 shrink-0 truncate text-xs font-bold text-t1">{row.name}</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-s2">
                        <div className="h-full rounded-full" style={{ width: `${row.score}%`, background: tone }} />
                      </div>
                    </div>
                    <span className="w-8 text-right text-[13px] font-extrabold" style={{ color: tone }}>
                      {row.score}
                    </span>
                    <Badge color={tier.badge}>{tier.label}</Badge>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 rounded-md border border-warning-sub bg-warning-sub px-3 py-2 text-[11px] text-warning">
              2 categories below threshold (40). Upload more references to enable generation.
            </div>
          </Card>

          <div className="mb-4 flex w-fit gap-0.5 rounded-md border border-glass-border bg-glass p-1">
            {["Gallery", "Style guide", "Activity", "Settings"].map((t, i) => (
              <span
                key={t}
                className={`rounded-sm px-3.5 py-1 text-[11.5px] font-medium ${
                  i === 0 ? "bg-s2 font-semibold text-t1" : "text-t3"
                }`}
              >
                {t}
              </span>
            ))}
          </div>
          <ImageResultGrid images={gallery} columns={6} />
        </>
      )}

      <Card className="mt-4 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-t1">Need multiple brands?</div>
          <div className="text-[10.5px] text-t4">
            Upgrade to Team for up to 5 brands with review workflows.
          </div>
        </div>
        <Link href="/billing">
          <Button size="sm">Upgrade to Team</Button>
        </Link>
      </Card>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <div className="mb-3.5 flex flex-col gap-1">
      <label className="text-[11px] font-semibold uppercase tracking-wide text-t3">{label}</label>
      <input
        defaultValue={defaultValue}
        className="w-full rounded-md border border-border bg-s2 px-3 py-2 text-xs text-t1 outline-none focus:border-accent"
      />
    </div>
  );
}

function Select({ label, defaultValue, options }: { label: string; defaultValue: string; options: string[] }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-semibold uppercase tracking-wide text-t3">{label}</label>
      <select
        defaultValue={defaultValue}
        className="w-full rounded-md border border-border bg-s2 px-3 py-2 text-xs text-t1 outline-none focus:border-accent"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function ChipField({ label, options, selected }: { label: string; options: string[]; selected: string[] }) {
  return (
    <div className="mb-3.5">
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-t3">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <ToggleChip key={o} label={o} defaultSelected={selected.includes(o)} />
        ))}
      </div>
    </div>
  );
}
