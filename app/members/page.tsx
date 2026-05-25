import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  CheckCheck,
  CircleDot,
  Clock,
  Folder,
  ShieldAlert,
  Layers,
} from "lucide-react";
import Link from "next/link";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const roleVariant: Record<"lead" | "member", "default" | "secondary"> = {
  lead: "default",
  member: "secondary",
};

type StatPillProps = { icon: React.ReactNode; label: string; value: number; muted?: boolean };

function StatPill({ icon, label, value, muted }: StatPillProps) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={`text-2xl font-bold ${muted ? "text-muted-foreground" : ""}`}>
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
        include: {
          project: { select: { title: true, slug: true } },
        },
        orderBy: { projectId: "asc" },
      },
      taskAssignees: {
        include: {
          task: { select: { status: true } },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  const totalMembers = members.length;
  const totalLeads = members.filter((m) =>
    m.projectMembers.some((pm) => pm.role === "lead")
  ).length;

  return (
    <div className="w-[90%] mx-auto flex flex-col gap-8 py-10">
      {/* header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold">Members</h1>
        <p className="text-muted-foreground">
          {totalMembers} {totalMembers === 1 ? "member" : "members"} across the
          workspace · {totalLeads} {totalLeads === 1 ? "lead" : "leads"}
        </p>
      </div>

      {members.length === 0 ? (
        <p className="text-muted-foreground text-sm py-12 text-center">
          No members yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {members.map((member) => {
            const tasks = member.taskAssignees.map((ta) => ta.task);
            const total = tasks.length;
            const open = tasks.filter(
              (t) => t.status !== "done" && t.status !== "shipped"
            ).length;
            const inprogress = tasks.filter(
              (t) => t.status === "inprogress"
            ).length;
            const blocked = tasks.filter((t) => t.status === "blocked").length;
            const done = tasks.filter(
              (t) => t.status === "done" || t.status === "shipped"
            ).length;

            const isLead = member.projectMembers.some(
              (pm) => pm.role === "lead"
            );

            return (
              <Card key={member.id} className="flex flex-col gap-0 p-0 overflow-hidden">
                {/* top colour strip keyed to lead vs member */}
                <div
                  className={`h-1.5 w-full ${isLead ? "bg-primary" : "bg-muted"}`}
                />

                <CardHeader className="flex flex-row items-center gap-4 px-5 pt-5 pb-3">
                  <Avatar className="size-14 text-lg shrink-0">
                    <AvatarFallback className="text-base font-semibold">
                      {initials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-base truncate">
                        {member.name}
                      </span>
                      {isLead && (
                        <Badge variant="default" className="text-[10px] px-1.5 py-0 shrink-0">
                          Lead
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground truncate">
                      {member.email}
                    </span>
                    <span className="text-xs text-muted-foreground/60 mt-0.5">
                      Joined {formatDate(member.createdAt)}
                    </span>
                  </div>
                </CardHeader>

                <Separator />

                {/* task stats */}
                <CardContent className="px-5 py-4">
                  <div className="flex justify-between">
                    <StatPill
                      icon={<Layers className="size-3" />}
                      label="Total"
                      value={total}
                    />
                    <StatPill
                      icon={<Clock className="size-3" />}
                      label="Open"
                      value={open}
                    />
                    <StatPill
                      icon={<CircleDot className="size-3 text-yellow-500" />}
                      label="In progress"
                      value={inprogress}
                    />
                    <StatPill
                      icon={<ShieldAlert className="size-3 text-red-500" />}
                      label="Blocked"
                      value={blocked}
                      muted={blocked === 0}
                    />
                    <StatPill
                      icon={<CheckCheck className="size-3 text-green-500" />}
                      label="Done"
                      value={done}
                    />
                  </div>
                </CardContent>

                {/* projects */}
                {member.projectMembers.length > 0 && (
                  <>
                    <Separator />
                    <CardContent className="px-5 py-3">
                      <div className="flex items-start gap-2">
                        <Folder className="size-3.5 text-muted-foreground mt-0.5 shrink-0" />
                        <div className="flex flex-wrap gap-1.5">
                          {member.projectMembers.map((pm) => (
                            <Link
                              key={pm.projectId}
                              href={`/projects/${pm.project.slug}`}
                              className="group flex items-center gap-1"
                            >
                              <Badge
                                variant={roleVariant[pm.role]}
                                className="text-xs group-hover:opacity-80 transition-opacity"
                              >
                                {pm.project.title}
                                {pm.role === "lead" && (
                                  <span className="ml-1 opacity-70">· lead</span>
                                )}
                              </Badge>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
