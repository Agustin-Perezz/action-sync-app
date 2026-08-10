export type SyncStatus = "synced" | "failed" | "pending";

export type SyncHistoryEntry = {
  id: string;
  title: string;
  taskCount: number;
  board: string;
  list: string;
  timestamp: string;
  status: SyncStatus;
};

export const STATUS_STYLES: Record<SyncStatus, string> = {
  synced: "border-emerald-200 bg-emerald-50 text-emerald-700",
  failed: "border-red-200 bg-red-50 text-red-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
};

export const STATUS_LABELS: Record<SyncStatus, string> = {
  synced: "Synced",
  failed: "Failed",
  pending: "Pending",
};
