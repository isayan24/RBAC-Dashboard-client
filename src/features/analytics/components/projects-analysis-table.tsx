import React from "react";
import { Folder } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProjectAnalytics } from "../types";

interface ProjectsAnalysisTableProps {
  projects: ProjectAnalytics[];
}

export function ProjectsAnalysisTable({
  projects,
}: ProjectsAnalysisTableProps) {
  const router = useRouter();

  return (
    <div className="border border-border/80 bg-card rounded-xl p-6 shadow-xs">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Projects Detailed Analysis
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Task count details and progress stats for each project
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/projects")}
        >
          Manage Projects
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No projects available.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground font-medium text-xs uppercase">
                <th className="pb-3 font-semibold">Project Name</th>
                <th className="pb-3 font-semibold">Assignments</th>
                <th className="pb-3 font-semibold">Completed Tasks</th>
                <th className="pb-3 font-semibold">Pending Tasks</th>
                <th className="pb-3 font-semibold">Progress</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {projects.map((proj) => (
                <tr
                  key={proj.id}
                  className="hover:bg-muted/10 transition-colors"
                >
                  <td className="py-4 font-medium text-foreground max-w-[200px] truncate">
                    <div className="flex items-center gap-3">
                      {proj.image ? (
                        <div className="relative w-8 h-8 rounded border border-border bg-muted overflow-hidden shrink-0">
                          <Image
                            src={proj.image}
                            alt={proj.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded border border-border bg-muted shrink-0 flex items-center justify-center">
                          <Folder className="w-4 h-4 text-muted-foreground/60" />
                        </div>
                      )}
                      <span
                        className="font-semibold block truncate"
                        title={proj.name}
                      >
                        {proj.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-muted-foreground">
                    {proj.totalAssignments} assignments
                  </td>
                  <td className="py-4 text-green-600 dark:text-green-400 font-medium">
                    {proj.completedTasks} done
                  </td>
                  <td className="py-4 text-muted-foreground">
                    {proj.pendingTasks} pending
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <span className="font-medium text-xs w-9">
                        {proj.progressPercentage}%
                      </span>
                      <div className="w-24 bg-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            proj.progressPercentage === 100
                              ? "bg-green-500"
                              : "bg-blue-500"
                          }`}
                          style={{ width: `${proj.progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/projects/${proj.id}`)}
                    >
                      View details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
