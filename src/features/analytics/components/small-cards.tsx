import React from "react";
import { Folder, ClipboardList, CheckCircle, TrendingUp } from "lucide-react";
import { AnalyticsSummary } from "../types";

interface SmallCardsProps {
  summary: AnalyticsSummary;
}

export function SmallCards({ summary }: SmallCardsProps) {
  const taskProgress =
    summary.totalTasks > 0
      ? Math.round((summary.completedTasks / summary.totalTasks) * 100)
      : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Projects Card */}
      <div className="border border-border/80 bg-card rounded-xl p-6 shadow-xs relative overflow-hidden transition-all duration-200 hover:border-border">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-muted-foreground">
            Total Projects
          </span>
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
            <Folder className="size-4" />
          </div>
        </div>
        <div className="mt-4">
          <h2 className="text-3xl font-bold text-foreground">
            {summary.totalProjects}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="text-green-600 dark:text-green-400 font-medium">
              {summary.completedProjects}
            </span>{" "}
            completed /{" "}
            <span className="text-amber-600 dark:text-amber-400 font-medium">
              {summary.pendingProjects}
            </span>{" "}
            pending
          </p>
        </div>
      </div>

      {/* Total Assignments Card */}
      <div className="border border-border/80 bg-card rounded-xl p-6 shadow-xs relative overflow-hidden transition-all duration-200 hover:border-border">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-muted-foreground">
            Total Assignments
          </span>
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600">
            <ClipboardList className="size-4" />
          </div>
        </div>
        <div className="mt-4">
          <h2 className="text-3xl font-bold text-foreground">
            {summary.totalAssignments}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Grouped task set to users
          </p>
        </div>
      </div>

      {/* Total Tasks Card */}
      <div className="border border-border/80 bg-card rounded-xl p-6 shadow-xs relative overflow-hidden transition-all duration-200 hover:border-border">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-muted-foreground">
            Total Tasks
          </span>
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600">
            <CheckCircle className="size-4" />
          </div>
        </div>
        <div className="mt-4">
          <h2 className="text-3xl font-bold text-foreground">
            {summary.totalTasks}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="text-green-600 dark:text-green-400 font-medium">
              {summary.completedTasks}
            </span>{" "}
            done / {summary.pendingTasks} pending
          </p>
        </div>
      </div>

      {/* Overall Completion Card */}
      <div className="border border-border/80 bg-card rounded-xl p-6 shadow-xs relative overflow-hidden transition-all duration-200 hover:border-border">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-muted-foreground">
            Overall Completion
          </span>
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
            <TrendingUp className="size-4" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-baseline gap-1">
            <h2 className="text-3xl font-bold text-foreground">
              {taskProgress}%
            </h2>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${taskProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
