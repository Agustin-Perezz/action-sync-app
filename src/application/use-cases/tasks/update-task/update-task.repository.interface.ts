import type { Task } from "@/domain/entities/task.entity";

export interface UpdateTaskRepository {
  findById(id: string): Promise<Task | null>;
  update(id: string, fields: Partial<Task>): Promise<Task>;
}
