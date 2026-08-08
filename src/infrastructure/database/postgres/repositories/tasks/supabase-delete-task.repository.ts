import type { SupabaseClient } from "@supabase/supabase-js";
import type { DeleteTaskRepository } from "@/application/use-cases/tasks/delete-task/delete-task.repository.interface";
import type { Task } from "@/domain/entities/task.entity";
import type { Database } from "../../database.types";
import { taskMapper } from "../../mappers/task.mapper";

export class SupabaseDeleteTaskRepository implements DeleteTaskRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async findById(id: string): Promise<Task | null> {
    const { data, error } = await this.supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch task: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return taskMapper.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from("tasks").delete().eq("id", id);

    if (error) {
      throw new Error(`Failed to delete task: ${error.message}`);
    }
  }
}
