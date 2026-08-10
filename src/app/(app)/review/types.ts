import type { TaskStatus } from "@/domain/entities/task-status.enum";

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  status: TaskStatus;
  trelloCardId: string | null;
};

export type Board = { id: string; name: string };
export type List = { id: string; name: string };
