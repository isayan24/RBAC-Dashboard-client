import { useState, useEffect, useCallback } from "react";
import { getDashboardAnalytics } from "../actions";
import { DashboardAnalyticsData } from "../types";

export const useAnalytics = () => {
  const [data, setData] = useState<DashboardAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getDashboardAnalytics();
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setError(res.message || "Failed to fetch dashboard analytics.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching analytics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    data,
    loading,
    error,
    refresh: fetchAnalytics,
  };
};
