"use client";

import { BoardSelector } from "./BoardSelector";
import type { ReviewControlsProps } from "./review-controls-props";
import { SyncButton } from "./SyncButton";

export function ReviewControls({
  taskCount,
  board,
  list,
  boards,
  lists,
  isSyncing,
  syncError,
  onBoardChange,
  onListChange,
  onSync,
}: ReviewControlsProps) {
  return (
    <div className="sticky top-14 z-10 flex flex-col gap-2 border-b bg-background/80 px-6 py-3 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h1 className="text-sm font-semibold">Review extracted tasks</h1>
          <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">
            {taskCount} tasks
          </span>
        </div>
        <div className="flex items-center gap-2">
          <BoardSelector
            label="Board"
            value={board}
            options={boards}
            onSelect={onBoardChange}
          />
          <BoardSelector
            label="List"
            value={list}
            options={lists}
            onSelect={onListChange}
          />
          <SyncButton isSyncing={isSyncing} disabled={!list} onSync={onSync} />
        </div>
      </div>
      {syncError && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {syncError}
        </p>
      )}
    </div>
  );
}
