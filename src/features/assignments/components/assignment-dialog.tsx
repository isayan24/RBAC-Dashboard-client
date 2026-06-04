"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useUser } from "@/features/auth/hooks/useUser";
import { useStaffUsers } from "@/features/auth/hooks/useStaffUsers";
import { Assignment } from "../types";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  assignment?: Assignment | null;
  createAssignmentFn: (
    name: string,
    description: string,
    userId: string,
  ) => Promise<{ success: boolean; message?: string }>;
  updateAssignmentFn: (
    id: string,
    name: string,
    description: string,
    userId: string,
  ) => Promise<{ success: boolean; message?: string }>;
}

export function AssignmentDialog({
  isOpen,
  onClose,
  projectId,
  assignment = null,
  createAssignmentFn,
  updateAssignmentFn,
}: AssignmentDialogProps) {
  const user = useUser();
  const {
    staff: staffUsers,
    loading: usersLoading,
    error: usersError,
  } = useStaffUsers(isOpen);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState("");

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const isAdmin = user?.role === "ADMIN";

  // Sync state for edit/create mode
  useEffect(() => {
    if (isOpen) {
      if (assignment) {
        setName(assignment.name);
        setDescription(assignment.description || "");
        setUserId(assignment.userId);
      } else {
        setName("");
        setDescription("");
        setUserId("");
      }
      setFormError("");
    }
  }, [assignment, isOpen]);

  const handleClose = () => {
    setName("");
    setDescription("");
    setUserId("");
    setFormError("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      setFormError("Unauthorized: Only administrators can modify assignments.");
      return;
    }
    if (!name.trim()) {
      setFormError("Assignment name is required.");
      return;
    }
    if (!userId) {
      setFormError("Please select a staff member to assign.");
      return;
    }
    setFormError("");
    setFormLoading(true);

    try {
      let res;
      if (assignment) {
        res = await updateAssignmentFn(
          assignment.id,
          name.trim(),
          description.trim(),
          userId,
        );
      } else {
        res = await createAssignmentFn(name.trim(), description.trim(), userId);
      }

      if (res.success) {
        handleClose();
      } else {
        setFormError(res.message || "Failed to submit assignment.");
      }
    } catch (err: any) {
      setFormError(
        err.message || "An error occurred while submitting the assignment.",
      );
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent showCloseButton={!formLoading} className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {assignment ? "Edit Assignment" : "Add Assignment"}
          </DialogTitle>
          <DialogDescription>
            {assignment
              ? "Modify assignment details or reassign staff"
              : "Create a new assignment and assign a staff member"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup className="gap-5">
            {formError && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-2xl border border-destructive/20 font-medium">
                {formError}
              </div>
            )}

            {usersError && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-2xl border border-destructive/20 font-medium">
                {usersError}
              </div>
            )}

            {!isAdmin && (
              <div className="p-3 text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 font-medium">
                You are viewing this dialog as a read-only user. You cannot submit changes.
              </div>
            )}

            <Field>
              <FieldLabel htmlFor="assignment-name">
                Assignment Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="assignment-name"
                placeholder="e.g. Frontend Wireframing"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={formLoading || !isAdmin}
                className="h-10 bg-input/40 border-border/80 rounded-2xl"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="assignment-desc">Description</FieldLabel>
              <textarea
                id="assignment-desc"
                placeholder="Details or deliverables required for this assignment..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={formLoading || !isAdmin}
                rows={4}
                className="w-full rounded-2xl border border-border bg-input/40 px-3 py-2.5 text-sm transition-[color,box-shadow,background-color] outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="assignment-staff">
                Assign Staff <span className="text-destructive">*</span>
              </FieldLabel>
              <div className="relative">
                <select
                  id="assignment-staff"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  disabled={formLoading || usersLoading || !isAdmin}
                  required
                  className="w-full rounded-2xl border border-border bg-input/40 px-3 py-2.5 text-sm transition-[color,box-shadow,background-color] outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 appearance-none text-foreground"
                >
                  <option value="" className="text-muted-foreground">Select a staff member...</option>
                  {staffUsers.map((u) => (
                    <option key={u.id} value={u.id} className="text-foreground">
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
                {usersLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
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
              {isAdmin && (
                <Button
                  type="submit"
                  disabled={formLoading || usersLoading}
                  className="rounded-2xl cursor-pointer flex items-center gap-1.5"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    assignment ? "Save Changes" : "Add Assignment"
                  )}
                </Button>
              )}
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}

