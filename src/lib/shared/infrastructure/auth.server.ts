import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/shared/infrastructure/supabase.server";

export type User = {
  id: string;
  email: string;
  name?: string;
};

export const SIGNIN_PATH = "/signin";
export const DASHBOARD_PATH = "/dashboard";
export const AUTH_CALLBACK_PATH = "/auth/callback";

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

export async function requireUser(): Promise<User> {
  const user = await getUser();

  if (!user) {
    redirect(SIGNIN_PATH);
  }

  return user;
}
