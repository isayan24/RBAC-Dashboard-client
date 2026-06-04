import React, { useEffect, useState } from "react";
import { Folder } from "lucide-react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ProjectAnalytics } from "../types";

interface ProjectProgressChartProps {
  projects: ProjectAnalytics[];
}

export function ProjectProgressChart({ projects }: ProjectProgressChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const projectsChartData = projects.map((p) => ({
    name: p.name.length > 15 ? p.name.substring(0, 15) + "..." : p.name,
    fullName: p.name,
    Progress: p.progressPercentage,
  }));

  return (
    <div className="border border-border/85 bg-card rounded-xl p-6 flex flex-col h-[380px] shadow-xs">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Projects Progression
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Completion percentage around per project
        </p>
      </div>

      <div className="flex-1 w-full min-h-0">
        {mounted && projects.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={projectsChartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(var(--border), 0.3)"
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#888888", fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#888888", fontSize: 11 }}
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.03)" }}
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                  borderRadius: "0.75rem",
                }}
                formatter={(value) => [`${value}%`, "Progress"]}
              />
              <Bar
                dataKey="Progress"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                maxBarSize={45}
              >
                {projects.map((entry, index) => {
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.progressPercentage === 100 ? "#10b981" : "#3b82f6"
                      }
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-4 h-full">
            <Folder className="w-8 h-8 text-muted-foreground/50 mb-2" />
            <span className="text-sm text-muted-foreground">
              No projects available
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
