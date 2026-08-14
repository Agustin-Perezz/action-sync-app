import { Suspense } from "react";
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

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r bg-sidebar md:block">
        <Suspense fallback={<AppSidebar trelloConnected={false} />}>
          <SidebarWithConnection />
        </Suspense>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col min-w-0 md:pl-60">
        <Suspense
          fallback={
            <AppHeader
              userName={user.name ?? user.email}
              trelloConnected={false}
            />
          }
        >
          <HeaderWithConnection userName={user.name ?? user.email} />
        </Suspense>
        <main className="w-full flex-1">{children}</main>
      </div>
    </div>
  );
}

async function SidebarWithConnection() {
  const connection = await getTrelloConnectionStatus();
  return <AppSidebar trelloConnected={connection.connected} />;
}

async function HeaderWithConnection({ userName }: { userName: string }) {
  const connection = await getTrelloConnectionStatus();
  return (
    <AppHeader userName={userName} trelloConnected={connection.connected} />
  );
}
