"use client";

import { useState } from "react";
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/theme-provider";
import {
  Settings2, Palette, Bell, ShieldCheck, TriangleAlert,
  Sun, Moon, Monitor, Folder, Users, ListTodo,
  Check, Globe, Lock, Mail,
} from "lucide-react";

type Stats = { projectCount: number; memberCount: number; taskCount: number };

// ── tiny primitives ──────────────────────────────────────────────────────────

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col gap-0.5 mb-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-4">
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-medium">{label}</span>
        {description && (
          <span className="text-xs text-muted-foreground">{description}</span>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border bg-card p-6 ${className}`}>{children}</div>
  );
}

function DividerRow() {
  return <Separator className="my-0" />;
}

// ── tabs ─────────────────────────────────────────────────────────────────────

const NAV = [
  { value: "general",       label: "General",       Icon: Settings2    },
  { value: "appearance",    label: "Appearance",    Icon: Palette      },
  { value: "notifications", label: "Notifications", Icon: Bell         },
  { value: "security",      label: "Security",      Icon: ShieldCheck  },
  { value: "danger",        label: "Danger Zone",   Icon: TriangleAlert },
] as const;

// ── General ──────────────────────────────────────────────────────────────────

function GeneralTab({ stats }: { stats: Stats }) {
  const [name, setName]   = useState("Swarthmore CS Club");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        title="General"
        description="Manage your workspace identity and overview."
      />

      {/* workspace stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Projects", value: stats.projectCount, Icon: Folder,   color: "#6366f1" },
          { label: "Members",  value: stats.memberCount,  Icon: Users,    color: "#10b981" },
          { label: "Tasks",    value: stats.taskCount,    Icon: ListTodo, color: "#f59e0b" },
        ].map(s => (
          <div
            key={s.label}
            className="relative overflow-hidden rounded-2xl border bg-card px-5 py-4 flex flex-col gap-0.5"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {s.label}
              </span>
              <s.Icon className="size-4" style={{ color: s.color }} />
            </div>
            <span className="text-3xl font-black tabular-nums" style={{ color: s.color }}>
              {s.value}
            </span>
            <div
              className="absolute inset-x-0 bottom-0 h-[3px]"
              style={{ background: `linear-gradient(to right, ${s.color}cc, transparent)` }}
            />
          </div>
        ))}
      </div>

      {/* workspace info */}
      <Card>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          Workspace
        </p>
        <div className="flex flex-col gap-0">
          <SettingRow label="Workspace name" description="Displayed across the app and in notifications.">
            <div className="flex items-center gap-2">
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-52 text-sm"
              />
              <Button size="sm" onClick={handleSave} variant={saved ? "secondary" : "default"}>
                {saved ? <><Check className="size-3.5" /> Saved</> : "Save"}
              </Button>
            </div>
          </SettingRow>
          <DividerRow />
          <SettingRow label="Workspace URL" description="Your workspace's unique identifier.">
            <div className="flex items-center gap-2 rounded-xl border bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground">
              <Globe className="size-3.5" />
              tickflow.swarthmore.edu
            </div>
          </SettingRow>
          <DividerRow />
          <SettingRow label="Plan" description="Current billing tier.">
            <Badge variant="secondary" className="gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
              Free
            </Badge>
          </SettingRow>
        </div>
      </Card>
    </div>
  );
}

// ── Appearance ───────────────────────────────────────────────────────────────

const ACCENT_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f97316",
  "#10b981", "#14b8a6", "#3b82f6", "#f59e0b",
];

function AppearanceTab() {
  const { resolvedTheme, setTheme } = useTheme();
  const [accent, setAccent]         = useState("#6366f1");
  const [density, setDensity]       = useState<"comfortable" | "compact">("comfortable");

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        title="Appearance"
        description="Personalise how tickflow looks and feels."
      />

      {/* theme picker */}
      <Card>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          Theme
        </p>
        <div className="grid grid-cols-3 gap-3">
          {(
            [
              { value: "light",  label: "Light",  Icon: Sun     },
              { value: "dark",   label: "Dark",   Icon: Moon    },
              { value: "system", label: "System", Icon: Monitor },
            ] as const
          ).map(t => {
            const active = resolvedTheme === t.value || (t.value === "system" && !["light","dark"].includes(resolvedTheme ?? ""));
            return (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={`group flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all hover:bg-muted/40 ${
                  active ? "border-primary bg-primary/5" : "border-transparent"
                }`}
              >
                <t.Icon className={`size-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-xs font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* accent colour */}
      <Card>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          Accent colour
        </p>
        <div className="flex gap-2.5 flex-wrap">
          {ACCENT_COLORS.map(c => (
            <button
              key={c}
              onClick={() => setAccent(c)}
              className="size-8 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                background: c,
                borderColor: accent === c ? c : "transparent",
                boxShadow: accent === c ? `0 0 0 2px white, 0 0 0 4px ${c}` : "none",
              }}
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Visual preview only — full accent theming coming soon.
        </p>
      </Card>

      {/* density */}
      <Card>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          Interface density
        </p>
        <div className="grid grid-cols-2 gap-3">
          {(["comfortable", "compact"] as const).map(d => (
            <button
              key={d}
              onClick={() => setDensity(d)}
              className={`flex flex-col gap-1.5 rounded-2xl border-2 p-4 text-left transition-all hover:bg-muted/40 ${
                density === d ? "border-primary bg-primary/5" : "border-transparent border-border"
              }`}
            >
              <div className="flex flex-col gap-1.5">
                {d === "comfortable"
                  ? [14, 10, 12].map((w, i) => (
                      <div key={i} className={`h-1.5 rounded-full bg-muted-foreground/30`} style={{ width: `${w * 4}px` }} />
                    ))
                  : [14, 10, 12].map((w, i) => (
                      <div key={i} className={`h-1 rounded-full bg-muted-foreground/30`} style={{ width: `${w * 4}px` }} />
                    ))}
              </div>
              <span className={`mt-1 text-xs font-medium capitalize ${density === d ? "text-primary" : "text-muted-foreground"}`}>
                {d}
              </span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── Notifications ────────────────────────────────────────────────────────────

const NOTIFICATION_GROUPS = [
  {
    heading: "Activity",
    items: [
      { id: "assigned",   label: "Task assigned to me",          description: "When someone assigns you a ticket."             },
      { id: "mentioned",  label: "Mentioned in a comment",       description: "When your name is @-mentioned."                 },
      { id: "status",     label: "Task status changes",          description: "When a ticket you own changes status."          },
      { id: "due",        label: "Due-date reminders",           description: "24 h and 1 h before a task is due."             },
    ],
  },
  {
    heading: "Projects",
    items: [
      { id: "newticket",  label: "New ticket in my project",     description: "When a ticket is created in a project you lead." },
      { id: "invite",     label: "Project invitations",          description: "When you're added to a new project."            },
    ],
  },
  {
    heading: "Digest",
    items: [
      { id: "daily",      label: "Daily digest email",           description: "A morning summary of your open tasks."          },
      { id: "weekly",     label: "Weekly report",                description: "High-level stats every Monday."                  },
    ],
  },
];

function NotificationsTab() {
  const defaults = Object.fromEntries(
    NOTIFICATION_GROUPS.flatMap(g => g.items).map(i => [i.id, true])
  );
  const [enabled, setEnabled] = useState<Record<string, boolean>>(defaults);

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        title="Notifications"
        description="Choose what pings you and how."
      />

      <Card className="flex items-center gap-3 py-4 px-5">
        <Mail className="size-4 text-muted-foreground shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">Deliver via</p>
          <p className="text-xs text-muted-foreground">aaidark1@swarthmore.edu</p>
        </div>
        <Badge variant="secondary" className="gap-1.5 shrink-0">
          <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
          Verified
        </Badge>
      </Card>

      {NOTIFICATION_GROUPS.map(group => (
        <Card key={group.heading}>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            {group.heading}
          </p>
          <div className="flex flex-col gap-0">
            {group.items.map((item, i) => (
              <div key={item.id}>
                {i > 0 && <DividerRow />}
                <SettingRow label={item.label} description={item.description}>
                  <Switch
                    checked={enabled[item.id]}
                    onCheckedChange={v => setEnabled(prev => ({ ...prev, [item.id]: v }))}
                  />
                </SettingRow>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

// ── Security ─────────────────────────────────────────────────────────────────

function SecurityTab() {
  const [currentPw, setCurrentPw]   = useState("");
  const [newPw, setNewPw]           = useState("");
  const [confirmPw, setConfirmPw]   = useState("");
  const [twoFactor, setTwoFactor]   = useState(false);
  const [sessions, setSessions]     = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        title="Security"
        description="Manage your credentials and active sessions."
      />

      <Card>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          Change password
        </p>
        <div className="flex flex-col gap-3 max-w-sm">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Current password</label>
            <Input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="••••••••" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">New password</label>
            <Input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="••••••••" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Confirm new password</label>
            <Input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="••••••••" />
          </div>
          {newPw && confirmPw && newPw !== confirmPw && (
            <p className="text-xs text-destructive">Passwords do not match.</p>
          )}
          <Button
            size="sm"
            className="w-fit"
            disabled={!currentPw || !newPw || newPw !== confirmPw}
          >
            <Lock className="size-3.5" />
            Update password
          </Button>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-0">
          <SettingRow
            label="Two-factor authentication"
            description="Require a one-time code in addition to your password."
          >
            <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
          </SettingRow>
          <DividerRow />
          <SettingRow
            label="Active sessions"
            description="Sign out from all other devices."
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSessions(true)}
              disabled={sessions}
            >
              {sessions ? <><Check className="size-3.5" /> Done</> : "Sign out everywhere"}
            </Button>
          </SettingRow>
        </div>
      </Card>
    </div>
  );
}

// ── Danger Zone ──────────────────────────────────────────────────────────────

function DangerRow({
  label,
  description,
  action,
  actionLabel,
}: {
  label: string;
  description: string;
  action?: () => void;
  actionLabel: string;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-4">
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
      <Button
        variant="destructive"
        size="sm"
        className="shrink-0"
        onClick={action}
      >
        {actionLabel}
      </Button>
    </div>
  );
}

function DangerTab() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        title="Danger Zone"
        description="Irreversible and destructive actions. Proceed with care."
      />

      <div className="rounded-2xl border border-destructive/40 bg-destructive/5 overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-3 border-b border-destructive/20 bg-destructive/10">
          <TriangleAlert className="size-4 text-destructive" />
          <span className="text-xs font-semibold text-destructive uppercase tracking-wide">
            Permanent actions
          </span>
        </div>
        <div className="px-5 flex flex-col gap-0">
          <DangerRow
            label="Archive all projects"
            description="Lock all projects from further edits. Members retain read-only access."
            actionLabel="Archive all"
          />
          <Separator />
          <DangerRow
            label="Export workspace data"
            description="Download a full JSON export of your projects, tasks, and members."
            actionLabel="Export"
          />
          <Separator />
          <DangerRow
            label="Delete workspace"
            description="Permanently delete the workspace and all of its data. This cannot be undone."
            actionLabel="Delete workspace"
          />
        </div>
      </div>
    </div>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────

export function SettingsClient({ stats }: { stats: Stats }) {
  return (
    <div className="w-full max-w-5xl mx-auto px-8 py-10 flex flex-col gap-8">
      {/* page header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage workspace preferences, appearance, and security.
        </p>
      </div>

      <Tabs orientation="vertical" defaultValue="general" className="items-start gap-8">
        {/* sidebar nav */}
        <TabsList className="w-48 shrink-0 flex flex-col gap-1 bg-transparent p-0 h-fit">
          {NAV.map(item => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              className={`w-full justify-start gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-active:bg-muted data-active:text-foreground ${
                item.value === "danger" ? "mt-4 data-active:bg-destructive/10 data-active:text-destructive hover:text-destructive" : ""
              }`}
            >
              <item.Icon className="size-4 shrink-0" />
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* content */}
        <div className="flex-1 min-w-0">
          <TabsContent value="general">
            <GeneralTab stats={stats} />
          </TabsContent>
          <TabsContent value="appearance">
            <AppearanceTab />
          </TabsContent>
          <TabsContent value="notifications">
            <NotificationsTab />
          </TabsContent>
          <TabsContent value="security">
            <SecurityTab />
          </TabsContent>
          <TabsContent value="danger">
            <DangerTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
