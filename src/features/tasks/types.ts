export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
  id: string;
  name: string;
  description: string | null;
  status: TaskStatus;
  attachmentUrl: string | null;
  attachmentName: string | null;
  assignmentId: string;
  createdAt: string;
  updatedAt: string;
  assignment?: {
    name: string;
    description: string | null;
  };
}

export interface CreateTaskPayload {
  assignmentId: string;
  name: string;
  description?: string;
  status?: TaskStatus;
}
