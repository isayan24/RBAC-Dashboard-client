"use client";

import React, { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import { Task, TaskStatus } from "../types";
import { TaskDialog } from "./task-dialog";
import { DeleteTaskDialog } from "./delete-task-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ClipboardList,
  Plus,
  Pencil,
  Trash2,
  Paperclip,
  Download,
} from "lucide-react";
import Image from "next/image";

interface TaskListProps {
  assignmentId: string;
}

export function TaskList({ assignmentId }: TaskListProps) {
  const { tasks, loading, error, create, update, remove } =
    useTasks(assignmentId);

  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleEditClick = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskOpen(true);
  };

  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await remove(taskToDelete.id);
      if (res.success) {
        setIsDeleteOpen(false);
        setTaskToDelete(null);
      } else {
        alert(res.message || "Failed to delete task.");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred while deleting the task.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCreateClick = () => {
    setTaskToEdit(null);
    setIsTaskOpen(true);
  };

  const handleToggleStatus = async (task: Task, checked: boolean) => {
    const newStatus: TaskStatus = checked ? "DONE" : "TODO";
    const formData = new FormData();
    formData.append("status", newStatus);
    const res = await update(task.id, formData);
    if (!res.success) {
      alert(res.message || "Failed to update task status");
    }
  };

  const getStatusBadgeClass = (status: TaskStatus) => {
    switch (status) {
      case "DONE":
        return "bg-green-500/10 text-green-700 border-green-500/20";
      case "IN_PROGRESS":
        return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      case "TODO":
      default:
        return "bg-muted text-muted-foreground border-border/50";
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="pl-6 mt-2 space-y-2">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="pl-6 pr-2 py-3 mt-2 border-l-2 border-border/60 bg-muted/10 space-y-3 rounded-r-lg">
      <div className="flex items-center justify-between gap-4">
        <h5 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
          <ClipboardList className="w-4 h-4 text-muted-foreground" />
          Tasks List ({tasks.length})
        </h5>
        <Button
          onClick={handleCreateClick}
          size="sm"
          variant="outline"
          className="h-7 text-xs px-2.5 rounded-lg flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Task
        </Button>
      </div>

      {error && (
        <p className="text-xs text-destructive bg-destructive/10 p-2.5 rounded-lg border border-destructive/20 font-medium">
          {error}
        </p>
      )}

      {tasks.length === 0 ? (
        <p className="text-xs text-muted-foreground py-2 italic">
          No tasks added for this assignment yet.
        </p>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => {
            return (
              <div
                key={task.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between border border-border/60 bg-card p-3 rounded-lg gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 flex-shrink-0">
                    <Checkbox
                      className="rounded-full size-5 cursor-pointer"
                      checked={task.status === "DONE"}
                      onCheckedChange={(checked) =>
                        handleToggleStatus(task, !!checked)
                      }
                    />
                  </div>
                  <div className="min-w-0">
                    <h6 className="text-sm font-medium text-foreground truncate">
                      {task.name}
                    </h6>
                    {task.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {/* Status Badge */}
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getStatusBadgeClass(
                          task.status,
                        )}`}
                      >
                        {task.status.replace("_", " ")}
                      </span>

                      {/* Attachment display */}
                      {task.attachmentUrl && (
                        <div className="flex items-center gap-2">
                          <div className="relative w-8 h-8 rounded border border-border bg-muted overflow-hidden flex-shrink-0">
                            <Image
                              src={task.attachmentUrl}
                              alt={task.attachmentName || "Attachment"}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <a
                            href={task.attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5 truncate max-w-[50px]"
                            title={task.attachmentName || "Download Attachment"}
                          >
                            <Download className="w-3 h-3" />
                            {task.attachmentName || "attachment"}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <button
                    onClick={() => handleEditClick(task)}
                    className="cursor-pointer hover:scale-105"
                    title="Edit Task"
                    type="button"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(task)}
                    className="text-muted-foreground hover:text-destructive p-1.5  cursor-pointer"
                    title="Delete Task"
                    type="button"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Creation & Edit Modal */}
      <TaskDialog
        isOpen={isTaskOpen}
        onClose={() => setIsTaskOpen(false)}
        assignmentId={assignmentId}
        task={taskToEdit}
        createTaskFn={create}
        updateTaskFn={update}
      />

      {/* Task Deletion Warning Dialog */}
      <DeleteTaskDialog
        isOpen={isDeleteOpen}
        taskName={taskToDelete?.name || ""}
        onConfirm={handleDeleteConfirm}
        onClose={() => setIsDeleteOpen(false)}
        loading={deleteLoading}
      />
    </div>
  );
}
