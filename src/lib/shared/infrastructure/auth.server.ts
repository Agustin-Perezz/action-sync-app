import { redirect } from "next/navigation";
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

export async function requireUser(): Promise<User> {
  const user = await getUser();

  if (!user) {
    redirect(SIGNIN_PATH);
  }

  return user;
}
