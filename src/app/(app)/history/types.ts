export type SyncStatus = "synced" | "failed" | "pending";

export type SyncHistoryEntry = {
  id: string;
  fileName: string;
  taskCount: number;
  board: string;
  list: string;
  timestamp: string;
  status: SyncStatus;
};

export const MOCK_HISTORY: readonly SyncHistoryEntry[] = [
  {
    id: "sync-1",
    fileName: "standup-2026-03-12.txt",
    taskCount: 12,
    board: "Product Roadmap",
    list: "To Do",
    timestamp: "Mar 12, 2026 · 14:32",
    status: "synced",
  },
  {
    id: "sync-2",
    fileName: "q2-kickoff-2026-03-04.txt",
    taskCount: 8,
    board: "Engineering Board",
    list: "In Progress",
    timestamp: "Mar 04, 2026 · 10:15",
    status: "synced",
  },
  {
    id: "sync-3",
    fileName: "design-sync-2026-02-28.txt",
    taskCount: 5,
    board: "Marketing Sprint",
    list: "To Do",
    timestamp: "Feb 28, 2026 · 16:48",
    status: "failed",
  },
  {
    id: "sync-4",
    fileName: "retro-2026-02-21.txt",
    taskCount: 14,
    board: "Product Roadmap",
    list: "Done",
    timestamp: "Feb 21, 2026 · 11:02",
    status: "synced",
  },
  {
    id: "sync-5",
    fileName: "sales-handoff-2026-02-18.txt",
    taskCount: 3,
    board: "Engineering Board",
    list: "To Do",
    timestamp: "Feb 18, 2026 · 09:30",
    status: "pending",
  },
] as const;

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
