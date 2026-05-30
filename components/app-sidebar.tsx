"use client";

import { useEffect, useState } from "react";

import { AppSidebarClient } from "@/components/app-sidebar-client";
import type { Project } from "@prisma/client";

export function AppSidebar() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      try {
        const response = await fetch("/api/sidebar-projects", {
          cache: "no-store",
        });
        const data = (await response.json()) as Project[];

        if (!cancelled) {
          setProjects(data);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  return <AppSidebarClient projects={projects} loading={loading} />;
}
