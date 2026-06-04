import React, { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { TaskStatusBreakdown } from "../types";

interface TaskStatusChartProps {
  taskStatusBreakdown: TaskStatusBreakdown;
  totalTasks: number;
}

export function TaskStatusChart({
  taskStatusBreakdown,
  totalTasks,
}: TaskStatusChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const statusChartData = [
    {
      name: "To Do",
      value: taskStatusBreakdown.TODO,
      color: "#64748b",
    },
    {
      name: "In Progress",
      value: taskStatusBreakdown.IN_PROGRESS,
      color: "#3b82f6",
    },
    {
      name: "Completed",
      value: taskStatusBreakdown.DONE,
      color: "#10b981",
    },
  ].filter((item) => item.value > 0);

  const hasTasks = totalTasks > 0;

  return (
    <div className="border border-border/85 bg-card rounded-xl p-6 flex flex-col h-[380px] shadow-xs">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Task Status Overall
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Current task progression analyze
        </p>
      </div>

      <div className="flex-1 w-full relative min-h-0 flex items-center justify-center">
        {mounted && hasTasks && statusChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusChartData}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {statusChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                  borderRadius: "0.75rem",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span className="text-xs text-muted-foreground font-medium">
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-4">
            <ClipboardList className="w-8 h-8 text-muted-foreground/50 mb-2" />
            <span className="text-sm text-muted-foreground">
              No task data available
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
