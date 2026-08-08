import type { TaskCounts } from "./get-sync-history.repository.interface";
import {
  SYNC_HISTORY_STATUS,
  type SyncHistoryEntry,
  type SyncHistoryStatus,
} from "./get-sync-history.response.dto";

// Pure: aggregate transcript status + task counts into a history status.
// - failed transcript → "failed"
// - any draft or reviewing → "pending"
// - completed + all synced → "synced"
export function aggregateStatus(
  transcriptStatus: string,
  counts: TaskCounts,
): SyncHistoryStatus {
  switch (transcriptStatus) {
    case "failed":
      return SYNC_HISTORY_STATUS.FAILED;
    case "reviewing":
      return SYNC_HISTORY_STATUS.PENDING;
    case "processing":
      return SYNC_HISTORY_STATUS.PENDING;
    case "completed":
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
