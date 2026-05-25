import { prisma } from "@/lib/prisma";
import { SignalHigh, SignalMedium, SignalLow } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Priority, Status } from "@prisma/client";
import Link from "next/link";

const priorityIcon: Record<Priority, React.ReactNode> = {
  low:    <SignalLow    className="size-4 text-green-500" />,
  medium: <SignalMedium className="size-4 text-orange-500" />,
  high:   <SignalHigh   className="size-4 text-red-500" />,
};

const statusLabel: Record<Status, string> = {
  backlog:    "Backlog",
  todo:       "Todo",
  inprogress: "In Progress",
  done:       "Done",
  blocked:    "Blocked",
  shipped:    "Shipped",
};

const statusVariant: Record<Status, "secondary" | "outline" | "destructive" | "default"> = {
  backlog:    "outline",
  todo:       "secondary",
  inprogress: "default",
  done:       "secondary",
  blocked:    "destructive",
  shipped:    "secondary",
};

export default async function MyIssues() {
  const tasks = await prisma.task.findMany({
    include: {
      project: { select: { title: true, slug: true } },
      assignees: { include: { user: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  const open   = tasks.filter(t => t.status !== "done" && t.status !== "shipped").length;
  const inProg = tasks.filter(t => t.status === "inprogress").length;

  return (
    <div className="w-[90%] flex flex-col gap-8 mx-auto py-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold">My Issues</h1>
        <p className="text-muted-foreground">
          Showing all issues · {open} open · {inProg} in progress · {tasks.length} total
        </p>
        <p className="text-xs text-muted-foreground/60">
          Personalized view will be available once authentication is set up.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead className="w-full">Title</TableHead>
            <TableHead className="w-36">Status</TableHead>
            <TableHead className="w-28">Priority</TableHead>
            <TableHead className="w-40">Assignees</TableHead>
            <TableHead className="w-32">Due Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                No issues yet.
              </TableCell>
            </TableRow>
          ) : (
            tasks.map(task => (
              <TableRow key={task.id}>
                <TableCell>
                  <Link
                    href={`/projects/${task.project.slug}`}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                  >
                    {task.project.title}
                  </Link>
                </TableCell>
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
                  <Badge variant={statusVariant[task.status]}>
                    {statusLabel[task.status]}
                  </Badge>
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
                        <Badge key={a.user.name} variant="outline" className="text-xs">
                          {a.user.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
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
