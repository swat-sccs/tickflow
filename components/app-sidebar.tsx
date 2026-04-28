"use client";

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
  VenusAndMars,
  Kanban,
} from "lucide-react";

const sidebarWorkspace = [
  {
    url: "/",
    icon: House,
    label: "Dashboard",
  },
  {
    url: "/board",
    icon: Kanban,
    label: "Board",
  },
  {
    url: "/issues",
    icon: List,
    label: "My issues",
  },
  {
    url: "/projects",
    icon: Folder,
    label: "Projects",
  },
  {
    url: "/activity",
    icon: Activity,
    label: "Activity",
  },
];

const sidebarProjects = [
  {
    url: "/projects",
    icon: VenusAndMars,
    label: "Club Website",
  },
  {
    url: "/projects",
    icon: VenusAndMars,
    label: "Spring Hackathon",
  },
  {
    url: "/projects",
    icon: VenusAndMars,
    label: "Server Infrastructure",
  },
  {
    url: "/projects",
    icon: VenusAndMars,
    label: "Onboarding Docs",
  },
];

export function AppSidebar() {
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
                <SidebarMenuButton asChild>
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
            {sidebarProjects.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild>
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
