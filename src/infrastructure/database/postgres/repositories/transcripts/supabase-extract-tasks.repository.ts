import type { SupabaseClient } from "@supabase/supabase-js";
import type { ExtractTasksRepository } from "@/application/use-cases/transcripts/extract-tasks/extract-tasks.repository.interface";
import type { Task } from "@/domain/entities/task.entity";
import type { Transcript } from "@/domain/entities/transcript.entity";
import type { TranscriptStatus } from "@/domain/entities/transcript-status.enum";
import type { Database } from "../../database.types";
import { taskMapper } from "../../mappers/task.mapper";
import { transcriptMapper } from "../../mappers/transcript.mapper";

export class SupabaseExtractTasksRepository implements ExtractTasksRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async saveTranscript(transcript: Transcript): Promise<Transcript> {
    const payload = transcriptMapper.toPersistence(transcript);

    const { data, error } = await this.supabase
      .from("transcripts")
      .insert(payload)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save transcript: ${error.message}`);
    }

    return transcriptMapper.toDomain(data);
  }

  async saveTasks(tasks: Task[]): Promise<Task[]> {
    if (tasks.length === 0) {
      return [];
    }

    const payload = tasks.map((task) => taskMapper.toPersistence(task));

    const { data, error } = await this.supabase
      .from("tasks")
      .insert(payload)
      .select();

    if (error) {
      throw new Error(`Failed to save tasks: ${error.message}`);
    }

    return data.map((row) => taskMapper.toDomain(row));
  }

  async deleteDraftTasksByTranscript(transcriptId: string): Promise<void> {
    const { error } = await this.supabase
      .from("tasks")
      .delete()
      .eq("transcript_id", transcriptId)
      .eq("status", "draft");

    if (error) {
      throw new Error(`Failed to delete draft tasks: ${error.message}`);
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
