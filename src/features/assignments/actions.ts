import API from "@/lib/axios";
import { CreateAssignmentPayload } from "./types";

export async function createAssignment(data: CreateAssignmentPayload) {
  const response = await API.post("/assignment", data);
  return response.data;
}

export async function updateAssignment(
  id: string,
  data: Partial<CreateAssignmentPayload>
) {
  const response = await API.patch(`/assignment/${id}`, data);
  return response.data;
}

export async function deleteAssignment(id: string) {
  const response = await API.delete(`/assignment/${id}`);
  return response.data;
}

export async function getAllAssignments(params: {
  projectId?: string;
  userId?: string;
  search?: string;
  taskStatus?: string;
}) {
  const response = await API.get("/assignment", { params });
  return response.data;
}

export async function getAssignmentById(id: string) {
  const response = await API.get(`/assignment/${id}`);
  return response.data;
}
