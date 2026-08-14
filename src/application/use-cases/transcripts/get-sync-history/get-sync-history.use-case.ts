import { toHistoryEntry } from "./get-sync-history.mapping";
import type { GetSyncHistoryRepository } from "./get-sync-history.repository.interface";
import type { GetSyncHistoryRequestDto } from "./get-sync-history.request.dto";
import type { SyncHistoryEntry } from "./get-sync-history.response.dto";

export class GetSyncHistoryUseCase {
  constructor(private readonly repository: GetSyncHistoryRepository) {}

  async execute(dto: GetSyncHistoryRequestDto): Promise<SyncHistoryEntry[]> {
    const [transcripts, countsByTranscript] = await Promise.all([
      this.repository.findTranscriptsByUserId(dto.userId),
      this.repository.countTasksByUserTranscripts(dto.userId),
    ]);

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
