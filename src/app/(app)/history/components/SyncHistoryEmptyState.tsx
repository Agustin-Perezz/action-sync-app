export function SyncHistoryEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
      <p className="text-sm font-medium">No syncs yet</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Upload a transcript to get started.
      </p>
    </div>
  );
}
