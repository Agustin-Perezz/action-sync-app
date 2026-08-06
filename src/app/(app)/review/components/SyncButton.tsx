"use client";

import { ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export type SyncButtonProps = {
  readonly isSyncing: boolean;
  readonly onSync: () => void;
};

export function SyncButton({ isSyncing, onSync }: SyncButtonProps) {
  return (
    <Button
      onClick={onSync}
      disabled={isSyncing}
      size="sm"
      className="gap-1.5 rounded-xl"
    >
      {isSyncing ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <ArrowRight className="size-3.5" />
      )}
      Sync to Trello
    </Button>
  );
}
