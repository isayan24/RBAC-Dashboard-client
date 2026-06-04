import React from "react";
import { Assignment } from "../types";
import { User, ClipboardList, Pencil, Trash2 } from "lucide-react";

interface AssignmentCardProps {
  assignment: Assignment;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function AssignmentCard({
  assignment,
  isAdmin = false,
  onEdit,
  onDelete,
}: AssignmentCardProps) {
  return (
    <div className="flex flex-row items-center justify-between border border-border/80 bg-card hover:bg-card/75 rounded-xl p-4 gap-4 transition-colors">
      <div className="flex flex-col min-w-0 gap-1 flex-grow">
        <h4 className="font-semibold text-base text-foreground truncate">
          {assignment.name}
        </h4>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {assignment.description || "No description provided."}
        </p>
        
        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            <span className="font-medium text-foreground">{assignment.user?.name || "Unassigned"}</span>
            {assignment.user?.email && (
              <span className="text-[10px] text-muted-foreground opacity-80">({assignment.user.email})</span>
            )}
          </div>
          
          <div className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded text-[10px] font-medium">
            <ClipboardList className="w-3.5 h-3.5 text-muted-foreground" />
            <span>{assignment._count?.tasks || 0} Tasks</span>
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onEdit) onEdit();
            }}
            className="text-muted-foreground hover:text-primary p-1.5 hover:bg-muted rounded transition-colors cursor-pointer"
            title="Edit Assignment"
            type="button"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onDelete) onDelete();
            }}
            className="text-muted-foreground hover:text-destructive p-1.5 hover:bg-muted rounded transition-colors cursor-pointer"
            title="Delete Assignment"
            type="button"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
