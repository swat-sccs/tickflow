"use client";

import { Dot, MessageSquare, Signal, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";

const dummyCards = [
  { title: "Backlog" },
  { title: "Todo" },
  { title: "In Progress" },
  { title: "Done" },
  { title: "Blocked" },
  { title: "Shipped" },
];
const dummyItems = [
  {
    title: "Implement login page",
    description:
      "Create a responsive login page with email and password fields.",
    project: "Club Website",
  },
  {
    title: "Design database schema",
    description:
      "Design the database schema for the new project management feature.",
    project: "Spring Hackathon",
  },
  {
    title: "Set up CI/CD pipeline",
    description:
      "Set up a CI/CD pipeline for automated testing and deployment.",
    project: "Club Website",
  },
];

//TODO: FIX TYPES with items from actual data
function KanCard({ title, items }: { title: string; items: any[] }) {
  return (
    <Card className="h-full shrink-0 rounded-2xl pt-2">
      <CardHeader className="flex flex-row items-center gap-0 pl-2">
        <div className="flex items-center justify-start gap-0">
          <Dot size={50} color="lightblue" />
          <CardTitle className="-ml-2.5">{title}</CardTitle>
        </div>
        <Plus size={20} color="lightgray" className="ml-auto" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-2 py-4">
        {items.map((item) => (
          <KanItem
            key={item.title}
            title={item.title}
            description={item.description}
            project={item.project}
          />
        ))}
      </CardContent>
    </Card>
  );
}
function KanItem({
  title,
  project,
  description,
}: {
  title: string;
  project: string;
  description: string;
}) {
  return (
    <Card className="w-80 shrink-0 rounded-xl pt-0 pb-2 bg-background/80 ">
      <CardHeader className="items-start gap-2 px-4 pt-4">
        <p className="text-left text-sm font-medium text-muted-foreground justify-center align-center  flex">
          <p>{project}</p>
          <Signal size={15} className="ml-auto" color="orange" />
        </p>
        <CardTitle className="text-left text-md leading-tight text-white">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-2">
        <div className="flex justify-between align-center">
          <AvatarGroup className="">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage
                src="https://github.com/maxleiter.png"
                alt="@maxleiter"
              />
              <AvatarFallback>LR</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage
                src="https://github.com/evilrabbit.png"
                alt="@evilrabbit"
              />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
            <AvatarGroupCount>+3</AvatarGroupCount>
          </AvatarGroup>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MessageSquare size={15} />
            <div>2</div>
          </div>
        </div>
      </CardContent>
      {/* pinned bottom right of card item*/}
    </Card>
  );
}

export default function Home() {
  return (
    <div className="flex h-full w-full min-w-0 flex-col gap-6 overflow-hidden px-6 py-6">
      <h1 className="text-4xl font-bold">Board</h1>

      <div className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden pb-2">
        <div className="flex h-11/12 w-max gap-5">
          {dummyCards.map((card) => (
            <KanCard key={card.title} title={card.title} items={dummyItems} />
          ))}
        </div>
      </div>
    </div>
  );
}
