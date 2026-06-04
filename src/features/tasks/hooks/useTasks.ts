import { useState, useEffect, useCallback } from "react";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../actions";
import { Task } from "../types";

export const useTasks = (assignmentId?: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMutating, setIsMutating] = useState(false);

  const fetchTasks = useCallback(async () => {
    if (!assignmentId) return;
    setLoading(true);
    setError("");
    try {
      const res = await getAllTasks({ assignmentId });
      if (res.success && res.data) {
        setTasks(res.data || []);
      } else {
        setError(res.message || "Failed to load tasks.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while loading tasks.");
    } finally {
      setLoading(false);
    }
  }, [assignmentId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const create = async (formData: FormData) => {
    setIsMutating(true);
    try {
      if (assignmentId && !formData.has("assignmentId")) {
        formData.append("assignmentId", assignmentId);
      }
      const res = await createTask(formData);
      if (res.success) {
        await fetchTasks();
        return { success: true, data: res.data };
      }
      return { success: false, message: res.message || "Failed to create task." };
    } catch (err: any) {
      return { success: false, message: err.message || "An error occurred while creating task." };
    } finally {
      setIsMutating(false);
    }
  };

  const update = async (id: string, formData: FormData) => {
    setIsMutating(true);
    try {
      const res = await updateTask(id, formData);
      if (res.success) {
        await fetchTasks();
        return { success: true, data: res.data };
      }
      return { success: false, message: res.message || "Failed to update task." };
    } catch (err: any) {
      return { success: false, message: err.message || "An error occurred while updating task." };
    } finally {
      setIsMutating(false);
    }
  };

  const remove = async (id: string) => {
    setIsMutating(true);
    try {
      const res = await deleteTask(id);
      if (res.success) {
        await fetchTasks();
        return { success: true };
      }
      return { success: false, message: res.message || "Failed to delete task." };
    } catch (err: any) {
      return { success: false, message: err.message || "An error occurred while deleting task." };
    } finally {
      setIsMutating(false);
    }
  };

  return {
    tasks,
    loading,
    error,
    isMutating,
    refresh: fetchTasks,
    create,
    update,
    remove,
  };
};
