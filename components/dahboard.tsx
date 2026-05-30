import { Button } from "@/components/ui/button";
import { ArrowRight, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NewTicketDialog } from "@/components/new-ticket-dialog";
import { ProjectStatusChart } from "@/components/project-status-chart";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export function CardImage(props: { text: string; number: number }) {
  return (
    <Card className="mx-auto w-full max-w-sm pt-0">
      <CardHeader className="mt-5">
        <CardTitle className="text-secondary text-md">{props.text}</CardTitle>
        <CardDescription className="text-primary text-5xl">
          {props.number}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

type projectWithTasks = {
  id: number;
  slug: string;
  title: string;
  tasks: { status: string }[];
};
type User = { id: number; name: string; email: string };

export async function Dashboard() {
  const [projectsWithTasks, users, totalOpen, inProgress, closed] =
    await Promise.all([
      prisma.project.findMany({
        select: {
          id: true,
          slug: true,
          title: true,
          tasks: { select: { status: true } },
        },
      }),
      prisma.user.findMany({ select: { id: true, name: true, email: true } }),
      prisma.task.count({ where: { status: { notIn: ["done", "shipped"] } } }),
      prisma.task.count({ where: { status: "inprogress" } }),
      prisma.task.count({ where: { status: { in: ["done", "shipped"] } } }),
    ]);
  const total = totalOpen + closed;

  const projects = projectsWithTasks.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
  }));

  function ChartDataForProjects() {
    const chartData = projectsWithTasks.map((p) => ({
      name: p.slug.toUpperCase(),
      backlog: p.tasks.filter((t) => t.status === "backlog").length,
      todo: p.tasks.filter((t) => t.status === "todo").length,
      inprogress: p.tasks.filter((t) => t.status === "inprogress").length,
      blocked: p.tasks.filter((t) => t.status === "blocked").length,
      done: p.tasks.filter((t) => t.status === "done").length,
      shipped: p.tasks.filter((t) => t.status === "shipped").length,
    }));

    return Array.from(
      { length: Math.ceil(chartData.length / 4) || 1 },
      (_, i) => chartData.slice(i * 4, i * 4 + 4),
    ).map((chunk, i) => <ProjectStatusChart key={i} data={chunk} />);
  }

  return (
    <div className="w-[90%] mx-auto flex flex-col gap-6 py-10">
      <div className="flex flex-col gap-4 justify-left">
        <h1 className="text-4xl">Hello, Damian.</h1>
        <p className="text-secondary">
          {totalOpen} open {totalOpen === 1 ? "issue" : "issues"} across{" "}
          {projects.length} {projects.length === 1 ? "project" : "projects"}
        </p>
        <div className="flex gap-2">
          <NewTicketDialog
            projects={projects}
            users={users}
            triggerLabel="New issue"
          />
          <Link href="/issues">
            <Button variant="outline">
              View all issues
              <ArrowRight />
            </Button>
          </Link>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-6">
        <div className="flex">
          <CardImage text="Total open" number={totalOpen} />
          <CardImage text="Total tasks" number={total} />
          <CardImage text="In progress" number={inProgress} />
          <CardImage text="Closed" number={closed} />
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Ticket status by project</h2>

          <ChartDataForProjects />
        </div>
      </div>
    </div>
  );
}
