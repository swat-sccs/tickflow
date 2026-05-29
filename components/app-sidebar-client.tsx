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

const sidebarWorkspace = [
  { url: "/",         icon: House,    label: "Dashboard" },
  { url: "/board",    icon: Kanban,   label: "Board" },
  { url: "/issues",   icon: List,     label: "My issues" },
  { url: "/projects", icon: Folder,   label: "Projects" },
  { url: "/activity", icon: Activity, label: "Activity" },
];

const sidebarSettings = [
  { url: "/members",  icon: Users,    label: "Members" },
  { url: "/settings", icon: Settings, label: "Settings" },
];

type Project = { slug: string; title: string };

export function AppSidebarClient({ projects }: { projects: Project[] }) {
  const pathname = usePathname();

  return (
    <Sidebar className="h-full">
      <SidebarContent className="h-full overflow-hidden">
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase text-base text-foreground">
            Application
          </SidebarGroupLabel>
          <SidebarMenu>
            {sidebarWorkspace.map(item => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild isActive={pathname === item.url}>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="uppercase text-base text-foreground">
            Projects
          </SidebarGroupLabel>
          <SidebarMenu>
            {projects.map(p => (
              <SidebarMenuItem key={p.slug}>
                <SidebarMenuButton asChild isActive={pathname === `/projects/${p.slug}`}>
                  <a href={`/projects/${p.slug}`}>
                    <Circle className="size-2 fill-current" />
                    <span>{p.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            {projects.length === 0 && (
              <p className="px-2 text-xs text-muted-foreground">No projects yet.</p>
            )}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="uppercase text-base text-foreground">
            Settings
          </SidebarGroupLabel>
          <SidebarMenu>
            {sidebarSettings.map(item => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild isActive={pathname === item.url}>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
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
