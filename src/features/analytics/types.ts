export interface TaskStatusBreakdown {
  TODO: number;
  IN_PROGRESS: number;
  DONE: number;
}

export interface AnalyticsSummary {
  totalProjects: number;
  completedProjects: number;
  pendingProjects: number;
  totalAssignments: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  taskStatusBreakdown: TaskStatusBreakdown;
}

export interface ProjectAnalytics {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  totalAssignments: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  isCompleted: boolean;
  progressPercentage: number;
}

export interface DashboardAnalyticsData {
  summary: AnalyticsSummary;
  projects: ProjectAnalytics[];
}
