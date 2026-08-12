import { requireUser } from "@/lib/shared/infrastructure/auth.server";
import { AppHeader } from "./components/AppHeader";
import { AppSidebar } from "./components/AppSidebar";
import { getTrelloConnectionStatus } from "./lib/trello-connection";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireUser();
  const connection = await getTrelloConnectionStatus();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r bg-sidebar md:block">
        <AppSidebar trelloConnected={connection.connected} />
      </aside>
      <div className="flex min-h-screen flex-1 flex-col min-w-0 md:pl-60">
        <AppHeader
          userName={user.name ?? user.email}
          trelloConnected={connection.connected}
        />
        <main className="w-full flex-1">{children}</main>
      </div>
    </div>
  );
}
