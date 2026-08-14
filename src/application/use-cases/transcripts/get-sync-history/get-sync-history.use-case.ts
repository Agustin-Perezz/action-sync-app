import { toHistoryEntry } from "./get-sync-history.mapping";
import type { GetSyncHistoryRepository } from "./get-sync-history.repository.interface";
import type { GetSyncHistoryRequestDto } from "./get-sync-history.request.dto";
import type { SyncHistoryEntry } from "./get-sync-history.response.dto";

export class GetSyncHistoryUseCase {
  constructor(private readonly repository: GetSyncHistoryRepository) {}

  async execute(dto: GetSyncHistoryRequestDto): Promise<SyncHistoryEntry[]> {
    const transcripts = await this.repository.findTranscriptsByUserId(
      dto.userId,
    );

    if (transcripts.length === 0) {
      return [];
    }

    const countsByTranscript = await this.repository.countTasksByTranscriptIds(
      transcripts.map((t) => t.id),
    );

    return transcripts.map((t) => {
      const counts = countsByTranscript.get(t.id) ?? { draft: 0, synced: 0 };
      return toHistoryEntry(
        {
          id: t.id,
          title: t.title,
          createdAt: t.createdAt,
          status: t.status,
        },
        counts,
      );
    });
  }
}
