import { useState, useEffect } from "react";
import { getAllProjects } from "../actions";
import { Project } from "../types";

export const useProjects = (initialSearch = "") => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const fetchProjects = async (search = "") => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllProjects(search);
      if (res.success && res.data) {
        setProjects(res.data.projects || []);
      } else {
        setError(res.message || "Failed to retrieve projects.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProjects(searchQuery);
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return {
    projects,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    refresh: () => fetchProjects(searchQuery),
  };
};
