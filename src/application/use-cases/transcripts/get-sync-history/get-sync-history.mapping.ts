import { TRANSCRIPT_STATUS } from "@/domain/entities/transcript-status.enum";
import type { TaskCounts } from "./get-sync-history.repository.interface";
import {
  SYNC_HISTORY_STATUS,
  type SyncHistoryEntry,
  type SyncHistoryStatus,
} from "./get-sync-history.response.dto";

// Pure: aggregate transcript status + task counts into a history status.
export function aggregateStatus(
  transcriptStatus: string,
  counts: TaskCounts,
): SyncHistoryStatus {
  switch (transcriptStatus) {
    case TRANSCRIPT_STATUS.FAILED:
      return SYNC_HISTORY_STATUS.FAILED;
    case TRANSCRIPT_STATUS.REVIEWING:
      return SYNC_HISTORY_STATUS.PENDING;
    case TRANSCRIPT_STATUS.PROCESSING:
      return SYNC_HISTORY_STATUS.PENDING;
    case TRANSCRIPT_STATUS.COMPLETED:
      return counts.draft > 0
        ? SYNC_HISTORY_STATUS.PENDING
        : SYNC_HISTORY_STATUS.SYNCED;
    default:
      return SYNC_HISTORY_STATUS.SYNCED;
  }
}

// Pure: map a transcript + task counts to a SyncHistoryEntry.
// board/list empty strings — MVP (no board/list ids stored on task row, spec #71).
export function toHistoryEntry(
  transcript: {
    id: string;
    title: string;
    createdAt: string;
    status: string;
  },
  counts: TaskCounts,
): SyncHistoryEntry {
  return {
    id: transcript.id,
    title: transcript.title,
    taskCount: counts.draft + counts.synced,
    board: "",
    list: "",
    timestamp: transcript.createdAt,
    status: aggregateStatus(transcript.status, counts),
  };
}
