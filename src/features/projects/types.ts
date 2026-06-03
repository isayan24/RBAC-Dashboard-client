export interface Project {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
    email: string;
    role?: string;
  };
}

export interface CreateProjectType {
  name: string;
  description?: string;
  image?: File | null;
}
