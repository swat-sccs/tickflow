"use client";

import { useOptimistic, useTransition } from "react";
import { Status } from "@prisma/client";
import { updateTaskStatus } from "@/actions/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";

const statusConfig: Record<
  Status,
  { label: string; dot: string; variant: "secondary" | "outline" | "destructive" | "default" }
> = {
  backlog:    { label: "Backlog",     dot: "#94a3b8", variant: "outline" },
  todo:       { label: "Todo",        dot: "#60a5fa", variant: "secondary" },
  inprogress: { label: "In Progress", dot: "#fbbf24", variant: "default" },
  blocked:    { label: "Blocked",     dot: "#f87171", variant: "destructive" },
  done:       { label: "Done",        dot: "#34d399", variant: "secondary" },
  shipped:    { label: "Shipped",     dot: "#a78bfa", variant: "secondary" },
};

const allStatuses = Object.keys(statusConfig) as Status[];

export function StatusSelect({ taskId, status }: { taskId: number; status: Status }) {
  const [pending, startTransition] = useTransition();
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(status);

  const cfg = statusConfig[optimisticStatus];

  function handleSelect(newStatus: Status) {
    if (newStatus === optimisticStatus) return;
    startTransition(async () => {
      setOptimisticStatus(newStatus);
      await updateTaskStatus(taskId, newStatus);
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          disabled={pending}
        >
          <Badge variant={cfg.variant} className={pending ? "opacity-60" : ""}>
            {cfg.label}
          </Badge>
          <ChevronDown className="size-3 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {allStatuses.map(s => {
          const opt = statusConfig[s];
          return (
            <DropdownMenuItem
              key={s}
              onSelect={() => handleSelect(s)}
              className="flex items-center gap-2"
            >
              <span
                className="size-2 rounded-full shrink-0"
                style={{ backgroundColor: opt.dot }}
              />
              <span className="text-sm">{opt.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
