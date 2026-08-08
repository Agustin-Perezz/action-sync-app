export const SYNC_HISTORY_STATUS = {
  SYNCED: "synced",
  PENDING: "pending",
  FAILED: "failed",
} as const;

export type SyncHistoryStatus =
  (typeof SYNC_HISTORY_STATUS)[keyof typeof SYNC_HISTORY_STATUS];

export type SyncHistoryEntry = {
  id: string;
  title: string;
  taskCount: number;
  board: string;
  list: string;
  timestamp: string;
  status: SyncHistoryStatus;
};
