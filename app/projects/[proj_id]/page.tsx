import { Button } from "@/components/ui/button";
import {
  LucideIcon,
  SignalHigh,
  SignalLow,
  SignalMedium,
  User,
  Users,
  Plus,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CardImage } from "@/app/page";
import { notFound } from "next/navigation";

type projectInfo = {
  slug: string;
  title: string;
  descr: string;
  numbers: {
    backlog: number;
    todo: number;
    inProgress: number;
    done: number;
    blocked: number;
    shipped: number;
  };
  team: {
    name: string;
    role: "lead" | "member";
  }[];
  issue: {
    title: string;
    status: string;
    priority: LucideIcon;
    assignee: {
      name: string;
      icon: LucideIcon;
    };
    due: Date;
  }[];
};

const projects: projectInfo[] = [
  {
    slug: "web",
    title: "Club Website",
    descr: "Main marketing and public-facing website for the club.",
    numbers: {
      backlog: 5,
      todo: 3,
      inProgress: 4,
      done: 8,
      blocked: 1,
      shipped: 12,
    },
    team: [
      { name: "Alice Johnson", role: "lead" },
      { name: "Bob Smith", role: "member" },
      { name: "Clara Lee", role: "member" },
    ],
    issue: [
      {
        title: "Fix login redirect bug",
        status: "inProgress",
        priority: SignalHigh,
        assignee: { name: "Alice Johnson", icon: User },
        due: new Date("2026-05-10"),
      },
      {
        title: "Redesign dashboard layout",
        status: "todo",
        priority: SignalMedium,
        assignee: { name: "Bob Smith", icon: User },
        due: new Date("2026-05-20"),
      },
      {
        title: "Write unit tests for auth module",
        status: "backlog",
        priority: SignalLow,
        assignee: { name: "Clara Lee", icon: User },
        due: new Date("2026-06-01"),
      },
    ],
  },
  {
    slug: "hack",
    title: "Spring Hackathon",
    descr: "Spring hackathon platform for submissions, judging, and prizes.",
    numbers: {
      backlog: 2,
      todo: 6,
      inProgress: 2,
      done: 15,
      blocked: 0,
      shipped: 20,
    },
    team: [
      { name: "David Park", role: "lead" },
      { name: "Eva Martinez", role: "member" },
    ],
    issue: [
      {
        title: "Migrate database to PostgreSQL",
        status: "inProgress",
        priority: SignalHigh,
        assignee: { name: "Eva Martinez", icon: User },
        due: new Date("2026-05-15"),
      },
      {
        title: "Add export to CSV feature",
        status: "done",
        priority: SignalLow,
        assignee: { name: "David Park", icon: User },
        due: new Date("2026-04-30"),
      },
    ],
  },
  {
    slug: "infra",
    title: "Server Infrastructure",
    descr:
      "Server infrastructure, CI/CD pipelines, and cloud resource management.",
    numbers: {
      backlog: 8,
      todo: 4,
      inProgress: 3,
      done: 10,
      blocked: 2,
      shipped: 7,
    },
    team: [
      { name: "James Chen", role: "lead" },
      { name: "Sara Osei", role: "member" },
      { name: "Liam Torres", role: "member" },
    ],
    issue: [
      {
        title: "Set up staging environment",
        status: "inProgress",
        priority: SignalHigh,
        assignee: { name: "James Chen", icon: User },
        due: new Date("2026-05-12"),
      },
      {
        title: "Rotate API keys and secrets",
        status: "todo",
        priority: SignalHigh,
        assignee: { name: "Liam Torres", icon: User },
        due: new Date("2026-05-08"),
      },
      {
        title: "Optimize Docker image sizes",
        status: "backlog",
        priority: SignalMedium,
        assignee: { name: "Sara Osei", icon: User },
        due: new Date("2026-06-10"),
      },
    ],
  },
  {
    slug: "docs",
    title: "Documentation",
    descr: "Onboarding documentation, internal wikis, and member guides.",
    numbers: {
      backlog: 3,
      todo: 5,
      inProgress: 1,
      done: 6,
      blocked: 0,
      shipped: 4,
    },
    team: [
      { name: "Mia Nguyen", role: "lead" },
      { name: "Omar Haddad", role: "member" },
    ],
    issue: [
      {
        title: "Write onboarding guide for new members",
        status: "inProgress",
        priority: SignalMedium,
        assignee: { name: "Mia Nguyen", icon: User },
        due: new Date("2026-05-18"),
      },
      {
        title: "Add search to docs site",
        status: "todo",
        priority: SignalMedium,
        assignee: { name: "Omar Haddad", icon: User },
        due: new Date("2026-05-25"),
      },
      {
        title: "Archive old meeting notes",
        status: "backlog",
        priority: SignalLow,
        assignee: { name: "Mia Nguyen", icon: User },
        due: new Date("2026-06-15"),
      },
    ],
  },
];

function IssuesTable({ issues }: { issues: projectInfo["issue"] }) {
  const priorityColorClass = {
    SignalHigh: "text-red-500",
    SignalMedium: "text-orange-500",
    SignalLow: "text-green-500",
  } as const;

  return (
    <Table>
      <TableCaption>Recent Issues</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Assignee</TableHead>
          <TableHead>Due Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {issues.map((issue) => (
          <TableRow key={`${issue.title}-${issue.due.toISOString()}`}>
            <TableCell>{issue.title}</TableCell>
            <TableCell>{issue.status}</TableCell>
            <TableCell>
              <issue.priority
                className={`size-4 ${priorityColorClass[issue.priority.name as keyof typeof priorityColorClass] ?? "text-muted-foreground"}`}
              />
            </TableCell>
            <TableCell>
              <div>
                <p>{issue.assignee.name}</p>
                <p>{issue.assignee.icon.name}</p>
              </div>
            </TableCell>
            <TableCell>{issue.due.toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function TeamTable({
  team,
  issues,
}: {
  team: projectInfo["team"];
  issues: projectInfo["issue"];
}) {
  const openIssuesByMember = issues.reduce<Record<string, number>>(
    (acc, issue) => {
      const isOpen = issue.status !== "done" && issue.status !== "shipped";
      if (!isOpen) return acc;
      const assigneeName = issue.assignee.name;
      acc[assigneeName] = (acc[assigneeName] ?? 0) + 1;
      return acc;
    },
    {},
  );

  return (
    <Table>
      <TableCaption>Team members and their open issues</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Member</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Open Issues</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {team.map((member) => (
          <TableRow key={member.name}>
            <TableCell>{member.name}</TableCell>
            <TableCell>{member.role}</TableCell>
            <TableCell>{openIssuesByMember[member.name] ?? 0}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

type ProjectItemProps = {
  params: Promise<{
    proj_id: string;
  }>;
};

export default async function ProjectItem({ params }: ProjectItemProps) {
  const { proj_id } = await params;
  const project = projects.find((item) => item.slug === proj_id);

  if (!project) {
    notFound();
  }

  return (
    <div className="w-[90%] flex flex-col gap-10 mx-auto">
      <div>
        <span className="text-secondary">projects</span> &gt; {project.slug}
      </div>
      <div className="flex w-full justify-between">
        <div>
          <h1 className="text-3xl">{project.title}</h1>
          <p className="text-secondary">{project.descr}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-background text-foreground border">
            <Users />
            Invite
          </Button>
          <Button>
            <Plus />
            New Issue
          </Button>
        </div>
      </div>
      <div className="flex">
        <CardImage text="Backlog" number={project.numbers.backlog} />
        <CardImage text="To Do" number={project.numbers.todo} />
        <CardImage text="In Progress" number={project.numbers.inProgress} />
        <CardImage text="Done" number={project.numbers.done} />
        <CardImage text="Blocked" number={project.numbers.blocked} />
        <CardImage text="Shipped" number={project.numbers.shipped} />
      </div>
      <div>
        <IssuesTable issues={project.issue} />
      </div>
      <div>
        <TeamTable team={project.team} issues={project.issue} />
      </div>
    </div>
  );
}
