"use client";

import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Activity,
  Folder,
  House,
  List,
  Kanban,
  Users,
  Settings,
  Circle,
} from "lucide-react";
import Link from "next/link";

import type { Project } from "@prisma/client";
import { Skeleton } from "./ui/skeleton";

const sidebarWorkspace = [
  { url: "/", icon: House, label: "Dashboard" },
  { url: "/board", icon: Kanban, label: "Board" },
  { url: "/issues", icon: List, label: "My issues" },
  { url: "/projects", icon: Folder, label: "Projects" },
  { url: "/activity", icon: Activity, label: "Activity" },
];

const sidebarSettings = [
  { url: "/members", icon: Users, label: "Members" },
  { url: "/settings", icon: Settings, label: "Settings" },
];

export function AppSidebarClient({
  projects,
  loading,
}: {
  projects: Project[];
  loading: boolean;
}) {
  const pathname = usePathname();

  return (
    <Sidebar className="h-full">
      <SidebarContent className="h-full overflow-hidden">
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase text-base text-foreground">
            Application
          </SidebarGroupLabel>
          <SidebarMenu>
            {sidebarWorkspace.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild isActive={pathname === item.url}>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="uppercase text-base text-foreground">
            Projects
          </SidebarGroupLabel>
          {loading ? (
            <div className="flex flex-col gap-2 px-2">
              <Skeleton className="h-8 w-full bg-primary/50" />
              <Skeleton className="h-8 w-full bg-primary/50" />
            </div>
          ) : (
            <SidebarMenu>
              {projects.map((p) => (
                <SidebarMenuItem key={p.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === `/projects/${p.id}`}
                  >
                    <Link href={`/projects/${p.id}`}>
                      <Circle className="size-2 fill-current" />
                      <span>{p.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          )}
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="uppercase text-base text-foreground">
            Settings
          </SidebarGroupLabel>
          <SidebarMenu>
            {sidebarSettings.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild isActive={pathname === item.url}>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
