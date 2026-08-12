import { TrelloConnectionBanner } from "./components/TrelloConnectionBanner";
import { UploadForm } from "./components/UploadForm";
import { getTrelloConnectionStatus } from "./lib/trello-connection";

export default async function UploadDashboardPage() {
  const connection = await getTrelloConnectionStatus();

  return (
    <div className="mx-auto flex max-w-2xl flex-col px-6 py-16">
      <header className="mb-8">
        <h1 className="text-2xl font-medium tracking-tight">New Transcript</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Upload a .txt meeting transcript or paste raw text. We&apos;ll extract
          actionable tasks.
        </p>
      </header>
      <TrelloConnectionBanner connected={connection.connected} />
      <UploadForm />
    </div>
  );
}
