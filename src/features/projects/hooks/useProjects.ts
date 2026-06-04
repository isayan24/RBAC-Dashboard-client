import { useState, useEffect } from "react";
import { getAllProjects } from "../actions";
import { Project } from "../types";

export const useProjects = (initialSearch = "", initialPage = 1, initialLimit = 6) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProjects = async (search = "", pageNum = 1, limitNum = 6) => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllProjects(search, pageNum, limitNum);
      if (res.success && res.data) {
        setProjects(res.data.projects || []);
        setTotalItems(res.data.totalItems || 0);
        setTotalPages(res.data.totalPages || 1);
      } else {
        setError(res.message || "Failed to retrieve projects");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProjects(searchQuery, page, limit);
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, page, limit]);

  return {
    projects,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    limit,
    setLimit,
    totalItems,
    totalPages,
    refresh: () => fetchProjects(searchQuery, page, limit),
  };
};
