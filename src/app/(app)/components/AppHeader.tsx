"use client";

import { ChevronDown, LogOut, User } from "lucide-react";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { signOut } from "../actions";
import { MobileNavSheet } from "./MobileNavSheet";

export type AppHeaderProps = {
  readonly userName: string;
  readonly trelloConnected: boolean;
};

export function AppHeader({ userName, trelloConnected }: AppHeaderProps) {
  const [isSigningOut, startTransition] = useTransition();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b bg-background/80 px-4 backdrop-blur supports-backdrop-filter:bg-background/60 md:px-6">
      <div className="flex shrink-0 items-center gap-2">
        <MobileNavSheet trelloConnected={trelloConnected} />
        <div className="flex items-center gap-1.5 text-sm">
          <span className="font-medium">ActionSync</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </div>
      </div>
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="hidden size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground md:flex">
          <User className="size-4" />
        </div>
        <span className="truncate text-sm font-medium">{userName}</span>
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={isSigningOut}
          onClick={() => startTransition(() => signOut())}
          aria-label="Log out"
          className="shrink-0 text-muted-foreground hover:text-destructive"
        >
          <LogOut className="size-4" />
        </Button>
      </div>
    </header>
  );
}
