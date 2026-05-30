import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";
import { BoardClient } from "@/components/board-client";
import { Suspense } from "react";
import { BoardLoading } from "./board-loading";
export const dynamic = "force-dynamic";

const columns: { status: Status; label: string; color: string }[] = [
  { status: "backlog", label: "Backlog", color: "#94a3b8" },
  { status: "todo", label: "Todo", color: "#60a5fa" },
  { status: "inprogress", label: "In Progress", color: "#fbbf24" },
  { status: "blocked", label: "Blocked", color: "#f87171" },
  { status: "done", label: "Done", color: "#34d399" },
  { status: "shipped", label: "Shipped", color: "#a78bfa" },
];

export default async function Board() {
  const tasks = await prisma.task.findMany({
    select: {
      id: true,
      title: true,
      priority: true,
      status: true,
      project: { select: { title: true } },
      assignees: { select: { user: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex w-full flex-col gap-6 px-6 py-8">
      <h1 className="text-4xl font-bold">Board</h1>
      <Suspense fallback={<BoardLoading />}>
        <BoardClient tasks={tasks} columns={columns} />
      </Suspense>
    </div>
  );
}
