import { prisma } from "@/lib/prisma";
import { Dot, Plus, SignalHigh, SignalMedium, SignalLow } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { Priority, Status } from "@prisma/client";

type Task = {
  id: number;
  title: string;
  priority: Priority;
  project: { title: string };
  assignees: { user: { name: string } }[];
};

const columns: { status: Status; label: string; color: string }[] = [
  { status: "backlog",   label: "Backlog",     color: "#94a3b8" },
  { status: "todo",      label: "Todo",        color: "#60a5fa" },
  { status: "inprogress",label: "In Progress", color: "#fbbf24" },
  { status: "blocked",   label: "Blocked",     color: "#f87171" },
  { status: "done",      label: "Done",        color: "#34d399" },
  { status: "shipped",   label: "Shipped",     color: "#a78bfa" },
];

const priorityIcon: Record<Priority, React.ReactNode> = {
  low:    <SignalLow  className="size-3.5 text-green-500" />,
  medium: <SignalMedium className="size-3.5 text-orange-500" />,
  high:   <SignalHigh  className="size-3.5 text-red-500" />,
};

function initials(name: string) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function KanItem({ task }: { task: Task }) {
  return (
    <Card className="w-full rounded-xl pt-0 pb-2 bg-background/80">
      <CardHeader className="items-start gap-1.5 px-4 pt-4">
        <p className="flex w-full items-center text-xs font-medium text-muted-foreground">
          <span className="truncate">{task.project.title}</span>
          <span className="ml-auto">{priorityIcon[task.priority]}</span>
        </p>
        <CardTitle className="text-sm leading-snug">{task.title}</CardTitle>
      </CardHeader>
      {task.assignees.length > 0 && (
        <CardContent className="px-4 pb-0">
          <AvatarGroup>
            {task.assignees.slice(0, 4).map(a => (
              <Avatar key={a.user.name} size="sm">
                <AvatarFallback className="text-[10px]">
                  {initials(a.user.name)}
                </AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
        </CardContent>
      )}
    </Card>
  );
}

function KanColumn({ label, color, tasks }: { label: string; color: string; tasks: Task[] }) {
  return (
    <Card className="rounded-2xl pt-2 flex flex-col min-w-0">
      <CardHeader className="flex flex-row items-center gap-0 pl-2 shrink-0">
        <div className="flex items-center gap-0 min-w-0">
          <Dot size={46} color={color} className="shrink-0" />
          <CardTitle className="-ml-2 text-sm truncate">{label}</CardTitle>
          <span className="ml-1.5 text-xs text-muted-foreground shrink-0">({tasks.length})</span>
        </div>
        <Plus size={16} className="ml-auto shrink-0 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3 px-2 py-3">
        {tasks.map(task => <KanItem key={task.id} task={task} />)}
        {tasks.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">No tickets</p>
        )}
      </CardContent>
    </Card>
  );
}

export default async function Board() {
  const tasks = await prisma.task.findMany({
    include: {
      project: { select: { title: true } },
      assignees: { include: { user: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  const grouped = Object.fromEntries(
    columns.map(col => [col.status, tasks.filter(t => t.status === col.status)])
  ) as unknown as Record<Status, Task[]>;

  return (
    <div className="flex w-full flex-col gap-6 px-6 py-8">
      <h1 className="text-4xl font-bold">Board</h1>
      <div className="grid grid-cols-6 gap-3 items-start">
        {columns.map(col => (
          <KanColumn
            key={col.status}
            label={col.label}
            color={col.color}
            tasks={grouped[col.status]}
          />
        ))}
      </div>
    </div>
  );
}
