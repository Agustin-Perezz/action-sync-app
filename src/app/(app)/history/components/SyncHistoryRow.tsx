import { FileText } from "lucide-react";
import Link from "next/link";

import type { SyncHistoryEntry } from "../types";
import { STATUS_LABELS, STATUS_STYLES } from "../types";

const REVIEW_PATH = "/review";

export type SyncHistoryRowProps = {
  readonly entry: SyncHistoryEntry;
};

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function SyncHistoryRow({ entry }: SyncHistoryRowProps) {
  return (
    <Link
      href={`${REVIEW_PATH}?transcript=${entry.id}`}
      className="flex items-center justify-between gap-4 py-3 transition-colors hover:bg-accent/50"
    >
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex items-center gap-2">
          <FileText className="size-4 shrink-0 text-muted-foreground" />
          <span className="truncate text-sm font-medium">{entry.title}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {entry.board ? `→ ${entry.board} / ${entry.list}` : "\u00A0"}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">
          {entry.taskCount} tasks
        </span>
        <span className="text-xs text-muted-foreground">
          {formatTimestamp(entry.timestamp)}
        </span>
        <span
          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[entry.status]}`}
        >
          {STATUS_LABELS[entry.status]}
        </span>
      </div>
    </Link>
  );
}
