import Link from "next/link";
import { Card } from "@/components/ui/Card";

const EVENTS = [
  { time: "12 min ago", color: "var(--accent)", body: <><strong>Batch #413</strong> completed — 48 images generated for SUGAR SS26 Lip Edit</>, meta: "System · Generation" },
  { time: "28 min ago", color: "var(--success)", body: <><strong>Aisha Rao</strong> approved 12 images from Batch #410</>, meta: "Review · Approval" },
  { time: "1h ago", color: "var(--danger)", body: <><strong>Kavya Desai</strong> rejected 2 images from Batch #409 — reason: background inconsistency</>, meta: "Review · Rejection" },
  { time: "2h ago", color: "var(--accent)", body: <><strong>Arjun Joshi</strong> started Batch #414 — 32 SKUs for GlowCo Skin Tint</>, meta: "Generation · Batch created" },
  { time: "3h ago", color: "var(--warning)", body: <><strong>System</strong> flagged low approval rate: Ethnic category dropped to 58%</>, meta: "System · Alert" },
  { time: "5h ago", color: "#A855F7", body: <><strong>Meera Sharma</strong> updated brand settings for FabIndia — quality threshold changed to 85%</>, meta: "Settings · Brand configuration" },
  { time: "6h ago", color: "var(--success)", body: <><strong>Vikram Kumar</strong> completed review of 24 images — 22 approved, 2 rejected</>, meta: "Review · Batch review" },
  { time: "Yesterday", color: "#14B8A6", body: <><strong>Ravi Nair</strong> rotated API key: Production key regenerated</>, meta: "API · Key management" },
  { time: "Yesterday", color: "#A855F7", body: <><strong>Meera Sharma</strong> invited <strong>Priya Singh</strong> as Creator</>, meta: "Team · Invitation sent" },
  { time: "2 days ago", color: "var(--accent)", body: <><strong>System</strong> completed brand model retrain: GlowCo v3.2 — accuracy improved 4.2%</>, meta: "AI Engine · Model training" },
  { time: "2 days ago", color: "var(--success)", body: <><strong>Deepak Patel</strong> uploaded 48 reference images for SUGAR Cosmetics brand training</>, meta: "Brand · Training data" },
  { time: "3 days ago", color: "var(--warning)", body: <><strong>System</strong> webhook delivery failed: api.ajio.com/hooks/stamp-error — retried successfully</>, meta: "API · Webhook" },
];

export default function ActivityPage() {
  return (
    <div>
      <div className="mb-3 text-[11px] text-t3">
        <Link href="/dashboard" className="text-accent">Home</Link> / Activity Log
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="text-base font-bold text-t1">Activity Log</div>
        <div className="flex items-center gap-2">
          <select className="rounded-md border border-border bg-glass px-2.5 py-1.5 text-[11px] text-t2">
            <option>All activity</option>
            <option>Generations</option>
            <option>Reviews</option>
            <option>Team changes</option>
            <option>Settings</option>
            <option>API</option>
          </select>
          <button className="flex items-center gap-1.5 rounded-md border border-border bg-glass px-3 py-1.5 text-xs font-semibold text-t2">
            Export log
          </button>
        </div>
      </div>

      <Card>
        <div className="flex flex-col">
          {EVENTS.map((e, i) => (
            <div key={i} className="flex items-start gap-3 border-b border-border py-3 last:border-none">
              <span className="min-w-[70px] shrink-0 whitespace-nowrap text-[10px] text-t4">{e.time}</span>
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: e.color }} />
              <div className="flex-1 text-xs text-t2">
                {e.body}
                <div className="mt-0.5 text-[10px] text-t4">{e.meta}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
