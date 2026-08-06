import { FileText } from "lucide-react";

import type { SyncHistoryEntry } from "../types";
import { STATUS_LABELS, STATUS_STYLES } from "../types";

export type SyncHistoryRowProps = {
  readonly entry: SyncHistoryEntry;
};

export function SyncHistoryRow({ entry }: SyncHistoryRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex items-center gap-2">
          <FileText className="size-4 shrink-0 text-muted-foreground" />
          <span className="truncate text-sm font-medium">{entry.fileName}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          → {entry.board} / {entry.list}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">
          {entry.taskCount} tasks
        </span>
        <span className="text-xs text-muted-foreground">{entry.timestamp}</span>
        <span
          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[entry.status]}`}
        >
          {STATUS_LABELS[entry.status]}
        </span>
      </div>
    </div>
  );
}
