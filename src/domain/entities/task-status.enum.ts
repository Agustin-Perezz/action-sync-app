export const TASK_STATUS = {
  DRAFT: "draft",
  SYNCED: "synced",
} as const;

export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];
