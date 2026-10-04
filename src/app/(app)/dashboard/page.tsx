import Link from "next/link";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ImageResultGrid } from "@/components/ui/ImageResultGrid";
import { dashboardStats, costSavings } from "@/lib/mock-data";
import { getResultImages } from "@/lib/results";

// Re-scan public/images/results/** on every request (not just at build time)
// so dropping in new AI output files works in production without a rebuild.
export const dynamic = "force-dynamic";

// Cycled onto the real results pool below in display order — length must
// match (or be shorter than) however many recent generations are shown.
const RECENT_STATUSES = ["approved", "approved", "pending", "ai-enhanced", "approved", "pending"] as const;

const gauges = [
  { label: "Brand", value: 82, color: "var(--success)" },
  { label: "Quality", value: 72, color: "var(--accent)" },
  { label: "Approval", value: 84, color: "var(--success)" },
];

export default function DashboardPage() {
  // "Recent generations" must show real AI output, never the raw uploaded
  // product reference photo — cycle through the full results pool (all
  // foundation + lipstick shot-types) rather than a single repeated image.
  // Title/meta are built from each image's own real shade + shot type
  // rather than a separately-authored list, so the caption can never claim
  // a different product than the thumbnail actually shows.
  const resultsPool = [
    ...getResultImages("foundation").map((r) => ({ ...r, product: "AOF Dewy Foundation" })),
    ...getResultImages("lipstick").map((r) => ({ ...r, product: "Ultrastay Transferproof Lipstick" })),
  ];
  const recentGenerations = RECENT_STATUSES.map((status, i) => {
    const img = resultsPool.length > 0 ? resultsPool[i % resultsPool.length] : null;
    if (!img) return null;
    return {
      id: `recent-${i}`,
      src: img.src,
      status,
      confidence: img.confidence,
      title: `${img.product} — Shade ${img.shade}`,
      meta: `${img.shotType} · ${img.confidence}% confidence`,
    };
  }).filter((img) => img !== null);

  return (
    <div>
      <div className="mb-5 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <StatCard
          label="Images generated"
          value={dashboardStats.imagesGenerated.value}
          delta={dashboardStats.imagesGenerated.delta}
          sub={dashboardStats.imagesGenerated.sub}
          icon={<CameraIcon />}
          iconBg="var(--accent-sub)"
          iconColor="var(--accent-h)"
        />
        <StatCard
          label="First-pass approval"
          value={dashboardStats.approvalRate.value}
          decimals={1}
          suffix="%"
          delta={dashboardStats.approvalRate.delta}
          sub={dashboardStats.approvalRate.sub}
          icon={<CheckIcon />}
          iconBg="var(--success-sub)"
          iconColor="var(--success)"
        />
        <StatCard
          label="Active brands"
          value={dashboardStats.activeBrands.value}
          sub={dashboardStats.activeBrands.sub}
          icon={<StoreIcon />}
          iconBg="var(--info-sub)"
          iconColor="var(--info)"
        />
        <StatCard
          label="Review backlog"
          value={dashboardStats.reviewBacklog.value}
          delta={dashboardStats.reviewBacklog.delta}
          deltaDirection="down"
          sub={dashboardStats.reviewBacklog.sub}
          icon={<HourglassIcon />}
          iconBg="var(--warning-sub)"
          iconColor="var(--warning)"
        />
      </div>

      <Card className="mb-4">
        <CardHeader
          title="Recent generations"
          action={
            <div className="flex gap-1.5">
              {["All", "Approved", "Pending"].map((f, i) => (
                <span
                  key={f}
                  className={`rounded-full border px-3 py-1 text-[11px] font-medium ${
                    i === 0 ? "border-gold bg-gold-sub text-gold" : "border-border text-t3"
                  }`}
                >
                  {f}
                </span>
              ))}
            </div>
          }
        />
        <ImageResultGrid images={recentGenerations} columns={6} />
      </Card>

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Generation volume" action={<Badge color="blue">30 days</Badge>} />
          <VolumeChart />
        </Card>
        <Card>
          <CardHeader title="Quality & brand scores" action={<Badge color="green">Trending up</Badge>} />
          <div className="flex justify-around py-2">
            {gauges.map((g) => (
              <Gauge key={g.label} {...g} />
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader title="AI recommendations" action={<Badge color="purple">3 actions</Badge>} />
          <ul className="flex flex-col gap-3 text-[11.5px] text-t2">
            <Rec dot="danger">
              Add 15+ refs for <b>Eyeshadow Palette</b> — 45% approval
            </Rec>
            <Rec dot="warning">
              Try <b>Rose-Gold backdrop</b> for Lipstick — 12% higher
            </Rec>
            <Rec dot="warning">
              Schedule <b>Makeup Brushes</b> re-training — 15%
            </Rec>
          </ul>
        </Card>

        <Card>
          <CardHeader
            title="Active collections"
            action={
              <Link href="/categories" className="text-[11px] text-accent-h hover:underline">
                View all
              </Link>
            }
          />
          <div className="flex flex-col gap-3">
            <CollectionRow name="SS26 Face Makeup" meta="SUGAR · 340 SKUs" days="18d" safe segments={[65, 15, 10]} />
            <CollectionRow name="Diwali Drop 2026" meta="SUGAR · 180 SKUs" days="6d" segments={[40, 20, 25]} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Cost savings" action={<Badge color="green">{costSavings.savedPct} saved</Badge>} />
          <div className="py-2 text-center">
            <div className="text-[32px] font-black tracking-[-1px] text-success">{costSavings.saved}</div>
            <div className="mt-1 text-[11px] text-t4">saved vs traditional photography</div>
            <div className="mt-3.5 flex justify-center gap-5 text-[11px]">
              <div>
                <span className="text-t4">Traditional</span>
                <div className="mt-0.5 text-sm font-bold text-danger line-through">{costSavings.traditional}</div>
              </div>
              <div>
                <span className="text-t4">STAMP OS</span>
                <div className="mt-0.5 text-sm font-bold text-success">{costSavings.stampOs}</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Rec({ dot, children }: { dot: "danger" | "warning"; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span
        className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
          dot === "danger" ? "bg-danger" : "bg-warning"
        }`}
      />
      <span>{children}</span>
    </li>
  );
}

function CollectionRow({
  name,
  meta,
  days,
  safe,
  segments,
}: {
  name: string;
  meta: string;
  days: string;
  safe?: boolean;
  segments: number[];
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-semibold text-t1">{name}</span>
        <Badge color={safe ? "green" : "yellow"}>{days}</Badge>
      </div>
      <div className="mb-1.5 text-[10.5px] text-t4">{meta}</div>
      <div className="flex h-[3px] gap-px overflow-hidden rounded-sm bg-s2">
        <div className="rounded-sm bg-success" style={{ width: `${segments[0]}%` }} />
        <div className="rounded-sm bg-accent" style={{ width: `${segments[1]}%` }} />
        {segments[2] !== undefined && (
          <div className="rounded-sm bg-warning" style={{ width: `${segments[2]}%` }} />
        )}
      </div>
    </div>
  );
}

function Gauge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full"
        style={{ background: `conic-gradient(${color} calc(${value}*1%), var(--s2) 0)` }}
      >
        <div className="absolute inset-1 rounded-full bg-s0" />
        <span className="relative text-base font-black tracking-tight text-t1">{value}</span>
      </div>
      <span className="mt-1 text-[10px] font-medium text-t4">{label}</span>
    </div>
  );
}

function VolumeChart() {
  const linePath =
    "M55,80 C75,74 100,68 130,70 C160,73 180,56 210,46 C240,36 270,41 300,34 C330,26 360,32 390,22 C420,12 450,15 480,8";
  const areaPath = `${linePath} L480,100 L55,100 Z`;
  return (
    <svg viewBox="0 0 520 130" className="w-full">
      <defs>
        <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="40" y1="10" x2="490" y2="10" stroke="var(--s2)" strokeWidth="1" />
      <line x1="40" y1="40" x2="490" y2="40" stroke="var(--s2)" strokeWidth="1" />
      <line x1="40" y1="70" x2="490" y2="70" stroke="var(--s2)" strokeWidth="1" />
      <line x1="40" y1="100" x2="490" y2="100" stroke="var(--s2)" strokeWidth="1" />
      <text x="8" y="14" fill="var(--t4)" fontSize="8.5">600</text>
      <text x="8" y="44" fill="var(--t4)" fontSize="8.5">400</text>
      <text x="8" y="74" fill="var(--t4)" fontSize="8.5">200</text>
      <text x="16" y="104" fill="var(--t4)" fontSize="8.5">0</text>
      <path d={linePath} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
      <path d={areaPath} fill="url(#volGrad)" />
      <circle cx="480" cy="8" r="4" fill="var(--accent)" />
      <circle cx="480" cy="8" r="2" fill="var(--s0)" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z" />
      <circle cx="12" cy="13" r="4" />
      <path d="M19 2l1 1.5 1.5 1-1.5 1L19 7l-1-1.5L16.5 4.5 18 3.5z" strokeWidth="1" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12l2 2 4-4" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}
function StoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l1.5-5h15L21 9" />
      <path d="M3 9c0 1.5 1.2 3 3 3s3-1.5 3-3" />
      <path d="M9 9c0 1.5 1.2 3 3 3s3-1.5 3-3" />
      <path d="M15 9c0 1.5 1.2 3 3 3s3-1.5 3-3" />
      <rect x="3" y="12" width="18" height="9" />
    </svg>
  );
}
function HourglassIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2h12" />
      <path d="M6 22h12" />
      <path d="M7 2v4c0 2.5 2 4.5 5 6-3 1.5-5 3.5-5 6v4" />
      <path d="M17 2v4c0 2.5-2 4.5-5 6 3 1.5 5 3.5 5 6v4" />
    </svg>
  );
}
