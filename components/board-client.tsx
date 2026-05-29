"use client";

import { useState, useRef } from "react";
import { Dot, Plus, SignalHigh, SignalMedium, SignalLow } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { Priority, Status } from "@prisma/client";
import { updateTaskStatus } from "@/actions/actions";

type Task = {
  id: number;
  title: string;
  priority: Priority;
  status: Status;
  project: { title: string };
  assignees: { user: { name: string } }[];
};

type Column = { status: Status; label: string; color: string };

const priorityIcon: Record<Priority, React.ReactNode> = {
  low:    <SignalLow  className="size-3.5 text-green-500" />,
  medium: <SignalMedium className="size-3.5 text-orange-500" />,
  high:   <SignalHigh  className="size-3.5 text-red-500" />,
};

function initials(name: string) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function KanItem({ task, onDragStart }: { task: Task; onDragStart: (task: Task) => void }) {
  return (
    <Card
      className="w-full rounded-xl pt-0 pb-2 bg-background/80 cursor-grab active:cursor-grabbing active:opacity-50"
      draggable
      onDragStart={() => onDragStart(task)}
    >
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

function KanColumn({
  label, color, tasks, status, onDragStart, onDrop,
}: {
  label: string;
  color: string;
  tasks: Task[];
  status: Status;
  onDragStart: (task: Task) => void;
  onDrop: (toStatus: Status) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <Card
      className={`rounded-2xl pt-2 flex flex-col min-w-0 transition-all ${isDragOver ? "ring-2 ring-primary/50 bg-primary/5" : ""}`}
      onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={() => { setIsDragOver(false); onDrop(status); }}
    >
      <CardHeader className="flex flex-row items-center gap-0 pl-2 shrink-0">
        <div className="flex items-center gap-0 min-w-0">
          <Dot size={46} color={color} className="shrink-0" />
          <CardTitle className="-ml-2 text-sm truncate">{label}</CardTitle>
          <span className="ml-1.5 text-xs text-muted-foreground shrink-0">({tasks.length})</span>
        </div>
        <Plus size={16} className="ml-auto shrink-0 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3 px-2 py-3 min-h-16">
        {tasks.map(task => (
          <KanItem key={task.id} task={task} onDragStart={onDragStart} />
        ))}
        {tasks.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">No tickets</p>
        )}
      </CardContent>
    </Card>
  );
}

export function BoardClient({ tasks, columns }: {
  tasks: Task[];
  columns: Column[];
}) {
  const [grouped, setGrouped] = useState<Record<Status, Task[]>>(
    () => Object.fromEntries(
      columns.map(col => [col.status, tasks.filter(t => t.status === col.status)])
    ) as Record<Status, Task[]>
  );

  const draggedTask = useRef<Task | null>(null);

  function handleDragStart(task: Task) {
    draggedTask.current = task;
  }

  async function handleDrop(toStatus: Status) {
    const task = draggedTask.current;
    if (!task || task.status === toStatus) return;
    draggedTask.current = null;

    const fromStatus = task.status;

    setGrouped(prev => {
      const next = { ...prev };
      next[fromStatus] = prev[fromStatus].filter(t => t.id !== task.id);
      next[toStatus] = [...prev[toStatus], { ...task, status: toStatus }];
      return next;
    });

    await updateTaskStatus(task.id, toStatus);
  }

  return (
    <div className="grid grid-cols-6 gap-3 items-start">
      {columns.map(col => (
        <KanColumn
          key={col.status}
          label={col.label}
          color={col.color}
          tasks={grouped[col.status]}
          status={col.status}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
}
