import Link from "next/link";

export type TrelloConnectionBannerProps = {
  readonly connected: boolean;
};

export function TrelloConnectionBanner({
  connected,
}: TrelloConnectionBannerProps) {
  if (connected) return null;

  return (
    <Link
      href="/settings"
      className="mb-6 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 transition-colors hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200"
    >
      <span className="font-medium">
        Trello not connected — link your account in Settings to sync tasks.
      </span>
    </Link>
  );
}
