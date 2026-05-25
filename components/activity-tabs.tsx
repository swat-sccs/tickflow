"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Status } from "@prisma/client";
import { StatusSelect } from "@/components/status-select";
import Link from "next/link";

const statusVariant: Record<Status, "secondary" | "outline" | "destructive" | "default"> = {
  backlog:    "outline",
  todo:       "secondary",
  inprogress: "default",
  done:       "secondary",
  blocked:    "destructive",
  shipped:    "secondary",
};

const statusLabel: Record<Status, string> = {
  backlog:    "Backlog",
  todo:       "Todo",
  inprogress: "In Progress",
  done:       "Done",
  blocked:    "Blocked",
  shipped:    "Shipped",
};

type RecentTask = {
  id: number;
  title: string;
  status: Status;
  createdAt: Date;
  project: { title: string; slug: string };
  assignees: { user: { name: string } }[];
};

type UserStat = {
  id: number;
  name: string;
  open: number;
  inprogress: number;
  done: number;
  blocked: number;
  total: number;
};

function initials(name: string) {
  return name.split(" ").map(p => p[0]).join("").toUpperCase().slice(0, 2);
}

function timeAgo(date: Date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function ActivityTabs({
  recentTasks,
  userStats,
}: {
  recentTasks: RecentTask[];
  userStats: UserStat[];
}) {
  return (
    <Tabs defaultValue="recent" className="w-full">
      <TabsList>
        <TabsTrigger value="recent">Recent</TabsTrigger>
        <TabsTrigger value="fullboard">Full Board</TabsTrigger>
      </TabsList>

      <TabsContent value="recent" className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-full">Title</TableHead>
              <TableHead>Project</TableHead>
              <TableHead className="w-36">Status</TableHead>
              <TableHead className="w-40">Assignees</TableHead>
              <TableHead className="w-28">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                  No activity yet.
                </TableCell>
              </TableRow>
            ) : (
              recentTasks.map(task => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>
                    <Link
                      href={`/projects/${task.project.slug}`}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                    >
                      {task.project.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <StatusSelect taskId={task.id} status={task.status} />
                  </TableCell>
                  <TableCell>
                    {task.assignees.length === 0 ? (
                      <span className="text-sm text-muted-foreground">—</span>
                    ) : (
                      <div className="flex gap-1">
                        {task.assignees.map(a => (
                          <Avatar key={a.user.name} className="size-6">
                            <AvatarFallback className="text-[10px]">
                              {initials(a.user.name)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {timeAgo(task.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TabsContent>

      <TabsContent value="fullboard" className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Person</TableHead>
              <TableHead className="w-24 text-center">Open</TableHead>
              <TableHead className="w-28 text-center">In Progress</TableHead>
              <TableHead className="w-24 text-center">Done</TableHead>
              <TableHead className="w-24 text-center">Blocked</TableHead>
              <TableHead className="w-24 text-center">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userStats.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                  No members yet.
                </TableCell>
              </TableRow>
            ) : (
              userStats.map(u => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-7">
                        <AvatarFallback className="text-xs">{initials(u.name)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-sm">{u.open}</TableCell>
                  <TableCell className="text-center text-sm">{u.inprogress}</TableCell>
                  <TableCell className="text-center text-sm">{u.done}</TableCell>
                  <TableCell className="text-center">
                    {u.blocked > 0 ? (
                      <Badge variant="destructive" className="text-xs">{u.blocked}</Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center text-sm font-medium">{u.total}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TabsContent>
    </Tabs>
  );
}
