import type { SupabaseClient } from "@supabase/supabase-js";
import type { SyncTasksRepository } from "@/application/use-cases/tasks/sync-tasks-to-trello/sync-tasks-to-trello.repository.interface";
import type { Task } from "@/domain/entities/task.entity";
import type { TranscriptStatus } from "@/domain/entities/transcript-status.enum";
import type { TrelloConnection } from "@/domain/entities/trello-connection.entity";
import type { Database } from "../../database.types";
import { taskMapper } from "../../mappers/task.mapper";
import { trelloConnectionMapper } from "../../mappers/trello-connection.mapper";

export class SupabaseSyncTasksRepository implements SyncTasksRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

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

  async findDraftTasksByTranscript(transcriptId: string): Promise<Task[]> {
    const { data, error } = await this.supabase
      .from("tasks")
      .select("*")
      .eq("transcript_id", transcriptId)
      .eq("status", "draft");

    if (error) {
      throw new Error(`Failed to fetch draft tasks: ${error.message}`);
    }

    return data.map((row) => taskMapper.toDomain(row));
  }

  async markSynced(taskId: string, trelloCardId: string): Promise<void> {
    const { error } = await this.supabase
      .from("tasks")
      .update({ status: "synced", trello_card_id: trelloCardId })
      .eq("id", taskId);

    if (error) {
      throw new Error(`Failed to mark task synced: ${error.message}`);
    }
  }

  async updateTranscriptStatus(
    transcriptId: string,
    status: TranscriptStatus,
  ): Promise<void> {
    const { error } = await this.supabase
      .from("transcripts")
      .update({ status })
      .eq("id", transcriptId);

    if (error) {
      throw new Error(`Failed to update transcript status: ${error.message}`);
    }
  }
}
