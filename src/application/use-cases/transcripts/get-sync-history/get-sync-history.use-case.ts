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
    const sorted = [...transcripts].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
    const entries = await Promise.all(
      sorted.map(async (t) => {
        const counts = await this.repository.countTasksByTranscript(t.id);
        return toHistoryEntry(
          {
            id: t.id,
            title: t.title,
            createdAt: t.createdAt,
            status: t.status,
          },
          counts,
        );
      }),
    );
    return entries;
  }
}
