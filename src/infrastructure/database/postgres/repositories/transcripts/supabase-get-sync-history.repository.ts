import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  GetSyncHistoryRepository,
  TaskCounts,
} from "@/application/use-cases/transcripts/get-sync-history/get-sync-history.repository.interface";
import { TASK_STATUS } from "@/domain/entities/task-status.enum";
import type { Transcript } from "@/domain/entities/transcript.entity";
import type { Database } from "../../database.types";
import { transcriptMapper } from "../../mappers/transcript.mapper";

export class SupabaseGetSyncHistoryRepository
  implements GetSyncHistoryRepository
{
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async findTranscriptsByUserId(userId: string): Promise<Transcript[]> {
    const { data, error } = await this.supabase
      .from("transcripts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch transcripts: ${error.message}`);
    }

    return data.map((row) => transcriptMapper.toDomain(row));
  }

  async countTasksByTranscriptIds(
    transcriptIds: readonly string[],
  ): Promise<Map<string, TaskCounts>> {
    const [draftResult, syncedResult] = await Promise.all([
      this.supabase
        .from("tasks")
        .select("transcript_id")
        .in("transcript_id", [...transcriptIds])
        .eq("status", TASK_STATUS.DRAFT),
      this.supabase
        .from("tasks")
        .select("transcript_id")
        .in("transcript_id", [...transcriptIds])
        .eq("status", TASK_STATUS.SYNCED),
    ]);

    if (draftResult.error) {
      throw new Error(
        `Failed to count draft tasks: ${draftResult.error.message}`,
      );
    }
    if (syncedResult.error) {
      throw new Error(
        `Failed to count synced tasks: ${syncedResult.error.message}`,
      );
    }

    const result = new Map<string, TaskCounts>();
    for (const row of draftResult.data) {
      const existing = result.get(row.transcript_id) ?? { draft: 0, synced: 0 };
      existing.draft += 1;
      result.set(row.transcript_id, existing);
    }
    for (const row of syncedResult.data) {
      const existing = result.get(row.transcript_id) ?? { draft: 0, synced: 0 };
      existing.synced += 1;
      result.set(row.transcript_id, existing);
    }
    return result;
  }
}
