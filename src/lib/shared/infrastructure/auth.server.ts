import { redirect } from "next/navigation";
import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/shared/infrastructure/supabase.server";
import { AUTH_CALLBACK_PATH, HOME_PATH, SIGNIN_PATH } from "./auth-paths";

export type User = {
  id: string;
  email: string;
  name?: string;
};

export { AUTH_CALLBACK_PATH, HOME_PATH, SIGNIN_PATH };

export async function getUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? "",
    name: user.user_metadata?.full_name ?? user.user_metadata?.name,
  };
}

// ponytail: per-request dedup — layout + page + trello-connection all call
// getUser()/requireUser() on the same request. Without cache() that's 4
// auth.getUser() round trips to remote Supabase per page load (~1.6s on
// Vercel). cache() collapses them to one. Same fix applied to requireUser.
export const getCachedUser = cache(getUser);

export async function requireUser(): Promise<User> {
  const user = await getCachedUser();

  if (!user) {
    redirect(SIGNIN_PATH);
  }

  return user;
}
