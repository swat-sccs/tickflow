import {
  Globe,
  Code2,
  Server,
  BookOpen,
  Bot,
  Users,
  Zap,
  Megaphone,
  Database,
  Shield,
  Rocket,
  Palette,
  GraduationCap,
  Briefcase,
  Cpu,
  Layers,
  Music,
  BarChart2,
  Wrench,
  FlaskConical,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const PROJECT_ICONS: Record<string, LucideIcon> = {
  Globe,
  Code2,
  Server,
  BookOpen,
  Bot,
  Users,
  Zap,
  Megaphone,
  Database,
  Shield,
  Rocket,
  Palette,
  GraduationCap,
  Briefcase,
  Cpu,
  Layers,
  Music,
  BarChart2,
  Wrench,
  FlaskConical,
};

export type ProjectIconName = keyof typeof PROJECT_ICONS;

export function ProjectIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = PROJECT_ICONS[name] ?? Globe;
  return <Icon className={className} />;
}
