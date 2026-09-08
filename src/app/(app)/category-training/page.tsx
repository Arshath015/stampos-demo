import { Card, CardHeader } from "@/components/ui/Card";
import { Badge, BadgeColor } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TrainingUploadCard } from "@/components/category-training/TrainingUploadCard";

const SEGMENTS = [
  { name: "AOF Dewy Foundation", meta: "22 refs · 3 cycles", score: 92, tier: "Excellent", badge: "green" as BadgeColor, tone: "var(--success)" },
  { name: "Ultrastay Lipstick", meta: "18 refs · 3 cycles", score: 78, tier: "Good", badge: "blue" as BadgeColor, tone: "var(--info)" },
  { name: "Ultrastay Lipstick", meta: "14 refs · 2 cycles", score: 65, tier: "Good", badge: "blue" as BadgeColor, tone: "var(--info)" },
  { name: "Eyeshadow Palette", meta: "12 refs · 2 cycles", score: 45, tier: "Basic", badge: "yellow" as BadgeColor, tone: "var(--warning)" },
  { name: "Eyes & Brows — Mascara", meta: "8 refs · 1 cycle", score: 28, tier: "Not ready", badge: "red" as BadgeColor, tone: "var(--danger)" },
  { name: "Tools & Skincare — Brushes", meta: "6 refs · 1 cycle", score: 15, tier: "Not ready", badge: "red" as BadgeColor, tone: "var(--danger)" },
];

const FOUNDATION_BREAKDOWN = [
  { label: "Color accuracy", value: 94 },
  { label: "Pose consistency", value: 91 },
  { label: "Background match", value: 88 },
  { label: "Product detail", value: 93 },
];

const EYESHADOW_BREAKDOWN = [
  { label: "Color accuracy", value: 52 },
  { label: "Pose consistency", value: 48 },
  { label: "Drape accuracy", value: 38 },
  { label: "Pattern detail", value: 42 },
];

export default function CategoryTrainingPage() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-extrabold text-t1">Brand Training</span>
          <Badge color="blue">SUGAR Cosmetics</Badge>
        </div>
        <div className="flex gap-2">
          <Button>Retrain all</Button>
          <Button variant="primary">Bulk upload</Button>
        </div>
      </div>

      <TrainingUploadCard />

      <Card className="mb-4 border-success bg-success-sub">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-success">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Auto-classification complete
          </div>
          <Button size="sm">Review &amp; correct</Button>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-t2">
          <b>87 images sorted</b> — 22 AOF Dewy Foundation, 18 Ultrastay Lipstick, 14 Ultrastay Lipstick, 12 Eyeshadow Palette,
          8 Mascara, 6 Makeup Brushes, <span className="text-warning">5 unclassified</span>,{" "}
          <span className="text-danger">2 rejected (low quality)</span>
        </p>
      </Card>

      <div className="mb-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <div className="rounded-lg border border-glass-border bg-glass p-4">
          <div className="mb-1.5 text-[11px] text-t3">Overall Score</div>
          <div className="flex items-center gap-3">
            <div
              className="relative flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: "conic-gradient(var(--accent) calc(72*1%), var(--s2) 0)" }}
            >
              <div className="absolute inset-1 rounded-full bg-s0" />
              <span className="relative text-sm font-black text-t1">72</span>
            </div>
            <div className="text-[10px] text-t3">
              Good
              <br />
              <span className="font-semibold text-success">+6</span> this week
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-glass-border bg-glass p-4">
          <div className="mb-1 text-[11px] text-t3">Total references</div>
          <div className="text-[22px] font-black text-t1">87</div>
          <div className="text-[11px] text-t4">across 6 segments</div>
        </div>
        <div className="rounded-lg border border-glass-border bg-glass p-4">
          <div className="mb-1 text-[11px] text-t3">Training cycles</div>
          <div className="text-[22px] font-black text-accent-h">8</div>
          <div className="text-[11px] text-t4">Last: 1h ago</div>
        </div>
        <div className="rounded-lg border border-glass-border bg-glass p-4">
          <div className="mb-1 text-[11px] text-t3">Avg approval</div>
          <div className="text-[22px] font-black text-success">81%</div>
          <div className="text-[11px] text-t4">
            <span className="font-semibold text-success">+3%</span> vs baseline
          </div>
        </div>
      </div>

      <Card className="mb-4">
        <CardHeader title="Per-category training scores" />
        <div className="flex flex-col gap-0.5">
          {SEGMENTS.map((s, i) => (
            <div
              key={`${s.name}-${i}`}
              className="flex items-center justify-between rounded-md bg-glass p-3"
              style={{ borderLeft: `3px solid ${s.tone}` }}
            >
              <div className="flex flex-1 items-center gap-3">
                <div className="min-w-[160px]">
                  <div className="text-xs font-bold text-t1">{s.name}</div>
                  <div className="text-[9px] text-t4">{s.meta}</div>
                </div>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-s2">
                  <div className="h-full rounded-full" style={{ width: `${s.score}%`, background: s.tone }} />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black" style={{ color: s.tone }}>{s.score}</span>
                <Badge color={s.badge}>{s.tier}</Badge>
                <Button size="sm">Add refs</Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-md bg-warning-sub px-2.5 py-2.5 text-[11px] text-warning">
          2 categories below 40 — generation disabled. Upload 15+ more references per category to enable.
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="AOF Dewy Foundation — Quality breakdown" action={<Badge color="green">Score: 92</Badge>} />
          <div className="flex flex-col gap-2.5 text-xs">
            {FOUNDATION_BREAKDOWN.map((b) => (
              <div key={b.label}>
                <div className="flex justify-between">
                  <span className="text-t2">{b.label}</span>
                  <span className="font-bold text-success">{b.value}%</span>
                </div>
                <div className="mt-1 h-[5px] overflow-hidden rounded-full bg-s2">
                  <div className="h-full rounded-full bg-success" style={{ width: `${b.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="Eyeshadow Palette — Quality breakdown" action={<Badge color="yellow">Score: 45</Badge>} />
          <div className="flex flex-col gap-2.5 text-xs">
            {EYESHADOW_BREAKDOWN.map((b) => (
              <div key={b.label}>
                <div className="flex justify-between">
                  <span className="text-t2">{b.label}</span>
                  <span className="font-bold" style={{ color: b.value < 40 ? "var(--danger)" : "var(--warning)" }}>{b.value}%</span>
                </div>
                <div className="mt-1 h-[5px] overflow-hidden rounded-full bg-s2">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${b.value}%`, background: b.value < 40 ? "var(--danger)" : "var(--warning)" }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3.5 rounded-md bg-warning-sub px-2.5 py-2.5 text-[11px] text-warning">
            Upload 20+ high-quality ethnic wear references to improve scores.
          </div>
        </Card>
      </div>
    </div>
  );
}
