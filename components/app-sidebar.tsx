import { prisma } from "@/lib/prisma";
import { AppSidebarClient } from "@/components/app-sidebar-client";

export async function AppSidebar() {
  const projects = await prisma.project.findMany({
    select: { slug: true, title: true },
    orderBy: { id: "asc" },
  });

  return <AppSidebarClient projects={projects} />;
}
