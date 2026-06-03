export type Role = "ADMIN" | "STAFF";

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  name: string;
  password: string;
  role?: Role;
}
