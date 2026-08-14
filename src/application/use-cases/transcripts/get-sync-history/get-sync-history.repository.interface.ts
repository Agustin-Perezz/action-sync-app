import type { Transcript } from "@/domain/entities/transcript.entity";

export type TaskCounts = { draft: number; synced: number };

export interface GetSyncHistoryRepository {
  /** Returns transcripts for the user ordered by created_at descending. */
  findTranscriptsByUserId(userId: string): Promise<Transcript[]>;
  /** Returns task counts (draft + synced) keyed by transcript_id for the given transcript ids. */
  countTasksByTranscriptIds(
    transcriptIds: readonly string[],
  ): Promise<Map<string, TaskCounts>>;
}
