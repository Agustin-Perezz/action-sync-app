"use client";

import { LogOut } from "lucide-react";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { disconnectTrello } from "../actions";
import { ConnectionBadge } from "./ConnectionBadge";

export type ConnectedToggleProps = {
  readonly memberName: string | null;
};

export function ConnectedToggle({ memberName }: ConnectedToggleProps) {
  const [isPending, startTransition] = useTransition();
  const handleDisconnect = () => startTransition(() => disconnectTrello());

  return (
    <>
      <ConnectionBadge memberName={memberName} />
      <Button
        variant="outline"
        size="sm"
        onClick={handleDisconnect}
        disabled={isPending}
        className="gap-1.5 rounded-xl"
      >
        <LogOut className="size-3.5" />
        Disconnect
      </Button>
    </>
  );
}
