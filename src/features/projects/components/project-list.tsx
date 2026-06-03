import React from "react";
import { Project } from "../types";
import { ProjectCard } from "./project-card";
import { ProjectCardSkeleton } from "./project-card-skeleton";
import { Button } from "@/components/ui/button";
import { Folder, Plus } from "lucide-react";

interface ProjectListProps {
  projects: Project[];
  loading: boolean;
  error: string;
  searchQuery: string;
  canCreate: boolean;
  isAdmin?: boolean;
  onCreateClick: () => void;
  onRetryClick: () => void;
  onEditProject?: (project: Project) => void;
  onDeleteProject?: (project: Project) => void;
}

export function ProjectList({
  projects,
  loading,
  error,
  searchQuery,
  canCreate,
  isAdmin = false,
  onCreateClick,
  onRetryClick,
  onEditProject,
  onDeleteProject,
}: ProjectListProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((n) => (
          <ProjectCardSkeleton key={n} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-destructive/10 text-destructive border border-destructive/20 rounded-2xl max-w-lg mx-auto">
        <p className="font-semibold text-lg">Failed to load projects</p>
        <p className="text-sm mt-1 opacity-90">{error}</p>
        <Button onClick={onRetryClick} className="mt-4 rounded-2xl">
          Try Again
        </Button>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-card border border-border rounded-2xl text-center max-w-xl mx-auto my-8">
        <Folder className="w-12 h-12 text-muted-foreground/70 mb-4" />
        <h3 className="text-lg font-semibold text-foreground">No Projects Found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          {searchQuery
            ? "No projects match your search criteria. Try a different query."
            : "Start creating projects to assign team members and track tasks."}
        </p>
        {canCreate && !searchQuery && (
          <Button onClick={onCreateClick} className="mt-5 rounded-2xl flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            Create First Project
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          isAdmin={isAdmin}
          onEdit={onEditProject ? () => onEditProject(project) : undefined}
          onDelete={onDeleteProject ? () => onDeleteProject(project) : undefined}
        />
      ))}
    </div>
  );
}
