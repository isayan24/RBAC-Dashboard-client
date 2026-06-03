import API from "@/lib/axios";
import { CreateProjectType } from "./types";

export async function createProject(data: CreateProjectType) {
  const formData = new FormData();
  formData.append("name", data.name);

  if (data.description) {
    formData.append("description", data.description);
  }

  if (data.image) {
    formData.append("image", data.image);
  }

  const response = await API.post("/project", formData);
  return response.data;
}

export async function getAllProjects(search?: string) {
  const params: any = {};

  if (search) {
    params.search = search;
  }

  const response = await API.get("/project/all", {
    params,
  });
  return response.data;
}

export async function getProjectById(id: string) {
  const response = await API.get(`/project/${id}`);
  return response.data;
}

export async function updateProject(id: string, data: CreateProjectType) {
  const formData = new FormData();
  formData.append("name", data.name);

  if (data.description !== undefined) {
    formData.append("description", data.description);
  }

  if (data.image) {
    formData.append("image", data.image);
  }

  const response = await API.patch(`/project/${id}`, formData);
  return response.data;
}

export async function deleteProject(id: string) {
  const response = await API.delete(`/project/${id}`);
  return response.data;
}
