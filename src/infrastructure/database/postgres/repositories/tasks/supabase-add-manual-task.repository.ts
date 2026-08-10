import type { SupabaseClient } from "@supabase/supabase-js";
import type { AddManualTaskRepository } from "@/application/use-cases/tasks/add-manual-task/add-manual-task.repository.interface";
import type { Task } from "@/domain/entities/task.entity";
import type { Database } from "../../database.types";
import { taskMapper } from "../../mappers/task.mapper";

export class SupabaseAddManualTaskRepository
  implements AddManualTaskRepository
{
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async save(task: Task): Promise<Task> {
    const payload = taskMapper.toPersistence(task);

    const { data, error } = await this.supabase
      .from("tasks")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      throw new Error(`Failed to save task: ${error.message}`);
    }

    return taskMapper.toDomain(data);
  }
}
