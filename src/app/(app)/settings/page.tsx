"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const TABS = ["General", "Team", "AI Engine", "Integrations", "Security", "Notifications"];

const PRODUCTIVITY = [
  { name: "Meera Sharma", stat: "340 uploads, 95% approved" },
  { name: "Aisha Rao", stat: "120 reviews, 12m avg" },
  { name: "Vikram Kumar", stat: "89 reviews, 8m avg" },
  { name: "Priya Singh", stat: "210 uploads, 88% approved" },
  { name: "Arjun Joshi", stat: "185 uploads, 91% approved" },
];

const CONNECTED_SERVICES = [
  { name: "Shopify", desc: "Auto-sync product images", initial: "S", grad: "from-[#FF9900] to-[#FF6600]", status: "Connected", color: "green" as const },
  { name: "Jira", desc: "Task management sync", initial: "J", grad: "from-[#0052CC] to-[#0065FF]", status: "Connected", color: "green" as const },
  { name: "Slack", desc: "Notifications & alerts", initial: "S", grad: "from-[#E01E5A] to-[#ECB22E]", status: "Pending setup", color: "yellow" as const },
];

const WEBHOOK_EVENTS = [
  { name: "on.image.generated", status: "Active", color: "green" as const },
  { name: "on.review.completed", status: "Active", color: "green" as const },
  { name: "on.batch.finished", status: "Test", color: "yellow" as const },
];

const SESSIONS = [
  { device: "Chrome on MacOS", meta: "Mumbai · Current session", active: true },
  { device: "Safari on iPhone", meta: "Mumbai · Last active 2h ago", active: false },
  { device: "Chrome on Windows", meta: "Bangalore · Last active 3d ago", active: false },
];

export default function SettingsPage() {
  const [tab, setTab] = useState(0);

  return (
    <div>
      <div className="mb-4 text-base font-bold text-t1">Settings</div>

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
        <>
          <p className="mb-4 text-xs text-t3">
            Manage your workspace name, logo, timezone, and default preferences.
          </p>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader title="Workspace" />
              <Row label="Workspace name">
                <input defaultValue="SUGAR Design Lab" className="w-44 rounded-md border border-border bg-s2 px-2.5 py-1.5 text-[11px] text-t1" />
              </Row>
              <Row label="Timezone">
                <SelectField options={["Asia/Kolkata (IST)", "US/Eastern", "US/Pacific", "Europe/London"]} />
              </Row>
              <Row label="Default language">
                <SelectField options={["English", "Hindi"]} />
              </Row>
              <Row label="Date format">
                <SelectField options={["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]} />
              </Row>
            </Card>
            <Card>
              <CardHeader title="Default image settings" />
              <Row label="Output format">
                <SelectField options={["PNG", "JPEG", "WebP"]} />
              </Row>
              <Row label="Default resolution">
                <SelectField options={["2048 x 2048", "1024 x 1024", "4096 x 4096"]} />
              </Row>
              <Row label="Background removal">
                <Badge color="green">Auto-enabled</Badge>
              </Row>
              <Row label="Watermark" last>
                <Badge color="yellow">Off</Badge>
              </Row>
            </Card>
          </div>
        </>
      )}

      {tab === 1 && (
        <>
          <p className="mb-4 text-xs text-t3">
            Configure team defaults, invite settings, and view member productivity.
          </p>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader title="Team defaults" />
              <Row label="Default role for new members">
                <SelectField options={["Creator", "Reviewer L1", "Brand Manager"]} />
              </Row>
              <Row label="Domain auto-join">
                <div className="flex items-center gap-1.5">
                  <code className="rounded bg-s2 px-2 py-0.5 text-[10px]">@sugarcosmetics.com</code>
                  <Badge color="green">Enabled</Badge>
                </div>
              </Row>
              <Row label="Invite link">
                <div className="flex items-center gap-1.5">
                  <code className="rounded bg-s2 px-2 py-0.5 text-[10px]">stampos.app/join/sugar-f8k2</code>
                  <Button size="sm">Copy</Button>
                </div>
              </Row>
              <Row label="Require 2FA" last>
                <Badge color="green">On</Badge>
              </Row>
            </Card>
            <Card>
              <CardHeader title="Productivity" />
              {PRODUCTIVITY.map((p, i) => (
                <Row key={p.name} label={p.name} last={i === PRODUCTIVITY.length - 1}>
                  <span className="font-semibold text-t1">{p.stat}</span>
                </Row>
              ))}
            </Card>
          </div>
        </>
      )}

      {tab === 2 && (
        <>
          <p className="mb-4 text-xs text-t3">
            Fine-tune AI quality thresholds, model preferences, and generation parameters.
          </p>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader title="Quality thresholds" />
              <SliderRow label="Minimum quality score" defaultValue={85} min={50} max={100} />
              <SliderRow label="Auto-approve threshold" defaultValue={95} min={80} max={100} />
              <SliderRow label="Auto-reject threshold" defaultValue={40} min={0} max={70} />
              <Row label="Auto-QC on upload" last>
                <Badge color="green">Enabled</Badge>
              </Row>
            </Card>
            <Card>
              <CardHeader title="Model configuration" />
              <Row label="Default model">
                <SelectField options={["STAMP v3.2 (Latest)", "STAMP v3.1", "STAMP v2.8 (Legacy)"]} />
              </Row>
              <Row label="GPU priority">
                <SelectField options={["High (Enterprise)", "Standard"]} />
              </Row>
              <Row label="Batch size limit">
                <span className="font-semibold text-t1">500 images</span>
              </Row>
              <Row label="Training data retention" last>
                <span className="font-semibold text-t1">12 months</span>
              </Row>
            </Card>
          </div>
        </>
      )}

      {tab === 3 && (
        <>
          <p className="mb-4 text-xs text-t3">
            Manage connected services, DAM platforms, and marketplace integrations.
          </p>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader title="Connected services" />
              <div className="flex flex-col gap-3">
                {CONNECTED_SERVICES.map((s) => (
                  <div key={s.name} className="flex items-center justify-between rounded-md bg-glass p-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${s.grad} text-[11px] font-black text-white`}>
                        {s.initial}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-t1">{s.name}</div>
                        <div className="text-[10px] text-t4">{s.desc}</div>
                      </div>
                    </div>
                    <Badge color={s.color}>{s.status}</Badge>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <CardHeader title="Webhooks" />
              {WEBHOOK_EVENTS.map((w, i) => (
                <Row key={w.name} label={w.name} last={i === WEBHOOK_EVENTS.length - 1}>
                  <Badge color={w.color}>{w.status}</Badge>
                </Row>
              ))}
              <Button size="sm" className="mt-3">+ Add webhook</Button>
            </Card>
          </div>
        </>
      )}

      {tab === 4 && (
        <>
          <p className="mb-4 text-xs text-t3">
            Configure SSO, 2FA, session management, and audit log retention policies.
          </p>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader title="Authentication" />
              <ToggleRow title="Two-factor authentication" desc="Require 2FA for all team members" defaultOn />
              <Row label="">
                <div>
                  <div className="text-xs font-bold text-t1">SSO / SAML</div>
                  <div className="text-[10px] text-t4">Single sign-on via Okta, Azure AD, Google Workspace</div>
                </div>
              </Row>
              <div className="-mt-2 mb-3.5 flex justify-end">
                <Badge color="green">Connected — Okta</Badge>
              </div>
              <ToggleRow title="IP whitelisting" desc="Restrict access to specific IP addresses" />
              <Row label="Session timeout" last>
                <SelectField options={["30 minutes", "1 hour", "4 hours", "8 hours"]} defaultIndex={2} />
              </Row>
            </Card>
            <Card>
              <CardHeader title="Active sessions" />
              {SESSIONS.map((s, i) => (
                <div key={s.device} className={`flex items-center justify-between py-2.5 ${i < SESSIONS.length - 1 ? "border-b border-border" : ""}`}>
                  <div>
                    <div className="text-xs font-bold text-t1">{s.device}</div>
                    <div className="text-[10px] text-t4">{s.meta}</div>
                  </div>
                  {s.active ? <Badge color="green">Active</Badge> : <Button size="sm" className="text-danger">Revoke</Button>}
                </div>
              ))}
              <Button size="sm" className="mt-3 text-danger">Revoke all other sessions</Button>
            </Card>
          </div>
        </>
      )}

      {tab === 5 && (
        <>
          <p className="mb-4 text-xs text-t3">
            Control email, in-app, and Slack notification preferences by event type.
          </p>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader title="Email notifications" />
              <ToggleRow title="Generation complete" desc="When a batch finishes generating images" defaultOn />
              <ToggleRow title="Review required" desc="When images are assigned to your review queue" defaultOn />
              <ToggleRow title="Approval/rejection" desc="When your images are approved or rejected" defaultOn />
              <ToggleRow title="Billing alerts" desc="Invoice due, payment failed, plan limits approaching" defaultOn />
              <ToggleRow title="Weekly digest" desc="Summary of team activity and metrics" last />
            </Card>
            <Card>
              <CardHeader title="Slack notifications" />
              <Row label="">
                <div>
                  <div className="text-xs font-bold text-t1">Slack integration</div>
                  <div className="text-[10px] text-t4">Post notifications to a Slack channel</div>
                </div>
              </Row>
              <div className="-mt-2 mb-3.5 flex justify-end">
                <Badge color="green">Connected — #stamp-os</Badge>
              </div>
              <ToggleRow title="Generation alerts" desc="Notify channel when batches complete" defaultOn />
              <ToggleRow title="Low quality alerts" desc="Alert when approval rate drops below threshold" defaultOn />
              <ToggleRow title="Daily summary" desc="Post daily activity summary at 9 AM" last />
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function Row({ label, children, last }: { label: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className={`flex items-center justify-between text-xs ${last ? "" : "mb-3.5"}`}>
      <span className="text-t2">{label}</span>
      {children}
    </div>
  );
}

function SelectField({ options, defaultIndex = 0 }: { options: string[]; defaultIndex?: number }) {
  return (
    <select defaultValue={options[defaultIndex]} className="rounded-md border border-border bg-s2 px-2 py-1 text-[11px] text-t1">
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}

function SliderRow({ label, defaultValue, min, max }: { label: string; defaultValue: number; min: number; max: number }) {
  return (
    <div className="mb-3.5 flex items-center justify-between text-xs">
      <span className="text-t2">{label}</span>
      <div className="flex items-center gap-2">
        <input type="range" min={min} max={max} defaultValue={defaultValue} className="w-28 accent-accent" />
        <span className="text-[13px] font-bold text-t1">{defaultValue}%</span>
      </div>
    </div>
  );
}

function ToggleRow({ title, desc, defaultOn, last }: { title: string; desc: string; defaultOn?: boolean; last?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <div className={`flex items-center justify-between gap-4 ${last ? "" : "mb-3.5"}`}>
      <div>
        <div className="text-xs font-bold text-t1">{title}</div>
        <div className="mt-0.5 text-[10px] text-t4">{desc}</div>
      </div>
      <button
        onClick={() => setOn((v) => !v)}
        className={`relative h-[22px] w-[38px] shrink-0 rounded-full transition-colors ${on ? "bg-accent" : "bg-s3"}`}
      >
        <span className={`absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white shadow transition-all ${on ? "left-[18px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}
