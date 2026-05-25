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
    <Card className="relative mx-auto w-full max-w-sm pt-0">
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
  const projects = await prisma.project.findMany()
  console.log("here it isssss: ", projects);
  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex w-4/5 flex-col gap-6">
        <div className="flex gap-4 justify-between">
          <div>
            <h1 className="text-4xl pb-3">Projects</h1>
            <p className="text-secondary">
              6 projects. 34 total tickets across the workspace.
            </p>
          </div>
          <div className="flex">
          <NewProjectDialog>
            <Button variant="default">
              <Plus />
              New Project
            </Button>
          </NewProjectDialog>
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-3 gap-6">
          {projects.map(item => (
        <Link href={`/projects/${item.slug}`} key={item.id}>
          <CardImage
            icon={Globe}
            name={item.slug}
            title={item.title}
            description={item.description}
            value={12}
          />
        </Link>
))}
        </div>
      </div>
    </div>
  );
}
