import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge, BadgeColor } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const CONNECTED = [
  { name: "Shopify", desc: "Sync catalog images to your Shopify store. 3,420 images synced.", color: "#22C55E", bg: "rgba(34,197,94,0.1)", status: "Connected", badge: "green" as BadgeColor },
  { name: "Amazon SP-API", desc: "Upload product images to Amazon listings. 1,280 images synced.", color: "#F59E0B", bg: "rgba(245,158,11,0.1)", status: "Connected", badge: "green" as BadgeColor },
  { name: "Google Drive", desc: "Auto-backup generated images to cloud storage.", color: "#3B82F6", bg: "rgba(59,130,246,0.1)", status: "Setup needed", badge: "yellow" as BadgeColor },
  { name: "Slack", desc: "Post notifications to #stamp-os channel.", color: "#A855F7", bg: "rgba(168,85,247,0.1)", status: "Connected", badge: "green" as BadgeColor },
];

const AVAILABLE = [
  { name: "Magento / Adobe Commerce", desc: "Push catalog images to Magento product listings", color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
  { name: "Adobe Creative Cloud", desc: "Export directly to Lightroom, Photoshop libraries", color: "#3B82F6", bg: "rgba(59,130,246,0.1)" },
  { name: "Dropbox", desc: "Sync images to team Dropbox folders", color: "#0EA5E9", bg: "rgba(14,165,233,0.1)" },
  { name: "WooCommerce", desc: "WordPress e-commerce image sync", color: "#22C55E", bg: "rgba(34,197,94,0.1)" },
  { name: "Microsoft Teams", desc: "Team notifications via MS Teams channels", color: "#A855F7", bg: "rgba(168,85,247,0.1)" },
  { name: "Nykaa Partner API", desc: "Direct catalog upload to Nykaa marketplace", color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  { name: "Zapier", desc: "Connect STAMP OS with 5,000+ apps", color: "#14B8A6", bg: "rgba(20,184,166,0.1)" },
  { name: "Custom DAM (Bynder, Cloudinary)", desc: "Push images to your digital asset management system", color: "#6366F1", bg: "rgba(99,102,241,0.1)" },
];

export default function IntegrationsPage() {
  return (
    <div>
      <div className="mb-3 text-[11px] text-t3">
        <Link href="/dashboard" className="text-accent">Home</Link> / <Link href="/settings" className="text-accent">Settings</Link> / Integrations
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="text-base font-bold text-t1">Integrations</div>
        <div className="flex gap-0.5 rounded-md border border-glass-border bg-glass p-1">
          <span className="rounded-sm bg-s2 px-3.5 py-1 text-[11.5px] font-semibold text-t1">Connected (4)</span>
          <span className="rounded-sm px-3.5 py-1 text-[11.5px] text-t3">Available (8)</span>
        </div>
      </div>

      <div className="mb-5 grid gap-3 lg:grid-cols-2">
        {CONNECTED.map((i) => (
          <Card key={i.name} className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md" style={{ background: i.bg, color: i.color }}>
              <IntegrationIcon name={i.name} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-bold text-t1">{i.name}</div>
              <div className="text-[10.5px] text-t4">{i.desc}</div>
            </div>
            <Badge color={i.badge}>{i.status}</Badge>
          </Card>
        ))}
      </div>

      <div className="mb-3 text-[13px] font-extrabold text-t1">Available integrations</div>
      <div className="grid gap-3 lg:grid-cols-2">
        {AVAILABLE.map((i) => (
          <Card key={i.name} className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md" style={{ background: i.bg, color: i.color }}>
              <IntegrationIcon name={i.name} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-bold text-t1">{i.name}</div>
              <div className="text-[10.5px] text-t4">{i.desc}</div>
            </div>
            <Button size="sm">Connect</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function IntegrationIcon({ name }: { name: string }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none" as const, stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name.includes("Shopify") || name.includes("Amazon") || name.includes("Magento") || name.includes("WooCommerce") || name.includes("Nykaa")) {
    return (
      <svg {...common}>
        <path d="M3 9l1.5-5h15L21 9" />
        <path d="M3 9c0 1.5 1.2 3 3 3s3-1.5 3-3" />
        <path d="M9 9c0 1.5 1.2 3 3 3s3-1.5 3-3" />
        <path d="M15 9c0 1.5 1.2 3 3 3s3-1.5 3-3" />
        <rect x="3" y="12" width="18" height="9" />
      </svg>
    );
  }
  if (name.includes("Drive") || name.includes("Dropbox")) {
    return (
      <svg {...common}>
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2Z" />
      </svg>
    );
  }
  if (name.includes("Slack") || name.includes("Zapier")) {
    return (
      <svg {...common}>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    );
  }
  if (name.includes("Teams")) {
    return (
      <svg {...common}>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z" />
        <polyline points="22 6 12 13 2 6" />
      </svg>
    );
  }
  if (name.includes("DAM")) {
    return (
      <svg {...common}>
        <rect x="2" y="3" width="20" height="18" rx="3" />
        <path d="m6 9 3 3-3 3" />
        <line x1="12" y1="15" x2="16" y2="15" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}
