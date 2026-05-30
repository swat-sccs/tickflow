import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Crown, CircleDot, Users, Trophy } from "lucide-react";
import Link from "next/link";

const PALETTES = [
  { from: "#6366f1", to: "#8b5cf6" },
  { from: "#ec4899", to: "#f97316" },
  { from: "#14b8a6", to: "#06b6d4" },
  { from: "#f59e0b", to: "#ef4444" },
  { from: "#10b981", to: "#3b82f6" },
  { from: "#8b5cf6", to: "#ec4899" },
  { from: "#06b6d4", to: "#10b981" },
  { from: "#f97316", to: "#f59e0b" },
  { from: "#3b82f6", to: "#6366f1" },
  { from: "#ef4444", to: "#ec4899" },
  { from: "#84cc16", to: "#06b6d4" },
];
export const dynamic = "force-dynamic";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const CIRCUMFERENCE = 2 * Math.PI * 20;

function ProgressRing({ pct, color }: { pct: number; color: string }) {
  const offset = CIRCUMFERENCE * (1 - Math.min(pct, 1));
  return (
    <svg viewBox="0 0 50 50" className="size-14 -rotate-90 shrink-0">
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="4"
        stroke="currentColor"
        className="text-muted/40"
      />
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="4"
        stroke={color}
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}
const roleVariant: Record<"lead" | "member", "default" | "secondary"> = {
  lead: "default",
  member: "secondary",
};

type StatPillProps = {
  icon: React.ReactNode;
  label: string;
  value: number;
  muted?: boolean;
};

function StatPill({ icon, label, value, muted }: StatPillProps) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span
        className={`text-2xl font-bold ${muted ? "text-muted-foreground" : ""}`}
      >
        {value}
      </span>
      <span className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
        {icon}
        {label}
      </span>
    </div>
  );
}

export default async function MembersPage() {
  const members = await prisma.user.findMany({
    include: {
      projectMembers: {
        include: { project: { select: { title: true, slug: true } } },
        orderBy: { projectId: "asc" },
      },
      taskAssignees: {
        include: { task: { select: { status: true } } },
      },
    },
    orderBy: { name: "asc" },
  });

  const totalMembers = members.length;
  const totalLeads = members.filter((m) =>
    m.projectMembers.some((pm) => pm.role === "lead"),
  ).length;
  const allTasks = members.flatMap((m) => m.taskAssignees.map((ta) => ta.task));
  const globalOpen = allTasks.filter(
    (t) => t.status !== "done" && t.status !== "shipped",
  ).length;
  const globalDone = allTasks.filter(
    (t) => t.status === "done" || t.status === "shipped",
  ).length;

  return (
    <div className="flex flex-col gap-10 px-8 py-10 w-full max-w-7xl mx-auto">
      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Workspace
        </p>
        <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-violet-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
          The Team
        </h1>
        <p className="text-muted-foreground text-base">
          {totalMembers} members building things together
        </p>
      </div>

      {/* ── Stat row ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(
          [
            {
              label: "Members",
              value: totalMembers,
              Icon: Users,
              accent: "#6366f1",
            },
            {
              label: "Team Leads",
              value: totalLeads,
              Icon: Crown,
              accent: "#f59e0b",
            },
            {
              label: "Open Tasks",
              value: globalOpen,
              Icon: CircleDot,
              accent: "#f97316",
            },
            {
              label: "Delivered",
              value: globalDone,
              Icon: Trophy,
              accent: "#10b981",
            },
          ] as const
        ).map((stat) => (
          <div
            key={stat.label}
            className="relative overflow-hidden rounded-2xl border bg-card px-5 py-4 flex flex-col gap-0.5"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {stat.label}
              </span>
              <stat.Icon className="size-4" style={{ color: stat.accent }} />
            </div>
            <span
              className="text-4xl font-black tabular-nums"
              style={{ color: stat.accent }}
            >
              {stat.value}
            </span>
            <div
              className="absolute inset-x-0 bottom-0 h-[3px]"
              style={{
                background: `linear-gradient(to right, ${stat.accent}cc, transparent)`,
              }}
            />
          </div>
        ))}
      </div>

      {/* ── Member grid ──────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {members.map((member, idx) => {
          const palette = PALETTES[idx % PALETTES.length];
          const gradBg = `linear-gradient(135deg, ${palette.from}, ${palette.to})`;
          const tasks = member.taskAssignees.map((ta) => ta.task);
          const total = tasks.length;
          const done = tasks.filter(
            (t) => t.status === "done" || t.status === "shipped",
          ).length;
          const inprog = tasks.filter((t) => t.status === "inprogress").length;
          const blocked = tasks.filter((t) => t.status === "blocked").length;
          const queued = tasks.filter(
            (t) => t.status === "backlog" || t.status === "todo",
          ).length;
          const pct = total > 0 ? done / total : 0;
          const isLead = member.projectMembers.some((pm) => pm.role === "lead");

          return (
            <div
              key={member.id}
              className="group relative rounded-2xl border bg-card overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300"
            >
              {/* gradient header */}
              <div
                className="relative h-24 w-full"
                style={{ background: gradBg }}
              >
                {isLead && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/20 backdrop-blur-sm px-2.5 py-1 text-white text-[10px] font-semibold">
                    <Crown className="size-3" />
                    Lead
                  </div>
                )}
                {/* floating avatar */}
                <div
                  className="absolute -bottom-8 left-5 size-16 rounded-full border-4 border-card flex items-center justify-center text-white text-lg font-bold shadow-lg shrink-0 select-none"
                  style={{ background: gradBg }}
                >
                  {initials(member.name)}
                </div>
              </div>

              {/* body */}
              <div className="flex flex-col gap-4 px-5 pt-11 pb-5">
                {/* name row + progress ring */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col min-w-0 pt-0.5">
                    <span className="font-bold text-lg leading-tight truncate">
                      {member.name}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {member.email}
                    </span>
                    <span className="text-[10px] text-muted-foreground/50 mt-0.5">
                      Since{" "}
                      {member.createdAt.toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="relative shrink-0">
                    <ProgressRing pct={pct} color={palette.from} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-sm font-bold leading-none">
                        {done}
                      </span>
                      <span className="text-[9px] text-muted-foreground leading-none">
                        done
                      </span>
                    </div>
                  </div>
                </div>

                {/* activity bar */}
                {total > 0 ? (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex h-2 w-full rounded-full overflow-hidden">
                      {done > 0 && (
                        <div
                          className="h-full bg-emerald-500"
                          style={{ width: `${(done / total) * 100}%` }}
                        />
                      )}
                      {inprog > 0 && (
                        <div
                          className="h-full bg-amber-400"
                          style={{ width: `${(inprog / total) * 100}%` }}
                        />
                      )}
                      {blocked > 0 && (
                        <div
                          className="h-full bg-red-500"
                          style={{ width: `${(blocked / total) * 100}%` }}
                        />
                      )}
                      {queued > 0 && (
                        <div
                          className="h-full bg-muted"
                          style={{ width: `${(queued / total) * 100}%` }}
                        />
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-muted-foreground">
                      {done > 0 && (
                        <span className="flex items-center gap-1">
                          <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
                          {done} done
                        </span>
                      )}
                      {inprog > 0 && (
                        <span className="flex items-center gap-1">
                          <span className="size-1.5 rounded-full bg-amber-400 inline-block" />
                          {inprog} active
                        </span>
                      )}
                      {blocked > 0 && (
                        <span className="flex items-center gap-1">
                          <span className="size-1.5 rounded-full bg-red-500 inline-block" />
                          {blocked} blocked
                        </span>
                      )}
                      {queued > 0 && (
                        <span className="flex items-center gap-1">
                          <span className="size-1.5 rounded-full bg-muted-foreground/40 inline-block" />
                          {queued} queued
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground/50 italic">
                    No tasks assigned yet
                  </p>
                )}

                {/* projects */}
                {member.projectMembers.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 border-t pt-3 mt-1">
                    {member.projectMembers.map((pm) => (
                      <Link
                        key={pm.projectId}
                        href={`/projects/${pm.project.slug}`}
                      >
                        <Badge
                          variant={pm.role === "lead" ? "default" : "secondary"}
                          className="text-[10px] px-2 py-0.5 hover:opacity-75 transition-opacity cursor-pointer gap-1"
                        >
                          {pm.project.title}
                          {pm.role === "lead" && <Crown className="size-2.5" />}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}