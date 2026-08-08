import type { Task } from "@/domain/entities/task.entity";
import type { TrelloConnection } from "@/domain/entities/trello-connection.entity";

export interface GetReviewDataRepository {
  findDraftTasksByTranscript(transcriptId: string): Promise<Task[]>;
  findTrelloConnection(userId: string): Promise<TrelloConnection | null>;
}
