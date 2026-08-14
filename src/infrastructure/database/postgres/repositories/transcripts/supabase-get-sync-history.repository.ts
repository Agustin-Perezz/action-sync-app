import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  GetSyncHistoryRepository,
  TaskCounts,
} from "@/application/use-cases/transcripts/get-sync-history/get-sync-history.repository.interface";
import { TASK_STATUS } from "@/domain/entities/task-status.enum";
import type { Transcript } from "@/domain/entities/transcript.entity";
import type { Database } from "../../database.types";
import { transcriptMapper } from "../../mappers/transcript.mapper";

type CountRow = {
  transcript_id: string;
  status: string;
  count: number;
};

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

  async countTasksByUserTranscripts(
    userId: string,
  ): Promise<Map<string, TaskCounts>> {
    const { data, error } = await this.supabase
      .from("tasks")
      .select("transcript_id,status,id.count()")
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to count tasks: ${error.message}`);
    }

    const result = new Map<string, TaskCounts>();
    for (const row of data as CountRow[]) {
      const existing = result.get(row.transcript_id) ?? {
        draft: 0,
        synced: 0,
      };
      if (row.status === TASK_STATUS.DRAFT) {
        existing.draft += row.count;
      } else if (row.status === TASK_STATUS.SYNCED) {
        existing.synced += row.count;
      }
      result.set(row.transcript_id, existing);
    }
    return result;
  }
}
