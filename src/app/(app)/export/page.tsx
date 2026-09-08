import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const EXPORT_HISTORY = [
  { name: "SUGAR SS26 — Full catalog", meta: "3,420 images · JPEG 2048px · 6.8 GB · Apr 28" },
  { name: "GlowCo Skin Tint — Batch #398", meta: "256 images · PNG 4096px · 1.2 GB · Apr 22" },
  { name: "SUGAR Cosmetics Trending — April collection", meta: "512 images · WebP 2048px · 0.4 GB · Apr 18" },
];

export default function ExportPage() {
  return (
    <div>
      <div className="mb-3 text-[11px] text-t3">
        <Link href="/dashboard" className="text-accent">Home</Link> / Export Center
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="text-base font-bold text-t1">Export Center</div>
        <div className="flex gap-2">
          <Button title="Pre-configured export settings for Nykaa, SUGAR, Amazon, Flipkart">Marketplace presets</Button>
          <Button variant="primary">New export</Button>
        </div>
      </div>

      <Card
        className="mb-4"
        style={{ borderColor: "rgba(34,197,94,0.15)", background: "linear-gradient(135deg,rgba(34,197,94,0.04),transparent)" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-success-sub text-success">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-bold text-t1">Compliance auto-check</div>
              <div className="text-[10.5px] text-t4">All 847 images pass marketplace specs. 12 images need minor resizing for Flipkart.</div>
            </div>
          </div>
          <Button size="sm">View report</Button>
        </div>
      </Card>

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Export settings" />
          <div className="flex flex-col gap-3.5 text-xs">
            <Field label="Image format" options={["PNG (lossless)", "JPEG (optimized)", "WebP (smallest)", "TIFF (print-ready)"]} defaultIndex={1} />
            <Field label="Resolution" options={["1024 x 1024 (web)", "2048 x 2048 (standard)", "4096 x 4096 (high-res)", "Custom"]} defaultIndex={1} />
            <Field label="Background" options={["As generated", "White (#FFFFFF)", "Transparent (PNG only)", "Custom color"]} />
            <Field label="File naming" options={["{brand}_{sku}_{variant}", "{sku}_{date}_{seq}", "{brand}/{category}/{sku}", "Custom pattern"]} />
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-t3">Quality</label>
              <div className="flex items-center gap-2.5">
                <input type="range" defaultValue={85} className="flex-1 accent-accent" />
                <span className="font-bold text-t1">85%</span>
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <CardHeader title="Quick export" />
          <div className="flex flex-col gap-2.5">
            <QuickExportRow title="Export all approved images" desc="12,847 images · Estimated: 24.6 GB" primary />
            <QuickExportRow title="Export by brand" desc="Select specific brands to export" cta="Select" />
            <QuickExportRow title="Export batch results" desc="Download output from a specific batch" cta="Select" />
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Export history" />
        <div className="flex flex-col">
          {EXPORT_HISTORY.map((h, i) => (
            <div key={h.name} className={`flex items-center justify-between py-2.5 ${i < EXPORT_HISTORY.length - 1 ? "border-b border-border" : ""}`}>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[rgba(34,197,94,0.1)] text-success">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-t1">{h.name}</div>
                  <div className="text-[10.5px] text-t4">{h.meta}</div>
                </div>
              </div>
              <Button size="sm">Re-download</Button>
            </div>
          ))}
        </div>
      </Card>

      <div
        className="mt-4 flex items-center justify-between rounded-lg px-5 py-3.5"
        style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.06),rgba(139,92,246,0.02))", border: "1px solid rgba(139,92,246,0.15)" }}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[rgba(139,92,246,0.1)] text-[#7C3AED]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <div>
            <div className="text-xs font-bold text-t1">What&apos;s next?</div>
            <div className="text-[11px] text-t3">Generate another batch or return to your dashboard</div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/generate">
            <Button variant="primary" size="sm">New Generation</Button>
          </Link>
          <Link href="/dashboard">
            <Button size="sm">Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Field({ label, options, defaultIndex = 0 }: { label: string; options: string[]; defaultIndex?: number }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-semibold uppercase tracking-wide text-t3">{label}</label>
      <select defaultValue={options[defaultIndex]} className="rounded-md border border-border bg-s2 px-2.5 py-1.5 text-[11px] text-t1">
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function QuickExportRow({ title, desc, primary, cta }: { title: string; desc: string; primary?: boolean; cta?: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-glass-border bg-glass p-3.5 transition-colors hover:border-accent">
      <div>
        <div className="text-xs font-bold text-t1">{title}</div>
        <div className="mt-0.5 text-[10.5px] text-t4">{desc}</div>
      </div>
      <Button variant={primary ? "primary" : "default"} size="sm">
        {primary ? "Export" : cta}
      </Button>
    </div>
  );
}
