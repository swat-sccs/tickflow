import { Button } from "@/components/ui/button";
import { Users, Plus, SignalHigh, SignalMedium, SignalLow } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatusSelect } from "@/components/status-select";
import { notFound } from "next/navigation";
import { NewTicketDialog } from "@/components/new-ticket-dialog";
import { prisma } from "@/lib/prisma";
import { Priority, Status } from "@prisma/client";

type ProjectItemProps = {
  params: Promise<{ proj_id: string }>;
};

const priorityIcon = {
  low: <SignalLow className="size-4 text-green-500" />,
  medium: <SignalMedium className="size-4 text-orange-500" />,
  high: <SignalHigh className="size-4 text-red-500" />,
} satisfies Record<Priority, React.ReactNode>;

const statusLabel: Record<Status, string> = {
  backlog: "Backlog",
  todo: "Todo",
  inprogress: "In Progress",
  done: "Done",
  blocked: "Blocked",
  shipped: "Shipped",
};

const statusVariant: Record<Status, "secondary" | "outline" | "destructive" | "default"> = {
  backlog: "outline",
  todo: "secondary",
  inprogress: "default",
  done: "secondary",
  blocked: "destructive",
  shipped: "secondary",
};

export default async function ProjectItem({ params }: ProjectItemProps) {
  const { proj_id } = await params;

  const [project, allProjects, users] = await Promise.all([
    prisma.project.findUnique({
      where: { slug: proj_id },
      include: { tasks: { include: { assignees: { include: { user: true } } } } },
    }),
    prisma.project.findMany({ select: { id: true, slug: true, title: true } }),
    prisma.user.findMany({ select: { id: true, name: true, email: true } }),
  ]);

  if (!project) notFound();

  const open = project.tasks.filter(t => t.status !== "done" && t.status !== "shipped").length;
  const inProgress = project.tasks.filter(t => t.status === "inprogress").length;
  const blocked = project.tasks.filter(t => t.status === "blocked").length;
  const done = project.tasks.filter(t => t.status === "done" || t.status === "shipped").length;

  return (
    <div className="w-[90%] flex flex-col gap-8 mx-auto py-10">

      {/* breadcrumb */}
      <p className="text-sm text-muted-foreground">
        projects &gt; {project.slug}
      </p>

      {/* header */}
      <div className="flex w-full items-start justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold">{project.title}</h1>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Users />
            Invite
          </Button>
          <NewTicketDialog projects={allProjects} users={users}>
            <Button>
              <Plus />
              New Issue
            </Button>
          </NewTicketDialog>
        </div>
      </div>

      {/* stats */}
      <div className="flex gap-8 border-b pb-6">
        <div className="flex flex-col">
          <span className="text-3xl font-bold">{open}</span>
          <span className="text-sm text-muted-foreground">Open issues</span>
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-bold">{inProgress}</span>
          <span className="text-sm text-muted-foreground">In progress</span>
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-bold">{blocked}</span>
          <span className="text-sm text-muted-foreground">Blocked</span>
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-bold">{done}</span>
          <span className="text-sm text-muted-foreground">Done</span>
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-bold">{project.tasks.length}</span>
          <span className="text-sm text-muted-foreground">Total</span>
        </div>
      </div>

      {/* tickets table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-full">Title</TableHead>
            <TableHead className="w-36">Status</TableHead>
            <TableHead className="w-28">Priority</TableHead>
            <TableHead className="w-40">Assignees</TableHead>
            <TableHead className="w-32">Due Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {project.tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                No tickets yet. Create one to get started.
              </TableCell>
            </TableRow>
          ) : (
            project.tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{task.title}</span>
                    {task.description && (
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {task.description}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusSelect taskId={task.id} status={task.status} />
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1.5 text-sm">
                    {priorityIcon[task.priority]}
                    <span className="capitalize">{task.priority}</span>
                  </span>
                </TableCell>
                <TableCell>
                  {task.assignees.length === 0 ? (
                    <span className="text-sm text-muted-foreground">—</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {task.assignees.map(a => (
                        <Badge key={a.userId} variant="outline" className="text-xs">
                          {a.user.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {task.dueDate
                    ? task.dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : "—"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
