import { useState, useEffect, useCallback } from "react";
import { getUsers } from "../actions";
import { User } from "../types";

export const useStaffUsers = (enabled = true) => {
  const [staff, setStaff] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStaff = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError("");
    try {
      const res = await getUsers();
      if (res.success && res.data) {
        // Filter down to users with role STAFF
        const staffUsers = res.data.filter((u: User) => u.role === "STAFF");
        setStaff(staffUsers);
      } else {
        setError(res.message || "Failed to load staff list.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while loading staff.");
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  return {
    staff,
    loading,
    error,
    refresh: fetchStaff,
  };
};
