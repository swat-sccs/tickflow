"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  ArrowRight,
  Globe,
  Keyboard,
  Server,
  BookText,
  Bot,
  Balloon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
  icon?;
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
  const [progress, setProgress] = React.useState(props.value);

  return <Progress value={progress} className="w-[100%]" />;
}

export default function Projects() {
  return (
    <div className="flex flex-col w-4/5 h-9/10 gap-6">
      <div className="flex gap-4 justify-between">
        <div>
          <h1 className="text-4xl pb-3">Projects</h1>
          <p className="text-secondary">
            6 projects. 34 total tickets across the workspace.
          </p>
        </div>
        <Button variant="default">
          <Plus />
          New issue
        </Button>
      </div>
      <Separator />
      <div className="grid grid-cols-3 gap-6">
        <CardImage
          icon={Globe}
          name="WEB"
          title="Club Website"
          description="Main marketing site and member portal. Next.js + Vercel."
          value={12}
        />
        <CardImage
          icon={Keyboard}
          name="HACK"
          title="Spring Hackathon"
          description="Main marketing site and member portal. Next.js + Vercel."
          value={24}
        />
        <CardImage
          icon={Server}
          name="INFRA"
          title="Server Infrastructure"
          description="Main marketing site and member portal. Next.js + Vercel."
          value={36}
        />
        <CardImage
          icon={BookText}
          name="DOCS"
          title="Onboarding Docs"
          description="Main marketing site and member portal. Next.js + Vercel."
          value={48}
        />
        <CardImage
          icon={Bot}
          name="DISCORD"
          title="Discord Bot"
          description="Main marketing site and member portal. Next.js + Vercel."
          value={60}
        />
        <CardImage
          icon={Balloon}
          name="SOCIAL"
          title="Workshop Series"
          description="Main marketing site and member portal. Next.js + Vercel."
          value={72}
        />
      </div>
    </div>
  );
}
