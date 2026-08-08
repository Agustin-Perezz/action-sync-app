import type { TrelloClientPort } from "@/application/ports/trello-client.port";
import {
  TrelloApiError,
  TrelloConnectionNotFoundError,
} from "@/domain/entities/errors";
import { TRANSCRIPT_STATUS } from "@/domain/entities/transcript-status.enum";
import type { SyncTasksRepository } from "./sync-tasks-to-trello.repository.interface";
import type { SyncTasksToTrelloRequestDto } from "./sync-tasks-to-trello.request.dto";
import type { SyncTasksToTrelloResponseDto } from "./sync-tasks-to-trello.response.dto";

export class SyncTasksToTrelloUseCase {
  constructor(
    private readonly repository: SyncTasksRepository,
    private readonly trelloClient: TrelloClientPort,
  ) {}

  async execute(
    dto: SyncTasksToTrelloRequestDto,
  ): Promise<SyncTasksToTrelloResponseDto> {
    const connection = await this.repository.findTrelloConnection(dto.userId);
    if (!connection) {
      throw new TrelloConnectionNotFoundError(dto.userId);
    }

    const tasks = await this.repository.findDraftTasksByTranscript(
      dto.transcriptId,
    );

    if (tasks.length === 0) {
      await this.repository.updateTranscriptStatus(
        dto.transcriptId,
        TRANSCRIPT_STATUS.COMPLETED,
      );
      return { syncedCount: 0 };
    }

    let syncedCount = 0;
    for (const task of tasks) {
      try {
        const card = await this.trelloClient.createCard(
          {
            idList: dto.listId,
            name: task.title,
            desc: task.description,
            due: task.dueDate,
          },
          connection.accessToken,
        );
        await this.repository.markSynced(task.id, card.id);
        syncedCount++;
      } catch (error) {
        // fail-fast: synced stay synced, unsynced stay draft, transcript reviewing.
        throw new TrelloApiError(
          `Failed to sync task "${task.title}": ${
            error instanceof Error ? error.message : "unknown error"
          }`,
        );
      }
    }

    await this.repository.updateTranscriptStatus(
      dto.transcriptId,
      TRANSCRIPT_STATUS.COMPLETED,
    );
    return { syncedCount };
  }
}
