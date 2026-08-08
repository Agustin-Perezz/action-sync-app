import type { Transcript } from "@/domain/entities/transcript.entity";

export type TaskCounts = { draft: number; synced: number };

export interface GetSyncHistoryRepository {
  /** Returns transcripts for the user ordered by created_at descending. */
  findTranscriptsByUserId(userId: string): Promise<Transcript[]>;
  countTasksByTranscript(transcriptId: string): Promise<TaskCounts>;
}
