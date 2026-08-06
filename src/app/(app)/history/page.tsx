import { SyncHistoryHeader } from "./components/SyncHistoryHeader";
import { SyncHistoryList } from "./components/SyncHistoryList";

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <SyncHistoryHeader />
      <SyncHistoryList />
    </div>
  );
}
