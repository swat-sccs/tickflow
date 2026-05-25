import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {prisma} from '@/lib/prisma'
import {
  LucideIcon,
  Plus,
  Globe,
  Keyboard,
  Server,
  BookText,
  Bot,
  Balloon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { NewProjectDialog } from "@/components/new-project-dialog";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

function CardImage(props: {
  icon: LucideIcon;
  name: string;
  title: string;
  description: string;
  value: number;
}) {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0 rounded-2xl">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <props.icon />
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">{props.name}</Badge>
        </CardAction>
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>{props.description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <ProgressDemo value={props.value} />
      </CardFooter>
    </Card>
  );
}

function ProgressDemo(props: { value: number }) {
  return <Progress value={props.value} className="w-[100%]" />;
}

export default async function Projects() {
  const [projects, users] = await Promise.all([
    prisma.project.findMany({ include: { tasks: { select: { status: true } } } }),
    prisma.user.findMany({ select: { id: true, name: true, email: true } }),
  ]);
  const totalTickets = projects.reduce((sum, p) => sum + p.tasks.length, 0);
  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex w-4/5 flex-col gap-6">
        <div className="flex gap-4 justify-between">
          <div>
            <h1 className="text-4xl pb-3">Projects</h1>
            <p className="text-secondary">
              {projects.length} {projects.length === 1 ? "project" : "projects"}. {totalTickets} total {totalTickets === 1 ? "ticket" : "tickets"} across the workspace.
            </p>
          </div>
          <div className="flex">
          <NewProjectDialog users={users}>
            <Button variant="default">
              <Plus />
              New Project
            </Button>
          </NewProjectDialog>
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-3 gap-6">
          {projects.map(item => {
            const done = item.tasks.filter(t => t.status === "done" || t.status === "shipped").length;
            const progress = item.tasks.length > 0 ? Math.round((done / item.tasks.length) * 100) : 0;
            return (
              <Link href={`/projects/${item.slug}`} key={item.id}>
                <CardImage
                  icon={Globe}
                  name={item.slug}
                  title={item.title}
                  description={item.description}
                  value={progress}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
