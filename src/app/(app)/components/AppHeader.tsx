import { ChevronDown, User } from "lucide-react";

import { MobileNavSheet } from "./MobileNavSheet";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b bg-background/80 px-4 backdrop-blur supports-backdrop-filter:bg-background/60 md:px-6">
      <div className="flex items-center gap-2">
        <MobileNavSheet />
        <div className="flex items-center gap-1.5 text-sm">
          <span className="font-medium">Acme Workspace</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <User className="size-4" />
        </div>
        <span className="text-sm font-medium">Alex Carter</span>
      </div>
    </header>
  );
}
