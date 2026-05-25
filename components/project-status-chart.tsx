"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type ProjectStat = {
  name: string;
  backlog: number;
  todo: number;
  inprogress: number;
  blocked: number;
  done: number;
  shipped: number;
};

const bars = [
  { key: "backlog",    color: "#94a3b8", label: "Backlog" },
  { key: "todo",       color: "#60a5fa", label: "Todo" },
  { key: "inprogress", color: "#fbbf24", label: "In Progress" },
  { key: "blocked",    color: "#f87171", label: "Blocked" },
  { key: "done",       color: "#34d399", label: "Done" },
  { key: "shipped",    color: "#a78bfa", label: "Shipped" },
] as const;

export function ProjectStatusChart({ data }: { data: ProjectStat[] }) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No projects yet.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
          cursor={{ fill: "rgba(255,255,255,0.05)" }}
        />
        <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
        {bars.map(b => (
          <Bar key={b.key} dataKey={b.key} name={b.label} fill={b.color} radius={[3, 3, 0, 0]} stackId="a" />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
