import { useEffect, useState } from "react";
import { getCurrentUser } from "../actions";
import { User } from "../types";

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await getCurrentUser();
        if (res.success && res.data) {
          setUser(res.data);
        }
      } catch (err) {
        console.error("Failed to load user", err);
      }
    }
    loadUser();
  }, []);

  return user;
};
