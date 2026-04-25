"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarGroupAction,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Activity, ChevronDown, Folder, House, List, Plus, VenusAndMars } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"
import Image from 'next/image'

const sidebarWorkspace = [
    {
        url: '/dashboard',
        icon: House,
        label: 'Dashboard', 
    },
    {
        url: '/issues',
        icon: List,
        label: 'My issues', 
    },
    {
        url: '/projects',
        icon: Folder,
        label: 'Projects', 
    },
    {
        url: '/activity',
        icon: Activity,
        label: 'Activity', 
    }
]

const sidebarProjects = [
    {
        url: '/projects',
        icon: VenusAndMars,
        label: 'Club Website', 
    },
    {
        url: '/projects',
        icon: VenusAndMars,
        label: 'Spring Hackathon', 
    },
    {
        url: '/projects',
        icon: VenusAndMars,
        label: 'Server Infrastructure', 
    },
    {
        url: '/projects',
        icon: VenusAndMars,
        label: 'Onboarding Docs', 
    },
]

export function AppSidebar() {
    const {
        state,
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar,
    } = useSidebar()


  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
            <SidebarGroupLabel className="uppercase text-base text-[#272b2a]/50">Application</SidebarGroupLabel>
            <SidebarMenu>
                {sidebarWorkspace.map(item => 
                    <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton asChild>
                            <a href={item.url}>
                            <item.icon />
                            <span>{item.label}</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                )}
            </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
            <SidebarGroupLabel className="uppercase text-base text-[#272b2a]/50">Projects</SidebarGroupLabel>
            <SidebarMenu>
                {sidebarProjects.map(item => 
                    <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton asChild>
                            <a href={item.url}>
                            <item.icon />
                            <span>{item.label}</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                )}
            </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}