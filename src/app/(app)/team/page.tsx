import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge, BadgeColor } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const STATS = [
  { value: "8", label: "Active members" },
  { value: "10", label: "Total seats" },
  { value: "2", label: "Pending invites" },
  { value: "2", label: "Seats available" },
];

const MEMBERS: { name: string; email: string; initials: string; grad: string; role: string; badge: BadgeColor | "custom"; customColor?: string; lastActive: string; isYou?: boolean }[] = [
  { name: "Meera Sharma", email: "meera@ajio.com", initials: "MS", grad: "from-[#6366F1] to-[#8B5CF6]", role: "Org Admin", badge: "purple", lastActive: "Now", isYou: true },
  { name: "Aisha Rao", email: "aisha@ajio.com", initials: "AR", grad: "from-[#F59E0B] to-[#D97706]", role: "Reviewer L1", badge: "green", lastActive: "2h ago" },
  { name: "Vikram Kumar", email: "vikram@ajio.com", initials: "VK", grad: "from-[#10B981] to-[#059669]", role: "Reviewer L1", badge: "green", lastActive: "5h ago" },
  { name: "Priya Singh", email: "priya@ajio.com", initials: "PS", grad: "from-[#EC4899] to-[#DB2777]", role: "Creator", badge: "blue", lastActive: "1d ago" },
  { name: "Arjun Joshi", email: "arjun@ajio.com", initials: "AJ", grad: "from-[#3B82F6] to-[#2563EB]", role: "Creator", badge: "blue", lastActive: "3h ago" },
  { name: "Kavya Desai", email: "kavya@ajio.com", initials: "KD", grad: "from-[#EF4444] to-[#DC2626]", role: "Approver L2", badge: "custom", customColor: "#EF4444", lastActive: "1h ago" },
  { name: "Deepak Patel", email: "deepak@ajio.com", initials: "DP", grad: "from-[#14B8A6] to-[#0D9488]", role: "Brand Manager", badge: "yellow", lastActive: "6h ago" },
  { name: "Ravi Nair", email: "ravi@ajio.com", initials: "RN", grad: "from-[#7C3AED] to-[#6D28D9]", role: "API Manager", badge: "custom", customColor: "#14B8A6", lastActive: "2d ago" },
];

export default function TeamPage() {
  return (
    <div>
      <div className="mb-3 text-[11px] text-t3">
        <Link href="/dashboard" className="text-accent">Home</Link> / <Link href="/settings" className="text-accent">Settings</Link> / Team
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="text-base font-bold text-t1">Team Management</div>
        <div className="flex gap-2">
          <Button title="Copy shareable invite link">Invite link</Button>
          <Button>Export</Button>
          <Button variant="primary">Invite member</Button>
        </div>
      </div>

      <Card
        className="mb-4"
        style={{ borderColor: "rgba(59,130,246,0.12)", background: "linear-gradient(135deg,rgba(59,130,246,0.04),transparent)" }}
      >
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-t1">Domain auto-join enabled</span>
            <span className="ml-2 text-t4">Anyone with @ajio.com can join as Creator</span>
          </div>
          <div className="flex items-center gap-1.5">
            <code className="rounded bg-s2 px-2 py-1 text-[10px] text-t3">stampos.app/join/ajio-f8k2</code>
            <Button size="sm">Copy</Button>
            <Button size="sm">Settings</Button>
          </div>
        </div>
      </Card>

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-glass p-4 transition-colors hover:border-accent">
            <div className="text-[28px] font-black text-t1">{s.value}</div>
            <div className="mt-1 text-[11px] text-t4">{s.label}</div>
          </div>
        ))}
      </div>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex gap-0.5 rounded-md border border-glass-border bg-glass p-1">
            {["Active (8)", "Pending (2)", "Deactivated (1)"].map((t, i) => (
              <span key={t} className={`rounded-sm px-3.5 py-1 text-[11.5px] font-medium ${i === 0 ? "bg-s2 font-semibold text-t1" : "text-t3"}`}>
                {t}
              </span>
            ))}
          </div>
          <input placeholder="Search members..." className="w-52 rounded-md border border-border bg-s2 px-2.5 py-1.5 text-[11px] text-t1" />
        </div>

        <div className="grid grid-cols-[40px_1fr_140px_100px_80px] gap-3 border-b-2 border-border pb-2 text-[10px] font-bold uppercase tracking-wide text-t4">
          <div />
          <div>Member</div>
          <div>Role</div>
          <div>Last active</div>
          <div>Actions</div>
        </div>
        {MEMBERS.map((m) => (
          <div key={m.email} className="grid grid-cols-[40px_1fr_140px_100px_80px] items-center gap-3 border-b border-border py-2.5 text-xs last:border-none">
            <div className={`flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br ${m.grad} text-[9px] font-extrabold text-white`}>
              {m.initials}
            </div>
            <div>
              <div className="font-bold text-t1">{m.name}</div>
              <div className="text-[10px] text-t4">{m.email}</div>
            </div>
            <div>
              {m.badge === "custom" ? (
                <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: `${m.customColor}1f`, color: m.customColor }}>
                  {m.role}
                </span>
              ) : (
                <Badge color={m.badge}>{m.role}</Badge>
              )}
            </div>
            <div className="text-t3">{m.lastActive}</div>
            <div className="text-[10px] text-t4">{m.isYou ? "You" : <Button size="sm">⋯</Button>}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}
