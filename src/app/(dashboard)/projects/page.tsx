"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/features/auth/hooks/useUser";
import { useProjects } from "@/features/projects/hooks/useProjects";
import { ProjectList } from "@/features/projects/components/project-list";
import { CreateProjectDialog } from "@/features/projects/components/create-project-dialog";
import { DeleteProjectDialog } from "@/features/projects/components/delete-project-dialog";
import { deleteProject } from "@/features/projects/actions";
import { Project } from "@/features/projects/types";
import { Search, Plus } from "lucide-react";

export default function Page() {
  const user = useUser();
  const {
    projects,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    refresh,
  } = useProjects();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const canCreate = user?.role === "ADMIN" || user?.role === "STAFF";
  const isAdmin = user?.role === "ADMIN";

  const handleEditClick = (project: Project) => {
    setProjectToEdit(project);
    setIsCreateOpen(true);
  };

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await deleteProject(projectToDelete.id);
      if (res.success) {
        setIsDeleteOpen(false);
        setProjectToDelete(null);
        refresh();
      } else {
        alert(res.message || "Failed to delete project");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred while deleting the project");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCreateClick = () => {
    setProjectToEdit(null);
    setIsCreateOpen(true);
  };

  const handleDialogClose = () => {
    setIsCreateOpen(false);
    setProjectToEdit(null);
  };

  return (
    <div className="flex flex-col gap-6 pt-4">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage, assign, and track all role-based projects here.
          </p>
        </div>
        
        {canCreate && (
          <Button
            onClick={handleCreateClick}
            className="w-fit flex items-center gap-1.5 font-medium rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            id="create-project-btn"
          >
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        )}
      </div>

      {/* Filter and Search */}
      <div className="relative max-w-md w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-10 pr-4 w-full bg-input/40 border-border/80 focus-visible:bg-background rounded-2xl"
          id="project-search-input"
        />
      </div>

      {/* Projects List */}
      <ProjectList
        projects={projects}
        loading={loading}
        error={error}
        searchQuery={searchQuery}
        canCreate={canCreate}
        isAdmin={isAdmin}
        onCreateClick={handleCreateClick}
        onRetryClick={refresh}
        onEditProject={handleEditClick}
        onDeleteProject={handleDeleteClick}
      />

      {/* Create / Edit Project Modal */}
      <CreateProjectDialog
        isOpen={isCreateOpen}
        onClose={handleDialogClose}
        onSuccess={refresh}
        project={projectToEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteProjectDialog
        isOpen={isDeleteOpen}
        projectName={projectToDelete?.name || ""}
        onConfirm={handleDeleteConfirm}
        onClose={() => setIsDeleteOpen(false)}
        loading={deleteLoading}
      />
    </div>
  );
}
