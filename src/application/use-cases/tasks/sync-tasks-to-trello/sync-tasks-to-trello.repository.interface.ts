import type { Task } from "@/domain/entities/task.entity";
import type { TranscriptStatus } from "@/domain/entities/transcript-status.enum";
import type { TrelloConnection } from "@/domain/entities/trello-connection.entity";

export interface SyncTasksRepository {
  findTrelloConnection(userId: string): Promise<TrelloConnection | null>;
  findDraftTasksByTranscript(transcriptId: string): Promise<Task[]>;
  markSynced(taskId: string, trelloCardId: string): Promise<void>;
  updateTranscriptStatus(
    transcriptId: string,
    status: TranscriptStatus,
  ): Promise<void>;
}
