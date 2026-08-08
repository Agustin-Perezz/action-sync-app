import type { Task } from "@/domain/entities/task.entity";

export interface DeleteTaskRepository {
  findById(id: string): Promise<Task | null>;
  delete(id: string): Promise<void>;
}
