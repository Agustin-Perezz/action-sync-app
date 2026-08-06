import { AppHeader } from "./components/AppHeader";
import { AppSidebar } from "./components/AppSidebar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r bg-sidebar md:block">
        <AppSidebar />
      </aside>
      <div className="flex min-h-screen flex-1 flex-col md:pl-60">
        <AppHeader />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
