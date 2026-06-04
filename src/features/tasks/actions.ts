import API from "@/lib/axios";

export async function createTask(data: FormData) {
  const response = await API.post("/task", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function updateTask(id: string, data: FormData) {
  const response = await API.patch(`/task/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function deleteTask(id: string) {
  const response = await API.delete(`/task/${id}`);
  return response.data;
}

export async function getAllTasks(params: {
  assignmentId?: string;
  status?: string;
}) {
  const response = await API.get("/task", { params });
  return response.data;
}

export async function getTaskById(id: string) {
  const response = await API.get(`/task/${id}`);
  return response.data;
}
