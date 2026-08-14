import { Suspense } from "react";
import { getUser } from "@/lib/shared/infrastructure/auth.server";
import { getSyncHistory } from "./actions";
import { SyncHistoryHeader } from "./components/SyncHistoryHeader";
import { SyncHistoryList } from "./components/SyncHistoryList";
import type { SyncHistoryEntry } from "./types";

export default async function HistoryPage() {
  const user = await getUser();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <SyncHistoryHeader />
      <Suspense fallback={<SyncHistoryListSkeleton />}>
        <SyncHistoryListLoader authenticated={!!user} />
      </Suspense>
    </div>
  );
}

async function SyncHistoryListLoader({
  authenticated,
}: {
  authenticated: boolean;
}) {
  const entries: SyncHistoryEntry[] = authenticated
    ? await getSyncHistory()
    : [];
  return <SyncHistoryList entries={entries} />;
}

function SyncHistoryListSkeleton() {
  return (
    <div className="rounded-2xl border">
      <div className="flex flex-col gap-4 p-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-muted/50" />
        ))}
      </div>
    </div>
  );
}
