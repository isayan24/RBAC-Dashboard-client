"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser } from "@/features/auth/hooks/useUser";
import { useProject } from "@/features/projects/hooks/useProject";
import { useAssignments } from "@/features/assignments/hooks/useAssignments";
import { Assignment } from "@/features/assignments/types";
import { AssignmentDialog } from "@/features/assignments/components/assignment-dialog";
import { DeleteAssignmentDialog } from "@/features/assignments/components/delete-assignment-dialog";
import { AssignmentList } from "@/features/assignments/components/assignment-list";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, AlertCircle, Plus } from "lucide-react";
import Image from "next/image";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);

  const user = useUser();
  const {
    project,
    loading: projectLoading,
    error: projectError,
  } = useProject(id);
  const {
    assignments,
    loading: assignmentsLoading,
    error: assignmentsError,
    taskStatus,
    setTaskStatus,
    create: createAssignment,
    update: updateAssignment,
    remove: removeAssignment,
  } = useAssignments(id);

  // Dialog States
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [assignmentToEdit, setAssignmentToEdit] = useState<Assignment | null>(
    null,
  );

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] =
    useState<Assignment | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const isAdmin = user?.role === "ADMIN";

  const handleEditAssignment = (assignment: Assignment) => {
    setAssignmentToEdit(assignment);
    setIsAssignOpen(true);
  };

  const handleDeleteAssignmentClick = (assignment: Assignment) => {
    setAssignmentToDelete(assignment);
    setIsDeleteOpen(true);
  };

  const handleDeleteAssignmentConfirm = async () => {
    if (!assignmentToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await removeAssignment(assignmentToDelete.id);
      if (res.success) {
        setIsDeleteOpen(false);
        setAssignmentToDelete(null);
      } else {
        alert(res.message || "Failed to delete assignment.");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred while deleting the assignment.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAddAssignmentClick = () => {
    setAssignmentToEdit(null);
    setIsAssignOpen(true);
  };

  const handleDialogClose = () => {
    setIsAssignOpen(false);
    setAssignmentToEdit(null);
  };

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

  const pageLoading = projectLoading || assignmentsLoading;
  const pageError = projectError || assignmentsError;

  if (pageLoading && !project) {
    return <SkeletonState />;
  }

  if (pageError || !project) {
    return <ErrorState pageError={pageError} router={router} />;
  }

  return (
    <div className="space-y-6 py-4">
      {/* Back button */}
      <div>
        <button
          onClick={() => router.push("/projects")}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Projects
        </button>
      </div>

      {/* Project Banner Display */}
      {project.image && (
        <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden border border-border">
          <Image
            src={project.image}
            alt={project.name}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Project Info Block */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {project.name}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Created on {formatDate(project.createdAt)} by{" "}
              {project.user?.name || "Admin"}
            </p>
          </div>
          {isAdmin && (
            <Button
              onClick={handleAddAssignmentClick}
              className="flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Assignment
            </Button>
          )}
        </div>
        <div className="mt-4 border-t border-border pt-4">
          <h2 className="text-sm font-semibold text-foreground">Description</h2>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed whitespace-pre-line">
            {project.description || "No description provided."}
          </p>
        </div>
      </div>

      {/* Assignments Section */}
      <AssignmentList
        assignments={assignments}
        assignmentsLoading={assignmentsLoading}
        taskStatus={taskStatus}
        setTaskStatus={setTaskStatus}
        isAdmin={isAdmin}
        onAddAssignmentClick={handleAddAssignmentClick}
        onEditAssignment={handleEditAssignment}
        onDeleteAssignmentClick={handleDeleteAssignmentClick}
      />

      {/* Assignment Add / Edit Dialog */}
      <AssignmentDialog
        isOpen={isAssignOpen}
        onClose={handleDialogClose}
        projectId={id}
        assignment={assignmentToEdit}
        createAssignmentFn={createAssignment}
        updateAssignmentFn={updateAssignment}
      />

      {/* Assignment Delete Dialog */}
      <DeleteAssignmentDialog
        isOpen={isDeleteOpen}
        assignmentName={assignmentToDelete?.name || ""}
        onConfirm={handleDeleteAssignmentConfirm}
        onClose={() => setIsDeleteOpen(false)}
        loading={deleteLoading}
      />
    </div>
  );
}

const SkeletonState = () => {
  return (
    <div className="space-y-6 py-4">
      <div className="h-4 w-20 bg-muted animate-pulse rounded" />
      <div className="border border-border rounded-lg p-6 space-y-4 bg-card">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
        <div className="border-t border-border pt-4 space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-16 w-full rounded-lg" />
      </div>
    </div>
  );
};

const ErrorState = ({ pageError, router }: any) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center max-w-md mx-auto min-h-[50vh]">
      <AlertCircle className="w-12 h-12 text-destructive mb-4" />
      <h3 className="text-lg font-bold text-foreground">
        Failed to load project
      </h3>
      <p className="text-sm text-muted-foreground mt-1">
        {pageError || "Project details could not be found."}
      </p>
      <div className="flex gap-2 mt-6">
        <Button variant="outline" onClick={() => router.push("/projects")}>
          Go Back
        </Button>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    </div>
  );
};
