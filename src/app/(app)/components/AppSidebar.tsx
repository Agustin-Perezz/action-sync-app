import { LayoutGrid } from "lucide-react";

import { SidebarNav } from "./SidebarNav";

type AppSidebarProps = {
  readonly trelloConnected: boolean;
  readonly onNavigate?: () => void;
};

export function AppSidebar({ trelloConnected, onNavigate }: AppSidebarProps) {
  return (
    <div className="flex h-full flex-col gap-6 px-3 py-5">
      <div className="flex items-center gap-2 px-2">
        <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <LayoutGrid className="size-4" />
        </div>
        <span className="font-heading text-sm font-medium tracking-tight">
          ActionSync
        </span>
      </div>
      <SidebarNav trelloConnected={trelloConnected} onNavigate={onNavigate} />
    </div>
  );
}
