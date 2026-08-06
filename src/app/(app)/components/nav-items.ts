import { FileText, History, Settings } from "lucide-react";

export type NavItem = {
  readonly label: string;
  readonly href: string;
  readonly icon: typeof FileText;
};

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "New Transcript", href: "/", icon: FileText },
  { label: "Sync History", href: "/history", icon: History },
  { label: "Settings", href: "/settings", icon: Settings },
] as const;
