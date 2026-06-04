import { useState, useEffect, useCallback } from "react";
import { getProjectById } from "../actions";
import { Project } from "../types";

export const useProject = (id: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProjectDetails = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const res = await getProjectById(id);
      if (res.success && res.data) {
        setProject(res.data);
      } else {
        setError(res.message || "Failed to load project details");
      }
    } catch (err: any) {
      setError(
        err.message || "An error occurred while loading project details",
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProjectDetails();
  }, [fetchProjectDetails]);

  return {
    project,
    loading,
    error,
    refresh: fetchProjectDetails,
  };
};
