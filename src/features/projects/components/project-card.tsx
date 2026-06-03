import React from "react";
import { Project } from "../types";
import { Folder, Calendar, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

interface ProjectCardProps {
  project: Project;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ProjectCard({
  project,
  isAdmin = false,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-row items-center gap-4 border border-border bg-card rounded-xl p-4 transition-colors hover:bg-accent/40">
      {/* Left: Image */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-lg overflow-hidden bg-muted relative">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.name}
            width={300}
            height={300}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500/90 to-purple-600/90 flex items-center justify-center text-white">
            <Folder className="w-8 h-8 opacity-80" />
          </div>
        )}
      </div>

      {/* Middle: Title & Description */}
      <div className="flex flex-col flex-grow min-w-0 gap-1">
        <h3 className="font-semibold text-base sm:text-lg text-foreground truncate">
          {project.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description || "No description provided."}
        </p>
        {project.user && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <span className="font-medium text-foreground">
              {project.user.name}
            </span>
            <span>•</span>
            <span className="uppercase tracking-wider text-[10px] bg-muted px-1.5 py-0.5 rounded font-semibold">
              {project.user.role || "Staff"}
            </span>
          </div>
        )}
      </div>

      {/* Right: Date & Actions */}
      <div className="flex flex-col items-end shrink-0 gap-2 pl-2">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(project.createdAt)}</span>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onEdit) onEdit();
              }}
              className="text-muted-foreground hover:text-primary p-1 hover:bg-muted rounded transition-colors cursor-pointer"
              title="Edit Project"
              type="button"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onDelete) onDelete();
              }}
              className="text-muted-foreground hover:text-destructive p-1 hover:bg-muted rounded transition-colors cursor-pointer"
              title="Delete Project"
              type="button"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
