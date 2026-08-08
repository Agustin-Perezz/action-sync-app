import type { Task } from "@/domain/entities/task.entity";

export interface AddManualTaskRepository {
  save(task: Task): Promise<Task>;
}
