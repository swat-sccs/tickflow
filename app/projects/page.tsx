import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { ProjectIcon } from "@/lib/project-icons";
import Link from "next/link";
import { NewProjectDialog } from "@/components/new-project-dialog";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const dynamic = "force-dynamic";

function ProjectCard(props: {
  icon: string;
  name: string;
  title: string;
  description: string;
  progress: number;
  taskCount: number;
}) {
  return (
    <Card className="w-full flex flex-col gap-0 rounded-2xl hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center justify-center size-9 rounded-lg bg-muted">
            <ProjectIcon
              name={props.icon}
              className="size-4 text-muted-foreground"
            />
          </div>
          <Badge
            variant="secondary"
            className="font-mono text-xs uppercase tracking-wide"
          >
            {props.name}
          </Badge>
        </div>
        <CardTitle className="text-base leading-snug">{props.title}</CardTitle>
        <CardDescription className="text-sm line-clamp-2 min-h-10">
          {props.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col items-start gap-1.5 pt-0">
        <div className="flex w-full justify-between text-xs text-muted-foreground">
          <span>
            {props.taskCount} {props.taskCount === 1 ? "ticket" : "tickets"}
          </span>
          <span>{props.progress}% done</span>
        </div>
        <Progress value={props.progress} className="h-1.5 w-full" />
      </CardFooter>
    </Card>
  );
}

export default async function Projects() {
  const [projects, users] = await Promise.all([
    prisma.project.findMany({
      include: { tasks: { select: { status: true } } },
    }),
    prisma.user.findMany({ select: { id: true, name: true, email: true } }),
  ]);
  const totalTickets = projects.reduce((sum, p) => sum + p.tasks.length, 0);
  return (
    <div className="w-[90%] mx-auto flex flex-col gap-6 py-10">
      <div className="flex gap-4 justify-between">
        <div>
          <h1 className="text-4xl pb-3">Projects</h1>
          <p className="text-secondary">
            {projects.length} {projects.length === 1 ? "project" : "projects"}.{" "}
            {totalTickets} total {totalTickets === 1 ? "ticket" : "tickets"}{" "}
            across the workspace.
          </p>
        </div>
        <div className="flex">
          <NewProjectDialog users={users} triggerLabel="New Project" />
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-3 gap-6">
        {projects.map((item) => {
          const done = item.tasks.filter(
            (t) => t.status === "done" || t.status === "shipped",
          ).length;
          const progress =
            item.tasks.length > 0
              ? Math.round((done / item.tasks.length) * 100)
              : 0;
          return (
            <Link href={`/projects/${item.id}`} key={item.id}>
              <ProjectCard
                icon={item.icon}
                name={item.slug}
                title={item.title}
                description={item.description}
                progress={progress}
                taskCount={item.tasks.length}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
