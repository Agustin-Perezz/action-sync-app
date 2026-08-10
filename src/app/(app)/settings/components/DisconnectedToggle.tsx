"use client";

import { Plus } from "lucide-react";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { initiateTrelloConnect } from "../actions";

export function DisconnectedToggle() {
  const [isPending, startTransition] = useTransition();
  const handleConnect = () =>
    startTransition(async () => {
      window.location.href = await initiateTrelloConnect();
    });

  return (
    <>
      <span className="text-sm text-muted-foreground">Not connected</span>
      <Button
        size="sm"
        onClick={handleConnect}
        disabled={isPending}
        className="gap-1.5 rounded-xl"
      >
        <Plus className="size-3.5" />
        Connect Trello
      </Button>
    </>
  );
}
