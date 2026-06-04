import { useState, useEffect, useCallback } from "react";
import {
  getAllAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from "../actions";
import { Assignment } from "../types";

export const useAssignments = (projectId: string) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMutating, setIsMutating] = useState(false);
  const [taskStatus, setTaskStatus] = useState<string>("");

  const fetchAssignments = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError("");
    try {
      const params: { projectId: string; taskStatus?: string } = { projectId };
      if (taskStatus && taskStatus !== "ALL") {
        params.taskStatus = taskStatus;
      }
      const res = await getAllAssignments(params);
      if (res.success && res.data) {
        setAssignments(res.data.assignments || []);
      } else {
        setError(res.message || "Failed to load assignments.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while loading assignments.");
    } finally {
      setLoading(false);
    }
  }, [projectId, taskStatus]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const create = async (name: string, description: string, userId: string) => {
    setIsMutating(true);
    try {
      const res = await createAssignment({
        projectId,
        userId,
        name,
        description,
      });
      if (res.success) {
        await fetchAssignments();
        return { success: true };
      }
      return { success: false, message: res.message || "Failed to create assignment." };
    } catch (err: any) {
      return { success: false, message: err.message || "An error occurred while creating assignment." };
    } finally {
      setIsMutating(false);
    }
  };

  const update = async (id: string, name: string, description: string, userId: string) => {
    setIsMutating(true);
    try {
      const res = await updateAssignment(id, {
        name,
        description,
        userId,
      });
      if (res.success) {
        await fetchAssignments();
        return { success: true };
      }
      return { success: false, message: res.message || "Failed to update assignment." };
    } catch (err: any) {
      return { success: false, message: err.message || "An error occurred while updating assignment." };
    } finally {
      setIsMutating(false);
    }
  };

  const remove = async (id: string) => {
    setIsMutating(true);
    try {
      const res = await deleteAssignment(id);
      if (res.success) {
        await fetchAssignments();
        return { success: true };
      }
      return { success: false, message: res.message || "Failed to delete assignment." };
    } catch (err: any) {
      return { success: false, message: err.message || "An error occurred while deleting assignment." };
    } finally {
      setIsMutating(false);
    }
  };

  return {
    assignments,
    loading,
    error,
    isMutating,
    taskStatus,
    setTaskStatus,
    refresh: fetchAssignments,
    create,
    update,
    remove,
  };
};

