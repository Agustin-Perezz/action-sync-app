import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MOCK_HISTORY } from "../types";
import { SyncHistoryEmptyState } from "./SyncHistoryEmptyState";
import { SyncHistoryRow } from "./SyncHistoryRow";

export function SyncHistoryList() {
  if (MOCK_HISTORY.length === 0) {
    return <SyncHistoryEmptyState />;
  }

  return (
    <Card className="rounded-2xl">
      <CardContent className="flex flex-col">
        {MOCK_HISTORY.map((entry, index) => (
          <div key={entry.id}>
            {index > 0 && <Separator className="my-3" />}
            <SyncHistoryRow entry={entry} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
