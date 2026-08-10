import { getUser } from "@/lib/shared/infrastructure/auth.server";
import { getSyncHistory } from "./actions";
import { SyncHistoryHeader } from "./components/SyncHistoryHeader";
import { SyncHistoryList } from "./components/SyncHistoryList";

export default async function HistoryPage() {
  const user = await getUser();
  // Anonymous visitors see the empty state; the sync action enforces auth.
  const entries = user ? await getSyncHistory() : [];

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <SyncHistoryHeader />
      <SyncHistoryList entries={entries} />
    </div>
  );
}
