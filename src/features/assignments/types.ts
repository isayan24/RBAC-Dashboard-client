export interface Assignment {
  id: string;
  name: string;
  description: string | null;
  projectId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  project?: {
    name: string;
    description: string | null;
  };
  user?: {
    name: string;
    email: string;
    role?: string;
  };
  _count?: {
    tasks: number;
  };
}

export interface CreateAssignmentPayload {
  projectId: string;
  userId: string;
  name: string;
  description?: string;
}
