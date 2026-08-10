import type { SupabaseClient } from "@supabase/supabase-js";
import type { UpdateTaskRepository } from "@/application/use-cases/tasks/update-task/update-task.repository.interface";
import type { Task } from "@/domain/entities/task.entity";
import type { Database } from "../../database.types";
import type { TaskUpdate } from "../../entities/task.entity";
import { taskMapper } from "../../mappers/task.mapper";

// ponytail: Partial<Task> only carries title/description/dueDate (the editable
// fields — status/trelloCardId are managed by sync). Map the present keys to
// their snake_case columns; absent keys are omitted so Supabase PATCHes only
// the changed columns.
type EditableTaskFields = Partial<{
  title: string;
  description: string;
  dueDate: string | null;
}>;

export class SupabaseUpdateTaskRepository implements UpdateTaskRepository {
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

  async update(id: string, fields: EditableTaskFields): Promise<Task> {
    const update: TaskUpdate = {};
    if (fields.title !== undefined) update.title = fields.title;
    if (fields.description !== undefined)
      update.description = fields.description;
    if (fields.dueDate !== undefined) update.due_date = fields.dueDate;

    const { data, error } = await this.supabase
      .from("tasks")
      .update(update)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw new Error(`Failed to update task: ${error.message}`);
    }

    return taskMapper.toDomain(data);
  }
}
