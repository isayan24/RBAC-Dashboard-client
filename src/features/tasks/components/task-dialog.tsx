"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Task, TaskStatus } from "../types";
import { Loader2, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assignmentId: string;
  task?: Task | null;
  createTaskFn: (
    formData: FormData,
  ) => Promise<{ success: boolean; message?: string }>;
  updateTaskFn: (
    id: string,
    formData: FormData,
  ) => Promise<{ success: boolean; message?: string }>;
}

export function TaskDialog({
  isOpen,
  onClose,
  assignmentId,
  task = null,
  createTaskFn,
  updateTaskFn,
}: TaskDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(
    null,
  );

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state for edit/create mode
  useEffect(() => {
    if (isOpen) {
      if (task) {
        setName(task.name);
        setDescription(task.description || "");
        setStatus(task.status);
        setAttachmentPreview(task.attachmentUrl);
        setAttachmentFile(null);
      } else {
        setName("");
        setDescription("");
        setStatus("TODO");
        setAttachmentPreview(null);
        setAttachmentFile(null);
      }
      setFormError("");
    }
  }, [task, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setFormError("File size must be less than 10MB.");
        return;
      }
      setAttachmentFile(file);
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setAttachmentPreview(url);
      } else {
        setAttachmentPreview(null);
      }
      setFormError("");
    }
  };

  const handleRemoveFile = () => {
    setAttachmentFile(null);
    if (attachmentPreview && !attachmentPreview.startsWith("http")) {
      URL.revokeObjectURL(attachmentPreview);
    }
    setAttachmentPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setStatus("TODO");
    setAttachmentFile(null);
    if (attachmentPreview && !attachmentPreview.startsWith("http")) {
      URL.revokeObjectURL(attachmentPreview);
    }
    setAttachmentPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFormError("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError("Task name is required.");
      return;
    }
    setFormError("");
    setFormLoading(true);

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    formData.append("status", status);
    formData.append("assignmentId", assignmentId);

    if (attachmentFile) {
      formData.append("attachment", attachmentFile);
    }

    try {
      let res;
      if (task) {
        res = await updateTaskFn(task.id, formData);
      } else {
        res = await createTaskFn(formData);
      }

      if (res.success) {
        handleClose();
      } else {
        setFormError(res.message || "Failed to submit task.");
      }
    } catch (err: any) {
      setFormError(
        err.message || "An error occurred while submitting the task.",
      );
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent showCloseButton={!formLoading} className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Add Task"}</DialogTitle>
          <DialogDescription>
            {task
              ? "Update task properties and attachments"
              : "Create a new task under this assignment"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup className="gap-5">
            {formError && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-2xl border border-destructive/20 font-medium">
                {formError}
              </div>
            )}

            <Field>
              <FieldLabel htmlFor="task-name">
                Task Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="task-name"
                placeholder="e.g. Implement Prisma migrations"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={formLoading}
                className="h-10 bg-input/40 border-border/80 rounded-2xl"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="task-desc">Description</FieldLabel>
              <textarea
                id="task-desc"
                placeholder="Details about task objectives, criteria..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={formLoading}
                rows={4}
                className="w-full rounded-2xl border border-border bg-input/40 px-3 py-2.5 text-sm transition-[color,box-shadow,background-color] outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="task-status">Status</FieldLabel>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                disabled={formLoading}
                className="w-full rounded-2xl border border-border bg-input/40 px-3 py-2.5 text-sm  outline-none placeholder:text-muted-foreground  cursor-pointer appearance-none text-foreground"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </Field>

            <Field className="gap-2">
              <FieldLabel>Attachment</FieldLabel>
              <input
                type="file"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
                id="task-attachment-input"
              />

              {!attachmentPreview && !attachmentFile ? (
                <label
                  htmlFor="task-attachment-input"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-border/70 hover:border-ring/50 bg-input/20 hover:bg-input/30 cursor-pointer rounded-2xl p-6 transition-all duration-200"
                >
                  <Upload className="w-8 h-8 text-muted-foreground/80 mb-2 transition-transform duration-200" />
                  <span className="text-sm font-medium text-foreground">
                    Click to upload file
                  </span>
                  <span className="text-xs text-muted-foreground mt-1 font-normal">
                    Any file type (Max 10MB)
                  </span>
                </label>
              ) : (
                <div className="flex items-center justify-between border border-border bg-input/20 p-3 rounded-2xl">
                  <div className="flex items-center gap-2 min-w-0">
                    {attachmentPreview ? (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border bg-muted flex-shrink-0">
                        <img
                          src={attachmentPreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center border border-border flex-shrink-0 text-xs font-semibold text-muted-foreground truncate">
                        FILE
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate max-w-[200px]">
                        {attachmentFile
                          ? attachmentFile.name
                          : task?.attachmentName || "Attachment"}
                      </p>
                      {attachmentFile && (
                        <p className="text-[10px] text-muted-foreground">
                          {(attachmentFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={handleRemoveFile}
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground hover:text-destructive cursor-pointer rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </Field>

            <DialogFooter className="mt-4 pt-4 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={formLoading}
                className="rounded-2xl cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={formLoading}
                className="rounded-2xl cursor-pointer flex items-center gap-1.5"
              >
                {formLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : task ? (
                  "Save Changes"
                ) : (
                  "Create Task"
                )}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
