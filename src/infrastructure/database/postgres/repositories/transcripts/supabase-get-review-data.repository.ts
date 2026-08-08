import type { SupabaseClient } from "@supabase/supabase-js";
import type { GetReviewDataRepository } from "@/application/use-cases/transcripts/get-review-data/get-review-data.repository.interface";
import type { Task } from "@/domain/entities/task.entity";
import { TASK_STATUS } from "@/domain/entities/task-status.enum";
import type { TrelloConnection } from "@/domain/entities/trello-connection.entity";
import type { Database } from "../../database.types";
import { taskMapper } from "../../mappers/task.mapper";
import { trelloConnectionMapper } from "../../mappers/trello-connection.mapper";

export class SupabaseGetReviewDataRepository
  implements GetReviewDataRepository
{
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async findDraftTasksByTranscript(transcriptId: string): Promise<Task[]> {
    const { data, error } = await this.supabase
      .from("tasks")
      .select("*")
      .eq("transcript_id", transcriptId)
      .eq("status", TASK_STATUS.DRAFT);

    if (error) {
      throw new Error(`Failed to fetch draft tasks: ${error.message}`);
    }

    return data.map((row) => taskMapper.toDomain(row));
  }

  async findTrelloConnection(userId: string): Promise<TrelloConnection | null> {
    const { data, error } = await this.supabase
      .from("trello_connections")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch trello connection: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return trelloConnectionMapper.toDomain(data);
  }
}
