import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q) return Response.json({ projects: [], tasks: [] });

  const [projects, tasks] = await Promise.all([
    prisma.project.findMany({
      where: { title: { contains: q, mode: "insensitive" } },
      select: { slug: true, title: true },
      take: 5,
    }),
    prisma.task.findMany({
      where: { title: { contains: q, mode: "insensitive" } },
      select: { id: true, title: true, project: { select: { slug: true } } },
      take: 5,
    }),
  ]);

  return Response.json({
    projects,
    tasks: tasks.map((t) => ({ id: t.id, title: t.title, projectSlug: t.project.slug })),
  });
}
