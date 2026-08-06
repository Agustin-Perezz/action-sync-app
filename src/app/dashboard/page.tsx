import { requireUser } from "@/lib/shared/infrastructure/auth.server";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Signed in as {user.email}
        </p>
      </div>
    </div>
  );
}
