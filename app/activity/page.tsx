import { ActivityTabs } from "@/components/activity-tabs";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const [recentTasks, users] = await Promise.all([
    prisma.task.findMany({
      include: {
        project: { select: { title: true, slug: true } },
        assignees: { include: { user: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.user.findMany({
      include: {
        taskAssignees: {
          include: { task: { select: { status: true } } },
        },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const userStats = users.map((u) => {
    const tasks = u.taskAssignees.map((ta) => ta.task);
    return {
      id: u.id,
      name: u.name,
      open: tasks.filter((t) => t.status !== "done" && t.status !== "shipped")
        .length,
      inprogress: tasks.filter((t) => t.status === "inprogress").length,
      done: tasks.filter((t) => t.status === "done" || t.status === "shipped")
        .length,
      blocked: tasks.filter((t) => t.status === "blocked").length,
      total: tasks.length,
    };
  });

  return (
    <div className="w-[90%] mx-auto flex flex-col gap-6 py-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold">Activity</h1>
        <p className="text-muted-foreground">
          Recent task activity and team workload overview.
        </p>
      </div>
      <ActivityTabs recentTasks={recentTasks} userStats={userStats} />
    </div>
  );
}