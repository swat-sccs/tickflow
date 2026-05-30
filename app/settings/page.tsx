import { prisma } from "@/lib/prisma";
import { SettingsClient } from "@/components/settings-client";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [projectCount, memberCount, taskCount] = await Promise.all([
    prisma.project.count(),
    prisma.user.count(),
    prisma.task.count(),
  ]);

  return <SettingsClient stats={{ projectCount, memberCount, taskCount }} />;
}
