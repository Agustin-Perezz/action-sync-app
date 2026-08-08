import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  GetSyncHistoryRepository,
  TaskCounts,
} from "@/application/use-cases/transcripts/get-sync-history/get-sync-history.repository.interface";
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

  async countTasksByTranscript(transcriptId: string): Promise<TaskCounts> {
    const { count: draftCount, error: draftError } = await this.supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("transcript_id", transcriptId)
      .eq("status", "draft");

    if (draftError) {
      throw new Error(`Failed to count draft tasks: ${draftError.message}`);
    }

    const { count: syncedCount, error: syncedError } = await this.supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("transcript_id", transcriptId)
      .eq("status", "synced");

    if (syncedError) {
      throw new Error(`Failed to count synced tasks: ${syncedError.message}`);
    }

    return { draft: draftCount ?? 0, synced: syncedCount ?? 0 };
  }
}
