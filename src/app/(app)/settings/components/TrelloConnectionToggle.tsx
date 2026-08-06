"use client";

import { Check, LogOut, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export type TrelloConnectionToggleProps = {
  readonly connected: boolean;
  readonly onToggle: () => void;
};

export function TrelloConnectionToggle({
  connected,
  onToggle,
}: TrelloConnectionToggleProps) {
  if (connected) {
    return (
      <>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            <Check className="size-3" />
            Connected as Alex Carter
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggle}
          className="gap-1.5 rounded-xl"
        >
          <LogOut className="size-3.5" />
          Disconnect
        </Button>
      </>
    );
  }
  return (
    <>
      <span className="text-sm text-muted-foreground">Not connected</span>
      <Button size="sm" onClick={onToggle} className="gap-1.5 rounded-xl">
        <Plus className="size-3.5" />
        Connect Trello
      </Button>
    </>
  );
}
