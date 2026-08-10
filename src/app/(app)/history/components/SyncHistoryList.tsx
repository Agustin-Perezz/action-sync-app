import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { SyncHistoryEntry } from "../types";
import { SyncHistoryEmptyState } from "./SyncHistoryEmptyState";
import { SyncHistoryRow } from "./SyncHistoryRow";

export type SyncHistoryListProps = {
  readonly entries: readonly SyncHistoryEntry[];
};

export function SyncHistoryList({ entries }: SyncHistoryListProps) {
  if (entries.length === 0) {
    return <SyncHistoryEmptyState />;
  }

  return (
    <Card className="rounded-2xl">
      <CardContent className="flex flex-col">
        {entries.map((entry, index) => (
          <div key={entry.id}>
            {index > 0 && <Separator className="my-3" />}
            <SyncHistoryRow entry={entry} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
