import API from "@/lib/axios";
import { LoginPayload, RegisterPayload } from "./types";

export async function registerUser(data: RegisterPayload) {
  const response = await API.post("/auth/register", data);
  return response.data;
}

export async function loginUser(data: LoginPayload) {
  const response = await API.post("/auth/login", data);

  // If login is successful, save the token to localStorage
  if (response.data.success && response.data.data?.accessToken) {
    localStorage.setItem("token", response.data.data.accessToken);
  }

  return response.data;
}

export async function logoutUser() {
  try {
    const response = await API.post("/auth/logout");
    return response.data;
  } finally {
    localStorage.removeItem("token");
  }
}

export async function getCurrentUser() {
  const response = await API.get("/me");
  return response.data;
}

export async function refreshSession() {
  const response = await API.post("/auth/refresh");

  if (response.data.success && response.data.data?.accessToken) {
    localStorage.setItem("token", response.data.data.accessToken);
  }

  return response.data;
}
