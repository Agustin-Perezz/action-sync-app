import type { Transcript } from "@/domain/entities/transcript.entity";

export type TaskCounts = { draft: number; synced: number };

export interface GetSyncHistoryRepository {
  findTranscriptsByUserId(userId: string): Promise<Transcript[]>;
  countTasksByTranscript(transcriptId: string): Promise<TaskCounts>;
}
