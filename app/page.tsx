"use client";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Plus,
  SignalHigh,
  SignalLow,
  SignalMedium,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const table = [
  {
    key: "WEB",
    title: "Members directory page",
    status: "In progress",
    priority: "LOW",
    due: "May 8",
  },
  {
    key: "HACK",
    title: "Request money for hackathon from SBC",
    status: "In progress",
    priority: "HIGH",
    due: "May 1",
  },
];

const priorityIcons = {
  LOW: SignalLow,
  MEDIUM: SignalMedium,
  HIGH: SignalHigh,
} as const;

export function TableDemo() {
  return (
    <Table>
      <TableCaption>Assigned to you.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Project</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Due Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {table.map((item) => {
          const PriorityIcon =
            priorityIcons[item.priority as keyof typeof priorityIcons] ??
            SignalLow;

          return (
            <TableRow key={item.title}>
              <TableCell className="font-medium">{item.key}</TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-2">
                  <PriorityIcon className="size-4" aria-hidden="true" />
                  {item.priority}
                </span>
              </TableCell>
              <TableCell className="text-right">{item.due}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export function CardImage(props: { text: string; number: number }) {
  return (
    <Card className="mx-auto w-full max-w-sm pt-0">
      <CardHeader className="mt-5">
        <CardTitle className="text-secondary text-md">{props.text}</CardTitle>
        <CardDescription className="text-primary text-5xl">
          {props.number}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col w-4/5 h-9/10 gap-6">
      <div className="flex flex-col gap-4 justify-left">
        <h1 className="text-4xl">Hello, Damian.</h1>
        <p className="text-secondary">
          3 open issues on your plate, across 2 projects
        </p>
        <div className="flex gap-2">
          <Button variant="default">
            <Plus />
            New issue
          </Button>
          <Button variant="outline">
            View my issues
            <ArrowRight />
          </Button>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-6">
        <div className="flex">
          <CardImage text="Total open" number={28} />
          <CardImage text="Assigned to me" number={3} />
          <CardImage text="In progress" number={2} />
          <CardImage text="Closed" number={6} />
        </div>
        <div className="flex gap-2">
          <TableDemo />
          <TableDemo />
        </div>
      </div>
    </div>
  );
}
