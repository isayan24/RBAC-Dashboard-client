"use client";

import React from "react";
import { useAnalytics } from "@/features/analytics/hooks/useAnalytics";
import { Button } from "@/components/ui/button";
import { TaskStatusChart } from "@/features/analytics/components/task-status-chart";
import { ProjectProgressChart } from "@/features/analytics/components/project-progress-chart";
import { ProjectsAnalysisTable } from "@/features/analytics/components/projects-analysis-table";
import { RefreshCw, AlertTriangle, Loader2 } from "lucide-react";
import { SmallCards } from "@/features/analytics/components/small-cards";

export default function Page() {
  const { data, loading, error, refresh } = useAnalytics();

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] py-8 text-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
        <p className="text-sm text-muted-foreground">
          Loading dashboard analytics...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] py-8 text-center max-w-sm mx-auto">
        <AlertTriangle className="w-8 h-8 text-destructive mb-2" />
        <h3 className="text-sm font-semibold text-foreground">
          Failed to load analytics
        </h3>
        <p className="text-xs text-muted-foreground mt-1 mb-4">
          {error || "Something went wrong while fetching dashboard analytics."}
        </p>
        <Button variant="outline" size="sm" onClick={refresh}>
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Try Again
        </Button>
      </div>
    );
  }

  const { summary, projects } = data;

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real time insights, metrics, and project statuses
          </p>
        </div>
        <Button onClick={refresh} variant="outline" size="sm">
          <RefreshCw className="w-3 h-3 mr-1" /> Refresh
        </Button>
      </div>

      {/* Smalll Stats Cards */}
      <SmallCards summary={summary} />

      <div className="grid gap-6 md:grid-cols-2">
        <TaskStatusChart
          taskStatusBreakdown={summary.taskStatusBreakdown}
          totalTasks={summary.totalTasks}
        />
        <ProjectProgressChart projects={projects} />
      </div>

      {/* Projects Details */}
      <ProjectsAnalysisTable projects={projects} />
    </div>
  );
}
